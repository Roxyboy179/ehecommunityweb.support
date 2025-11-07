
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
  sendProjectExtendedEmail,
  sendStatusInProgressEmail
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

// Helper function to get current time in EU timezone (Europe/Berlin)
function getEUTimestamp() {
  // Create date in EU timezone
  const date = new Date()
  
  // Convert to EU timezone string
  const euDateString = date.toLocaleString('en-US', { 
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  // Parse the EU date string and convert to ISO format
  const [datePart, timePart] = euDateString.split(', ')
  const [month, day, year] = datePart.split('/')
  const [hour, minute, second] = timePart.split(':')
  
  // Create ISO string in EU timezone format
  const euDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  return euDate.toISOString()
}

// Helper function to add months to a date in EU timezone
function addMonthsEU(months) {
  const date = new Date()
  
  // Get EU timezone date
  const euDateString = date.toLocaleString('en-US', { 
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const [datePart, timePart] = euDateString.split(', ')
  const [month, day, year] = datePart.split('/')
  const [hour, minute, second] = timePart.split(':')
  
  const euDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  euDate.setMonth(euDate.getMonth() + months)
  
  return euDate.toISOString()
}

// Helper function to add minutes to current time in EU timezone
function addMinutesEU(minutes) {
  const date = new Date()
  
  // Get EU timezone date
  const euDateString = date.toLocaleString('en-US', { 
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const [datePart, timePart] = euDateString.split(', ')
  const [month, day, year] = datePart.split('/')
  const [hour, minutePart, second] = timePart.split(':')
  
  const euDate = new Date(`${year}-${month}-${day}T${hour}:${minutePart}:${second}`)
  euDate.setMinutes(euDate.getMinutes() + minutes)
  
  return euDate.toISOString()
}

// Helper function to check content for bad words
function checkContentForBadWords(project) {
  // Liste der Schimpfwörter und unangemessenen Inhalte (Deutsch)
  const badWords = [
    'scheiße', 'scheisse', 'scheiss', 'scheiß',
    'fuck', 'ficken', 'fick',
    'arsch', 'arschloch',
    'idiot', 'idioten',
    'dumm', 'dummkopf',
    'hurensohn',
    'wichser',
    'piss', 'pisse',
    'nazi', 'hitler',
    'fotze',
    'schwuchtel',
    'nigger',
    'bastard',
    'dreck',
    'verdammt', 'verfickt',
    'sau', 'drecksau',
    'kacke', 'kot',
    'penis', 'schwanz',
    'vagina', 'möse',
    'sex', 'pornografie', 'porno',
    'hure', 'nutte',
    'blöd', 'blödmann',
    'vollidiot',
    'vergewaltigung',
    'töten', 'mord',
    'holocaust'
  ]
  
  // Funktion zum Prüfen von Text auf Schimpfwörter
  const checkForBadWords = (text) => {
    if (!text) return { found: false, words: [] }
    
    const lowerText = text.toLowerCase()
    const foundWords = []
    
    for (const badWord of badWords) {
      // Prüfe ob das Schimpfwort im Text vorkommt (auch als Teil eines Wortes)
      if (lowerText.includes(badWord.toLowerCase())) {
        foundWords.push(badWord)
      }
    }
    
    return {
      found: foundWords.length > 0,
      words: [...new Set(foundWords)] // Entferne Duplikate
    }
  }
  
  // Prüfe Titel und Beschreibung
  const titleCheck = checkForBadWords(project.project_name)
  const descriptionCheck = checkForBadWords(project.description)
  
  // Kombiniere alle gefundenen Schimpfwörter
  const allBadWords = [...new Set([...titleCheck.words, ...descriptionCheck.words])]
  const hasBadWords = titleCheck.found || descriptionCheck.found
  
  // Entscheidung: Ablehnen wenn Schimpfwörter gefunden wurden
  const shouldApprove = !hasBadWords
  
  // Generate review findings
  const findings = {
    title_check: titleCheck.found ? 'unangemessener Inhalt gefunden' : 'keine Probleme',
    description_check: descriptionCheck.found ? 'unangemessener Inhalt gefunden' : 'keine Probleme',
    content_quality: !hasBadWords ? 'angemessen' : 'unangemessen',
    compliance: !hasBadWords ? 'erfüllt' : 'nicht erfüllt'
  }
  
  // Generate problems list
  const problems = []
  if (titleCheck.found) {
    problems.push(`Unangemessene Inhalte im Titel gefunden: ${titleCheck.words.join(', ')}`)
  }
  if (descriptionCheck.found) {
    problems.push(`Unangemessene Inhalte in der Beschreibung gefunden: ${descriptionCheck.words.join(', ')}`)
  }
  if (hasBadWords) {
    problems.push('Das Projekt enthält Inhalte, die gegen unsere Richtlinien verstoßen')
  }
  
  // Generate recommendations
  const recommendations = []
  if (!hasBadWords) {
    recommendations.push('Projekt erfüllt alle Anforderungen')
    recommendations.push('Keine unangemessenen Inhalte gefunden')
    recommendations.push('Wiederherstellung kann durchgeführt werden')
  } else {
    recommendations.push('Bitte entfernen Sie alle unangemessenen Inhalte aus Titel und Beschreibung')
    recommendations.push('Projekt muss überarbeitet werden vor Wiederherstellung')
    recommendations.push('Kontaktieren Sie den Support für weitere Informationen')
  }
  
  return {
    shouldApprove,
    allBadWords,
    titleCheck,
    descriptionCheck,
    findings,
    problems,
    recommendations
  }
}

// Helper function to schedule AI review (creates pending review)
async function scheduleAIReview(project, supabase) {
  try {
    // Random processing time between 10-60 minutes
    const processingTimeMinutes = Math.floor(Math.random() * 51) + 10 // 10-60 minutes
    
    // Calculate completion time in EU timezone
    const completionTime = addMinutesEU(processingTimeMinutes)
    
    const reviewId = uuidv4()
    const pendingReview = {
      id: reviewId,
      project_id: project.id,
      project_name: project.project_name,
      review_type: 'ai',
      status: 'processing',
      processing_time_minutes: processingTimeMinutes,
      scheduled_completion_time: completionTime,
      created_at: getEUTimestamp()
    }
    
    // Store pending review in Supabase
    const { error: insertError } = await supabase
      .from('restoration_reviews')
      .insert([pendingReview])
    
    if (insertError) {
      console.error('Error storing pending review in Supabase:', insertError)
      throw insertError
    }
    
    console.log(`📅 AI Review scheduled for ${project.project_name} - will complete in ${processingTimeMinutes} minutes`)
    
    return {
      reviewId,
      processingTimeMinutes,
      completionTime: completionTime
    }
  } catch (error) {
    console.error('Error in scheduleAIReview:', error)
    throw error
  }
}

// Helper function to process pending AI reviews
async function processPendingAIReviews() {
  const supabase = getSupabaseClient()
  
  try {
    const now = getEUTimestamp()
    
    // Get all pending reviews that should be completed by now
    const { data: pendingReviews, error: fetchError } = await supabase
      .from('restoration_reviews')
      .select('*')
      .eq('status', 'processing')
      .lte('scheduled_completion_time', now)
    
    if (fetchError) {
      console.error('Error fetching pending reviews:', fetchError)
      return { processed: 0, errors: [] }
    }
    
    if (!pendingReviews || pendingReviews.length === 0) {
      return { processed: 0, errors: [] }
    }
    
    console.log(`🔄 Processing ${pendingReviews.length} pending AI reviews...`)
    
    const processed = []
    const errors = []
    
    for (const review of pendingReviews) {
      try {
        // Get project data from Supabase
        const { data: project, error: projectError } = await supabase
          .from('project_requests')
          .select('*')
          .eq('id', review.project_id)
          .single()
        
        if (projectError || !project) {
          console.error(`Project not found for review ${review.id}`)
          errors.push({ review_id: review.id, error: 'Project not found' })
          continue
        }
        
        // Perform actual content check
        const checkResult = checkContentForBadWords(project)
        
        // Update review with results
        const updatedReview = {
          status: checkResult.shouldApprove ? 'approved' : 'rejected',
          findings: checkResult.findings,
          problems: checkResult.problems.length > 0 ? checkResult.problems : ['Keine Probleme gefunden'],
          recommendations: checkResult.recommendations,
          decision: checkResult.shouldApprove ? 'genehmigt' : 'abgelehnt',
          decision_reason: checkResult.shouldApprove 
            ? 'Das Projekt erfüllt die Anforderungen für eine Wiederherstellung. Keine unangemessenen Inhalte gefunden.'
            : `Das Projekt enthält unangemessene Inhalte und kann nicht wiederhergestellt werden. Gefundene Verstöße: ${checkResult.allBadWords.join(', ')}`,
          confidence_score: 100,
          reviewed_at: getEUTimestamp()
        }
        
        // Update review in Supabase
        const { error: updateError } = await supabase
          .from('restoration_reviews')
          .update(updatedReview)
          .eq('id', review.id)
        
        if (updateError) {
          console.error(`Error updating review ${review.id}:`, updateError)
          errors.push({ review_id: review.id, error: updateError.message })
          continue
        }
        
        // Update project status
        const projectUpdate = {
          status: checkResult.shouldApprove ? 'approved' : 'removed'
        }
        
        // If approved, reactivate project
        if (checkResult.shouldApprove) {
          const durationMonths = project.duration_months || 12
          
          projectUpdate.is_active = true
          projectUpdate.expiration_date = addMonthsEU(durationMonths)
          projectUpdate.approval_date = getEUTimestamp()
        }
        
        const { error: projectUpdateError } = await supabase
          .from('project_requests')
          .update(projectUpdate)
          .eq('id', project.id)
        
        if (projectUpdateError) {
          console.error(`Error updating project ${project.id}:`, projectUpdateError)
          errors.push({ review_id: review.id, error: projectUpdateError.message })
          continue
        }
        
        // Send email notification
        try {
          const fullReview = { ...review, ...updatedReview }
          if (checkResult.shouldApprove) {
            await sendRestorationApprovedEmail(
              project.email,
              project.project_name,
              fullReview
            )
          } else {
            await sendRestorationRejectedEmail(
              project.email,
              project.project_name,
              fullReview
            )
          }
        } catch (emailError) {
          console.error(`Email error for review ${review.id}:`, emailError)
          // Don't fail if email fails
        }
        
        processed.push(review.id)
        console.log(`✅ Completed AI Review for ${project.project_name}: ${checkResult.shouldApprove ? 'APPROVED' : 'REJECTED'}`)
      } catch (error) {
        console.error(`Error processing review ${review.id}:`, error)
        errors.push({ review_id: review.id, error: error.message })
      }
    }
    
    return { processed: processed.length, errors }
  } catch (error) {
    console.error('Error in processPendingAIReviews:', error)
    return { processed: 0, errors: [error.message] }
  }
}

// Helper function to check and update pending projects to in_progress after 10 minutes
async function checkAndUpdatePendingProjects() {
  const supabase = getSupabaseClient()
  
  try {
    // Get all pending projects
    const { data: pendingProjects, error: fetchError } = await supabase
      .from('project_requests')
      .select('*')
      .eq('status', 'pending')
    
    if (fetchError) {
      console.error('Error fetching pending projects:', fetchError)
      return { updated: 0, errors: [] }
    }
    
    if (!pendingProjects || pendingProjects.length === 0) {
      return { updated: 0, errors: [] }
    }
    
    // Get current time in EU timezone for comparison
    const nowEU = new Date(getEUTimestamp())
    const updatedProjects = []
    const errors = []
    
    // Check each pending project
    for (const project of pendingProjects) {
      const createdAt = new Date(project.created_at)
      const timeDiff = nowEU - createdAt
      const minutesDiff = timeDiff / (1000 * 60) // Convert to minutes
      
      // If project is older than 10 minutes, update to in_progress
      if (minutesDiff >= 10) {
        try {
          // Update status to in_progress
          const { data: updatedProject, error: updateError } = await supabase
            .from('project_requests')
            .update({ status: 'in_progress' })
            .eq('id', project.id)
            .select()
            .single()
          
          if (updateError) {
            console.error(`Error updating project ${project.id}:`, updateError)
            errors.push({ project_id: project.id, error: updateError.message })
            continue
          }
          
          updatedProjects.push(updatedProject)
          
          // Send email notification
          try {
            await sendStatusInProgressEmail(
              project.email,
              project.project_name
            )
            console.log(`✅ Status updated and email sent for project: ${project.project_name}`)
          } catch (emailError) {
            console.error(`Email error for project ${project.id}:`, emailError)
            // Don't fail the update if email fails
          }
        } catch (error) {
          console.error(`Error processing project ${project.id}:`, error)
          errors.push({ project_id: project.id, error: error.message })
        }
      }
    }
    
    return { updated: updatedProjects.length, errors, projects: updatedProjects }
  } catch (error) {
    console.error('Error in checkAndUpdatePendingProjects:', error)
    return { updated: 0, errors: [error.message] }
  }
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
        timestamp: getEUTimestamp()
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
        timestamp: getEUTimestamp(),
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
      
      // Check and update pending projects to in_progress
      await checkAndUpdatePendingProjects()
      
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
      const nowEU = new Date(getEUTimestamp())
      const activeProjects = []
      
      for (const project of data) {
        if (project.is_active && project.expiration_date) {
          const expirationDate = new Date(project.expiration_date)
          
          if (expirationDate <= nowEU) {
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
      const nowEU = new Date(getEUTimestamp())
      for (const project of data) {
        if (project.status === 'approved' && 
            project.is_active && 
            project.expiration_date) {
          const expirationDate = new Date(project.expiration_date)
          
          if (expirationDate <= nowEU) {
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

        updateData.approval_date = getEUTimestamp()
        updateData.expiration_date = addMonthsEU(durationMonths)
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
          blocked_at: getEUTimestamp(),
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

      if (!body.review_type || !['ai', 'team'].includes(body.review_type)) {
        return handleCORS(NextResponse.json(
          { error: "Prüfungstyp ist erforderlich (ai oder team)" }, 
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

      let finalStatus = 'restoration_requested'
      let reviewResult = null
      let actualReviewType = body.review_type // Track the actual review type used

      // If AI review is selected, schedule it (10-60 minutes processing time)
      if (body.review_type === 'ai') {
        try {
          console.log(`🤖 Scheduling AI Review for project: ${currentData.project_name}`)
          
          // Schedule the AI review instead of performing it immediately
          const scheduledReview = await scheduleAIReview(currentData, supabase)
          
          reviewResult = {
            scheduled: true,
            reviewId: scheduledReview.reviewId,
            processingTimeMinutes: scheduledReview.processingTimeMinutes,
            completionTime: scheduledReview.completionTime,
            immediate: false
          }
          
          // Keep status as restoration_requested since review is pending
          finalStatus = 'restoration_requested'
          
          console.log(`📅 AI Review scheduled for ${currentData.project_name} - will complete in ${scheduledReview.processingTimeMinutes} minutes`)
        } catch (aiError) {
          console.error('AI Review scheduling error:', aiError)
          console.error('Error details:', aiError.message)
          
          // Return error if scheduling fails
          return handleCORS(NextResponse.json(
            { error: `KI-Prüfung konnte nicht geplant werden: ${aiError.message}. Bitte versuchen Sie es erneut oder wählen Sie Team-Prüfung.` }, 
            { status: 500 }
          ))
        }
      }

      // Prepare update data - only include fields that exist in Supabase
      const updateData = { 
        status: finalStatus
      }

      // Note: Project will be reactivated later when processPendingAIReviews completes the review
      // No need to update project status here for AI reviews since they are scheduled

      // Update status
      const { data, error } = await supabase
        .from('project_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        return handleCORS(NextResponse.json(
          { error: `Fehler beim Beantragen der Wiederherstellung: ${error.message || 'Unbekannter Fehler'}` }, 
          { status: 500 }
        ))
      }

      // Store restoration metadata in Supabase for tracking (optional)
      try {
        const { error: trackingError } = await supabase
          .from('restoration_requests')
          .insert([{
            id: uuidv4(),
            project_id: requestId,
            project_name: currentData.project_name,
            email: currentData.email,
            review_type: actualReviewType,
            requested_at: getEUTimestamp(),
            status: finalStatus,
            review_result: reviewResult ? {
              approved: reviewResult.approved,
              review_id: reviewResult.review.id
            } : null
          }])
        
        if (trackingError) {
          console.error('Supabase insert error for restoration tracking:', trackingError)
          // Continue even if tracking fails
        }
      } catch (trackingError) {
        console.error('Error storing restoration tracking:', trackingError)
        // Continue even if tracking fails
      }

      // Send appropriate email based on review type
      try {
        if (actualReviewType === 'ai' && reviewResult && reviewResult.scheduled) {
          // Send confirmation that AI review is scheduled (not the result yet)
          await sendRestorationRequestEmail(
            currentData.email,
            currentData.project_name,
            actualReviewType
          )
          console.log(`📧 Sent AI review scheduling confirmation to ${currentData.email}`)
          console.log(`⏰ AI review will be completed in ${reviewResult.processingTimeMinutes} minutes`)
        } else if (actualReviewType === 'team') {
          // Send team review request email
          await sendRestorationRequestEmail(
            currentData.email,
            currentData.project_name,
            actualReviewType
          )
          console.log(`📧 Sent team review request email to ${currentData.email}`)
        }
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }

      return handleCORS(NextResponse.json({
        ...data,
        review_result: reviewResult,
        actual_review_type: actualReviewType // Return the actual review type used
      }))
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

    // Get restoration review - GET /api/restoration-reviews/:project_id
    const getReviewMatch = route.match(/^\/restoration-reviews\/(.+)$/)
    if (getReviewMatch && method === 'GET') {
      const projectId = getReviewMatch[1]
      const supabase = getSupabaseClient()
      
      try {
        const { data: review, error } = await supabase
          .from('restoration_reviews')
          .select('*')
          .eq('project_id', projectId)
          .order('reviewed_at', { ascending: false })
          .limit(1)
          .single()
        
        if (error || !review) {
          return handleCORS(NextResponse.json(
            { error: "Keine Prüfung gefunden" }, 
            { status: 404 }
          ))
        }
        
        return handleCORS(NextResponse.json(review))
      } catch (error) {
        console.error('Supabase fetch error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Laden der Prüfung" }, 
          { status: 500 }
        ))
      }
    }

    // Get all restoration reviews - GET /api/restoration-reviews (Admin only)
    if (route === '/restoration-reviews' && method === 'GET') {
      const supabase = getSupabaseClient()
      
      try {
        const { data: reviews, error } = await supabase
          .from('restoration_reviews')
          .select('*')
          .order('reviewed_at', { ascending: false })
          .limit(100)
        
        if (error) {
          throw error
        }
        
        return handleCORS(NextResponse.json(reviews || []))
      } catch (error) {
        console.error('Supabase fetch error:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Laden der Prüfungen" }, 
          { status: 500 }
        ))
      }
    }

    // Process pending AI reviews - POST /api/process-pending-reviews
    if (route === '/process-pending-reviews' && method === 'POST') {
      try {
        console.log('🔄 Starting to process pending AI reviews...')
        const result = await processPendingAIReviews()
        console.log(`✅ Processed ${result.processed} reviews, ${result.errors.length} errors`)
        
        return handleCORS(NextResponse.json({
          success: true,
          processed: result.processed,
          errors: result.errors,
          message: `Verarbeitet: ${result.processed} Prüfungen`
        }))
      } catch (error) {
        console.error('Error processing pending reviews:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Verarbeiten der Prüfungen" }, 
          { status: 500 }
        ))
      }
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
      const newExpirationDate = addMonthsEU(durationMonths)

      // Update project
      const { data, error } = await supabase
        .from('project_requests')
        .update({ 
          expiration_date: newExpirationDate,
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
          newExpirationDate,
          extensionCount + 1
        )
      } catch (emailError) {
        console.error('Email error:', emailError)
      }

      return handleCORS(NextResponse.json(data))
    }

    // Check and update pending projects - POST /api/projects/check-pending (Cron job endpoint)
    if (route === '/projects/check-pending' && method === 'POST') {
      try {
        const result = await checkAndUpdatePendingProjects()
        
        return handleCORS(NextResponse.json({ 
          success: true,
          message: `Checked pending projects, ${result.updated} updated to in_progress`,
          updated_count: result.updated,
          errors: result.errors,
          updated_projects: result.projects?.map(p => ({
            id: p.id,
            name: p.project_name,
            email: p.email
          })) || []
        }))
      } catch (error) {
        console.error('Error checking pending projects:', error)
        return handleCORS(NextResponse.json(
          { error: "Fehler beim Überprüfen der Projekte" }, 
          { status: 500 }
        ))
      }
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

        const nowEU = new Date(getEUTimestamp())
        const expiredProjects = []

        // Check each project for expiration
        for (const project of projects) {
          if (project.expiration_date) {
            const expirationDate = new Date(project.expiration_date)
            
            if (expirationDate <= nowEU) {
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
