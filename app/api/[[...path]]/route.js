
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  sendProjectRequestConfirmation, 
  sendStatusUpdateEmail, 
  sendContactFormConfirmation, 
  sendContactFormNotification,
  sendRestorationRequestEmail,
  sendProjectBlockedEmail,
  sendProjectUnblockedEmail,
  sendRestorationApprovedEmail,
  sendRestorationRejectedEmail,
  sendProjectExpiredEmail,
  sendProjectExtendedEmail
} from '@/lib/email'
import { sendProjectApprovedNotification } from '@/lib/discord'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Supabase client
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // ==================== CONTACT FORM ENDPOINTS ====================

    // Submit contact form - POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      
      if (!body.name || !body.email || !body.subject || !body.message) {
        return handleCORS(NextResponse.json(
          { error: "Alle Felder sind erforderlich" }, 
          { status: 400 }
        ))
      }

      const contactObj = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        timestamp: new Date(),
        status: 'new'
      }

      await db.collection('contact_messages').insertOne(contactObj)

      // Send email notifications using email library
      try {
        // 1. Send notification to admin
        await sendContactFormNotification(body.name, body.email, body.subject, body.message)
        
        // 2. Send confirmation to sender
        await sendContactFormConfirmation(body.email, body.name, body.subject, body.message)
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the request if email fails
      }

      return handleCORS(NextResponse.json({ 
        success: true,
        message: "Ihre Nachricht wurde erfolgreich gesendet" 
      }))
    }

    // ==================== PROJECT REQUESTS ENDPOINTS ====================

    // Create new project request - POST /api/project-requests
    if (route === '/project-requests' && method === 'POST') {
      const body = await request.json()
      const supabase = getSupabaseClient()
      
      if (!body.project_name || !body.project_type || !body.email || !body.description) {
        return handleCORS(NextResponse.json(
          { error: "Alle Felder sind erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get user_id from auth header or session
      const authHeader = request.headers.get('authorization')
      let userId = body.user_id // Allow passing user_id from client
      
      // If no user_id provided, try to get from session
      if (!userId && authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (user) {
          userId = user.id
        }
      }

      // Insert into Supabase
      const insertData = {
        project_name: body.project_name,
        project_type: body.project_type,
        email: body.email,
        description: body.description,
        status: 'pending'
      }

      // Add optional fields
      if (userId) {
        insertData.user_id = userId
      }
      
      if (body.project_link) {
        insertData.project_link = body.project_link
      }

      const { data, error } = await supabase
        .from('project_requests')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Erstellen der Anfrage" }, 
          { status: 500 }
        ))
      }

      // Send confirmation email
      await sendProjectRequestConfirmation(
        body.email,
        body.project_name,
        body.project_type
      )

      return handleCORS(NextResponse.json(data))
    }

    // Get all project requests - GET /api/project-requests (Admin only)
    if (route === '/project-requests' && method === 'GET') {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Laden der Anfragen" }, 
          { status: 500 }
        ))
      }

      // Merge with block details from MongoDB
      try {
        const blockedProjectIds = data.filter(p => p.status === 'blocked').map(p => p.id)
        if (blockedProjectIds.length > 0) {
          const blockDetails = await db.collection('project_blocks')
            .find({ project_id: { $in: blockedProjectIds } })
            .toArray()
          
          const blockDetailsMap = {}
          blockDetails.forEach(block => {
            blockDetailsMap[block.project_id] = block
          })

          data.forEach(project => {
            if (blockDetailsMap[project.id]) {
              project.block_reason = blockDetailsMap[project.id].block_reason
              project.blocked_by = blockDetailsMap[project.id].blocked_by
              project.blocked_at = blockDetailsMap[project.id].blocked_at
            }
          })
        }
      } catch (mongoError) {
        console.error('MongoDB fetch error:', mongoError)
        // Continue without block details
      }

      return handleCORS(NextResponse.json(data))
    }

    // Get approved projects - GET /api/projects/approved (Public endpoint)
    if (route === '/projects/approved' && method === 'GET') {
      const supabase = getSupabaseClient()
      
      // Get all approved projects (including potentially expired ones)
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Laden der Projekte" }, 
          { status: 500 }
        ))
      }

      // Check for expired projects and update them
      const now = new Date()
      const activeProjects = []
      
      for (const project of data) {
        if (project.is_active && project.expiration_date) {
          const expirationDate = new Date(project.expiration_date)
          
          if (expirationDate <= now) {
            // Project has expired, update it
            await supabase
              .from('project_requests')
              .update({ is_active: false })
              .eq('id', project.id)
            
            // Don't include in active projects
            console.log(`⏰ Project expired: ${project.project_name}`)
            continue
          }
        }
        
        // Only include active projects
        if (project.is_active) {
          activeProjects.push(project)
        }
      }

      return handleCORS(NextResponse.json(activeProjects))
    }

    // Get user's own project requests - GET /api/my-projects?email=xxx
    if (route === '/my-projects' && method === 'GET') {
      const supabase = getSupabaseClient()
      const url = new URL(request.url)
      const email = url.searchParams.get('email')

      if (!email) {
        return handleCORS(NextResponse.json(
          { error: "E-Mail ist erforderlich" }, 
          { status: 400 }
        ))
      }

      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Laden der Projekte" }, 
          { status: 500 }
        ))
      }

      // Check for expired projects and update them
      const now = new Date()
      for (const project of data) {
        if (project.status === 'approved' && 
            project.is_active && 
            project.expiration_date) {
          const expirationDate = new Date(project.expiration_date)
          
          if (expirationDate <= now) {
            // Project has expired, update it
            await supabase
              .from('project_requests')
              .update({ is_active: false })
              .eq('id', project.id)
            
            // Update the data object to reflect the change
            project.is_active = false
            
            // Send expiration email
            try {
              await sendProjectExpiredEmail(
                project.email,
                project.project_name,
                project.extension_count || 0
              )
              console.log(`✅ Project expired and email sent: ${project.project_name}`)
            } catch (emailError) {
              console.error('Email error for project', project.id, ':', emailError)
            }
          }
        }
      }

      // Merge with block details from MongoDB
      try {
        const blockedProjects = data.filter(p => p.status === 'blocked')
        if (blockedProjects.length > 0) {
          const blockedProjectIds = blockedProjects.map(p => p.id)
          const blockDetails = await db.collection('project_blocks')
            .find({ project_id: { $in: blockedProjectIds } })
            .toArray()
          
          const blockDetailsMap = {}
          blockDetails.forEach(block => {
            blockDetailsMap[block.project_id] = block
          })

          data.forEach(project => {
            if (blockDetailsMap[project.id]) {
              project.block_reason = blockDetailsMap[project.id].block_reason
              project.blocked_by = blockDetailsMap[project.id].blocked_by
              project.blocked_at = blockDetailsMap[project.id].blocked_at
            }
          })
        }
      } catch (mongoError) {
        console.error('MongoDB fetch error:', mongoError)
        // Continue without block details
      }

      return handleCORS(NextResponse.json(data))
    }

    // Update project request status - PATCH /api/project-requests/:id
    const updateRequestMatch = route.match(/^\/project-requests\/(.+)$/)
    if (updateRequestMatch && method === 'PATCH') {
      const requestId = updateRequestMatch[1]
      const body = await request.json()
      const supabase = getSupabaseClient()

      if (!body.status) {
        return handleCORS(NextResponse.json(
          { error: "Status ist erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden" }, 
          { status: 404 }
        ))
      }

      // Prepare update data
      const updateData = { status: body.status }

      // If approving for the first time, set expiration fields
      if (body.status === 'approved' && currentData.status !== 'approved') {
        // Random duration between 1-12 months
        const durationMonths = Math.floor(Math.random() * 12) + 1
        const approvalDate = new Date()
        const expirationDate = new Date()
        expirationDate.setMonth(expirationDate.getMonth() + durationMonths)

        updateData.approval_date = approvalDate.toISOString()
        updateData.expiration_date = expirationDate.toISOString()
        updateData.duration_months = durationMonths
        updateData.extension_count = 0
        updateData.is_active = true
      }

      // Update status
      const { data, error } = await supabase
        .from('project_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Aktualisieren der Anfrage" }, 
          { status: 500 }
        ))
      }

      // Send status update email
      try {
        await sendStatusUpdateEmail(
          currentData.email,
          currentData.project_name,
          currentData.status,
          body.status
        )
      } catch (emailError) {
        console.error('Email error:', emailError)
      }

      // Send Discord notification if project is approved
      if (body.status === 'approved' && currentData.status !== 'approved') {
        try {
          await sendProjectApprovedNotification(data)
          console.log('✅ Discord notification sent for approved project:', data.project_name)
        } catch (discordError) {
          console.error('Discord notification error:', discordError)
          // Don't fail the request if Discord notification fails
        }
      }

      return handleCORS(NextResponse.json(data))
    }

    // Remove project (user removes their own project) - DELETE /api/project-requests/:id/remove
    const removeRequestMatch = route.match(/^\/project-requests\/(.+)\/remove$/)
    if (removeRequestMatch && method === 'DELETE') {
      const requestId = removeRequestMatch[1]
      const body = await request.json()
      const supabase = getSupabaseClient()

      if (!body.email) {
        return handleCORS(NextResponse.json(
          { error: "E-Mail ist erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .eq('email', body.email)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden oder keine Berechtigung" }, 
          { status: 404 }
        ))
      }

      // Update status to 'removed' instead of deleting
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'removed' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Entfernen des Projekts" }, 
          { status: 500 }
        ))
      }

      // Send removal confirmation email
      const { sendProjectRemovalEmail } = await import('@/lib/email')
      await sendProjectRemovalEmail(
        currentData.email,
        currentData.project_name
      )

      return handleCORS(NextResponse.json({ 
        success: true, 
        message: "Projekt wurde erfolgreich entfernt" 
      }))
    }

    // Block project - POST /api/project-requests/:id/block
    const blockRequestMatch = route.match(/^\/project-requests\/(.+)\/block$/)
    if (blockRequestMatch && method === 'POST') {
      const requestId = blockRequestMatch[1]
      const body = await request.json()
      const supabase = getSupabaseClient()

      if (!body.reason || !body.blocked_by) {
        return handleCORS(NextResponse.json(
          { error: "Sperrgrund und Name des Teamlers sind erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !currentData) {
        console.error('Supabase fetch error:', fetchError)
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden" }, 
          { status: 404 }
        ))
      }

      // Update status to 'blocked' in Supabase
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'blocked' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: `Fehler beim Sperren des Projekts: ${error.message || 'Unbekannter Fehler'}` }, 
          { status: 500 }
        ))
      }

      // Store block details in MongoDB
      try {
        await db.collection('project_blocks').insertOne({
          project_id: requestId,
          project_name: currentData.project_name,
          block_reason: body.reason,
          blocked_by: body.blocked_by,
          blocked_at: new Date(),
          email: currentData.email
        })
      } catch (mongoError) {
        console.error('MongoDB insert error:', mongoError)
        // Continue even if MongoDB insert fails
      }

      // Send blocked email
      try {
        await sendProjectBlockedEmail(
          currentData.email,
          currentData.project_name,
          body.reason,
          body.blocked_by
        )
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }

      return handleCORS(NextResponse.json(data))
    }

    // Unblock project - POST /api/project-requests/:id/unblock
    const unblockRequestMatch = route.match(/^\/project-requests\/(.+)\/unblock$/)
    if (unblockRequestMatch && method === 'POST') {
      const requestId = unblockRequestMatch[1]
      const supabase = getSupabaseClient()

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !currentData) {
        console.error('Supabase fetch error:', fetchError)
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden" }, 
          { status: 404 }
        ))
      }

      // Update status to 'approved' in Supabase
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: `Fehler beim Entsperren des Projekts: ${error.message || 'Unbekannter Fehler'}` }, 
          { status: 500 }
        ))
      }

      // Remove block details from MongoDB
      try {
        await db.collection('project_blocks').deleteOne({ project_id: requestId })
      } catch (mongoError) {
        console.error('MongoDB delete error:', mongoError)
        // Continue even if MongoDB delete fails
      }

      // Send unblocked email
      try {
        await sendProjectUnblockedEmail(
          currentData.email,
          currentData.project_name
        )
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }

      return handleCORS(NextResponse.json(data))
    }

    // Request restoration - POST /api/project-requests/:id/request-restoration
    const requestRestorationMatch = route.match(/^\/project-requests\/(.+)\/request-restoration$/)
    if (requestRestorationMatch && method === 'POST') {
      const requestId = requestRestorationMatch[1]
      const body = await request.json()
      const supabase = getSupabaseClient()

      if (!body.email) {
        return handleCORS(NextResponse.json(
          { error: "E-Mail ist erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .eq('email', body.email)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden oder keine Berechtigung" }, 
          { status: 404 }
        ))
      }

      if (currentData.status !== 'removed') {
        return handleCORS(NextResponse.json(
          { error: "Nur entfernte Projekte können wiederhergestellt werden" }, 
          { status: 400 }
        ))
      }

      // Update status to 'restoration_requested'
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'restoration_requested' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Beantragen der Wiederherstellung" }, 
          { status: 500 }
        ))
      }

      // Send restoration request email
      await sendRestorationRequestEmail(
        currentData.email,
        currentData.project_name
      )

      return handleCORS(NextResponse.json(data))
    }

    // Approve restoration - POST /api/project-requests/:id/approve-restoration
    const approveRestorationMatch = route.match(/^\/project-requests\/(.+)\/approve-restoration$/)
    if (approveRestorationMatch && method === 'POST') {
      const requestId = approveRestorationMatch[1]
      const supabase = getSupabaseClient()

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden" }, 
          { status: 404 }
        ))
      }

      if (currentData.status !== 'restoration_requested') {
        return handleCORS(NextResponse.json(
          { error: "Keine Wiederherstellungsanfrage vorhanden" }, 
          { status: 400 }
        ))
      }

      // Update status to 'approved'
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Genehmigen der Wiederherstellung" }, 
          { status: 500 }
        ))
      }

      // Send restoration approved email
      await sendRestorationApprovedEmail(
        currentData.email,
        currentData.project_name
      )

      return handleCORS(NextResponse.json(data))
    }

    // Reject restoration - POST /api/project-requests/:id/reject-restoration
    const rejectRestorationMatch = route.match(/^\/project-requests\/(.+)\/reject-restoration$/)
    if (rejectRestorationMatch && method === 'POST') {
      const requestId = rejectRestorationMatch[1]
      const supabase = getSupabaseClient()

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden" }, 
          { status: 404 }
        ))
      }

      if (currentData.status !== 'restoration_requested') {
        return handleCORS(NextResponse.json(
          { error: "Keine Wiederherstellungsanfrage vorhanden" }, 
          { status: 400 }
        ))
      }

      // Update status back to 'removed'
      const { data, error } = await supabase
        .from('project_requests')
        .update({ status: 'removed' })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Ablehnen der Wiederherstellung" }, 
          { status: 500 }
        ))
      }

      // Send restoration rejected email
      await sendRestorationRejectedEmail(
        currentData.email,
        currentData.project_name
      )

      return handleCORS(NextResponse.json(data))
    }

    // Extend project - POST /api/project-requests/:id/extend
    const extendProjectMatch = route.match(/^\/project-requests\/(.+)\/extend$/)
    if (extendProjectMatch && method === 'POST') {
      const requestId = extendProjectMatch[1]
      const body = await request.json()
      const supabase = getSupabaseClient()

      if (!body.email) {
        return handleCORS(NextResponse.json(
          { error: "E-Mail ist erforderlich" }, 
          { status: 400 }
        ))
      }

      // Get current request data first
      const { data: currentData, error: fetchError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', requestId)
        .eq('email', body.email)
        .single()

      if (fetchError || !currentData) {
        return handleCORS(NextResponse.json(
          { error: "Anfrage nicht gefunden oder keine Berechtigung" }, 
          { status: 404 }
        ))
      }

      // Check if max extensions reached
      const extensionCount = currentData.extension_count || 0
      if (extensionCount >= 3) {
        return handleCORS(NextResponse.json(
          { error: "Maximale Anzahl an Verlängerungen erreicht (3/3)" }, 
          { status: 400 }
        ))
      }

      // Calculate new expiration date (same duration as original)
      const durationMonths = currentData.duration_months || 1
      const newExpirationDate = new Date()
      newExpirationDate.setMonth(newExpirationDate.getMonth() + durationMonths)

      // Update project
      const { data, error } = await supabase
        .from('project_requests')
        .update({ 
          expiration_date: newExpirationDate.toISOString(),
          extension_count: extensionCount + 1,
          is_active: true,
          status: 'approved'
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Verlängern des Projekts" }, 
          { status: 500 }
        ))
      }

      // Send extension confirmation email
      try {
        await sendProjectExtendedEmail(
          currentData.email,
          currentData.project_name,
          newExpirationDate.toISOString(),
          extensionCount + 1
        )
      } catch (emailError) {
        console.error('Email error:', emailError)
      }

      return handleCORS(NextResponse.json(data))
    }

    // Check and expire projects - POST /api/projects/check-expired (Cron job endpoint)
    if (route === '/projects/check-expired' && method === 'POST') {
      const supabase = getSupabaseClient()

      try {
        // Get all approved and active projects
        const { data: projects, error: fetchError } = await supabase
          .from('project_requests')
          .select('*')
          .eq('status', 'approved')
          .eq('is_active', true)

        if (fetchError) {
          console.error('Supabase fetch error:', fetchError)
          return handleCORS(NextResponse.json(
            { error: "Fehler beim Laden der Projekte" }, 
            { status: 500 }
          ))
        }

        const now = new Date()
        const expiredProjects = []

        // Check each project for expiration
        for (const project of projects) {
          if (project.expiration_date) {
            const expirationDate = new Date(project.expiration_date)
            
            if (expirationDate <= now) {
              // Project has expired
              expiredProjects.push(project)

              // Update project to inactive
              await supabase
                .from('project_requests')
                .update({ is_active: false })
                .eq('id', project.id)

              // Send expiration email
              try {
                await sendProjectExpiredEmail(
                  project.email,
                  project.project_name,
                  project.extension_count || 0
                )
                console.log(`✅ Expiration email sent for project: ${project.project_name}`)
              } catch (emailError) {
                console.error('Email error for project', project.id, ':', emailError)
              }
            }
          }
        }

        return handleCORS(NextResponse.json({ 
          success: true,
          message: `Checked ${projects.length} projects, ${expiredProjects.length} expired`,
          expired_count: expiredProjects.length,
          expired_projects: expiredProjects.map(p => ({
            id: p.id,
            name: p.project_name,
            email: p.email
          }))
        }))

      } catch (error) {
        console.error('Error checking expired projects:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Überprüfen der Projekte" }, 
          { status: 500 }
        ))
      }
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
