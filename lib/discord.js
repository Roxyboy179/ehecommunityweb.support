/**
 * Discord Webhook Integration
 * Sends notifications to Discord when projects are approved
 */

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1420473331550785556/_SBzRcewklAy6ELgNN3S-HfSWsna7RoIJnJxfuaNl8IfRrQyloyr_2Qpigi0W3Ja4oA4'

/**
 * Send a Discord notification when a project is approved
 * @param {Object} projectData - The approved project data
 */
export async function sendProjectApprovedNotification(projectData) {
  try {
    const { project_name, description, created_at, project_type } = projectData
    
    // Format the date
    const date = new Date(created_at)
    const formattedDate = date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    })

    // Create Discord embed message
    const embed = {
      title: '🎉 Neues Projekt angenommen!',
      color: 0x22c55e, // Green color
      fields: [
        {
          name: '📝 Projektname',
          value: project_name,
          inline: false
        },
        {
          name: '📋 Beschreibung',
          value: description.length > 1024 ? description.substring(0, 1021) + '...' : description,
          inline: false
        },
        {
          name: '🏷️ Projekt-Typ',
          value: project_type,
          inline: true
        },
        {
          name: '📅 Datum/Uhrzeit',
          value: formattedDate,
          inline: true
        },
        {
          name: '🔗 Link',
          value: '[Zu den Projekten](https://ehecommunityweb.de/projekte)',
          inline: false
        }
      ],
      footer: {
        text: 'EHE Community Webseite Studio'
      },
      timestamp: new Date().toISOString()
    }

    // Send to Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord webhook error:', response.status, errorText)
      throw new Error(`Discord webhook failed: ${response.status}`)
    }

    console.log('✅ Discord notification sent successfully for project:', project_name)
    return true
  } catch (error) {
    console.error('Error sending Discord notification:', error)
    // Don't throw error - we don't want to fail the approval if Discord fails
    return false
  }
}

/**
 * Send a test Discord notification
 */
export async function sendTestNotification() {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [{
          title: '✅ Test Nachricht',
          description: 'Discord Webhook funktioniert!',
          color: 0x3b82f6,
          footer: {
            text: 'EHE Community Webseite Studio - Test'
          },
          timestamp: new Date().toISOString()
        }]
      }),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook test failed: ${response.status}`)
    }

    console.log('✅ Discord test notification sent successfully')
    return true
  } catch (error) {
    console.error('Error sending Discord test notification:', error)
    return false
  }
}
