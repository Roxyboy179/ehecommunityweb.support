import nodemailer from 'nodemailer'

// SMTP Configuration (Gmail)
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'hamburgrp20@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'phedbfixumdxiavn'
  }
}

const transporter = nodemailer.createTransport(smtpConfig)

// Modern email template with responsive design
const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>EHE Community</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 12px 20px; border-radius: 8px; margin-bottom: 15px;">
                      <span style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 0.5px;">EHE Community</span>
                    </div>
                    <p style="color: rgba(255, 255, 255, 0.95); font-size: 16px; margin: 0; font-weight: 500;">Webseite Studio</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                      <strong style="color: #374151;">EHE Community Webseite Studio</strong><br>
                      Kostenlose Plattform für Community-Projekte
                    </p>
                    <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                      <a href="mailto:hamburgrp20@gmail.com" style="color: #3b82f6; text-decoration: none;">hamburgrp20@gmail.com</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
                      &copy; 2025 EHE Community. Alle Rechte vorbehalten.<br>
                      Private Nutzung - Keine kommerzielle Verwendung
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// Button component for emails
const getButton = (text, url = null, color = '#3b82f6') => {
  const buttonStyle = `
    display: inline-block;
    padding: 14px 32px;
    background-color: ${color};
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    transition: background-color 0.3s ease;
  `
  
  if (url) {
    return `<a href="${url}" style="${buttonStyle}">${text}</a>`
  }
  return `<span style="${buttonStyle}">${text}</span>`
}

// Info box component
const getInfoBox = (items) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="width: 40%; color: #6b7280; font-size: 14px; font-weight: 600;">${item.label}:</td>
            <td style="width: 60%; color: #111827; font-size: 14px; font-weight: 500;">${item.value}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')
  
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${itemsHtml}
          </table>
        </td>
      </tr>
    </table>
  `
}

// Status badge component
const getStatusBadge = (status) => {
  const statusConfig = {
    'pending': { label: 'Ausstehend', color: '#f59e0b', bgColor: '#fef3c7' },
    'In Bearbeitung': { label: 'In Bearbeitung', color: '#3b82f6', bgColor: '#dbeafe' },
    'Angenommen': { label: 'Angenommen', color: '#10b981', bgColor: '#d1fae5' },
    'Abgelehnt': { label: 'Abgelehnt', color: '#ef4444', bgColor: '#fee2e2' }
  }
  
  const config = statusConfig[status] || { label: status, color: '#6b7280', bgColor: '#f3f4f6' }
  
  return `
    <span style="
      display: inline-block;
      padding: 6px 16px;
      background-color: ${config.bgColor};
      color: ${config.color};
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
    ">${config.label}</span>
  `
}

export async function sendProjectRequestConfirmation(email, projectName, projectType) {
  const content = `
    <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
      Vielen Dank für Ihre Projekt-Anfrage
    </h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Guten Tag,
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Ihre Projekt-Anfrage wurde erfolgreich bei uns eingereicht und wird nun von unserem Team geprüft. 
      Wir haben alle wichtigen Informationen erhalten und werden uns zeitnah bei Ihnen melden.
    </p>
    
    ${getInfoBox([
      { label: 'Projekt-Name', value: `<strong>${projectName}</strong>` },
      { label: 'Projekt-Typ', value: projectType },
      { label: 'Aktueller Status', value: getStatusBadge('pending') },
      { label: 'Eingereicht am', value: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) }
    ])}
    
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0; border: 1px solid #bfdbfe;">
      <p style="color: #1e3a8a; font-size: 15px; line-height: 1.7; margin: 0; font-weight: 500;">
        <strong style="display: block; margin-bottom: 10px; font-size: 17px; color: #1e40af;">Was passiert als Nächstes?</strong>
        Unser Team prüft Ihre Anfrage sorgfältig. Sie erhalten automatisch eine E-Mail-Benachrichtigung, 
        sobald sich der Status Ihrer Anfrage ändert. Die Bearbeitungszeit beträgt in der Regel 7-14 Tage.
      </p>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 24px 0;">
      Bei Fragen können Sie uns jederzeit unter <a href="mailto:hamburgrp20@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">hamburgrp20@gmail.com</a> erreichen.
    </p>
    
    <div style="margin: 35px 0; text-align: center;">
      ${getButton('Zur Website', process.env.NEXT_PUBLIC_BASE_URL || 'https://cookie-manager-5.preview.emergentagent.com')}
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
      Mit freundlichen Grüßen,<br>
      <strong style="color: #111827;">Das EHE Community Team</strong>
    </p>
  `

  const mailOptions = {
    from: `"EHE Community Webseite Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Projektanfrage eingegangen: ${projectName} - Status: Ausstehend`,
    html: getEmailTemplate(content)
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendContactFormConfirmation(email, name, subject, message) {
  const content = `
    <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
      Vielen Dank für Ihre Nachricht
    </h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hallo ${name},
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      wir haben Ihre Kontaktanfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
    </p>
    
    ${getInfoBox([
      { label: 'Betreff', value: `<strong>${subject}</strong>` },
      { label: 'Ihre E-Mail', value: email },
      { label: 'Eingereicht am', value: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    ])}
    
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0; border: 1px solid #bfdbfe;">
      <p style="color: #1e3a8a; font-size: 15px; line-height: 1.7; margin: 0; font-weight: 500;">
        <strong style="display: block; margin-bottom: 10px; font-size: 17px; color: #1e40af;">Ihre Nachricht:</strong>
        <span style="color: #374151; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</span>
      </p>
    </div>
    
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
      <p style="color: #065f46; font-size: 15px; line-height: 1.7; margin: 0; font-weight: 500;">
        <strong style="display: block; margin-bottom: 8px; font-size: 17px;">⏱️ Antwortzeit</strong>
        In der Regel antworten wir innerhalb von 48 Stunden.
      </p>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 24px 0;">
      Bei weiteren Fragen erreichen Sie uns unter 
      <a href="mailto:hamburgrp20@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">hamburgrp20@gmail.com</a>.
    </p>
    
    <div style="margin: 35px 0; text-align: center;">
      ${getButton('Zur Website', process.env.NEXT_PUBLIC_BASE_URL || 'https://ehecommunityweb.de')}
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
      Mit freundlichen Grüßen,<br>
      <strong style="color: #111827;">Das EHE Community Team</strong>
    </p>
    
    <p style="color: #9ca3af; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <em>Dies ist eine automatische Bestätigungs-E-Mail. Bitte antworten Sie nicht direkt auf diese E-Mail.</em>
    </p>
  `

  const mailOptions = {
    from: `"EHE Community Webseite Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Bestätigung Ihrer Kontaktanfrage - ${subject}`,
    html: getEmailTemplate(content)
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendContactFormNotification(name, email, subject, message) {
  const content = `
    <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
      📧 Neue Kontaktanfrage
    </h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Es wurde eine neue Kontaktanfrage über das Website-Formular eingereicht.
    </p>
    
    ${getInfoBox([
      { label: 'Name', value: `<strong>${name}</strong>` },
      { label: 'E-Mail', value: `<a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>` },
      { label: 'Betreff', value: subject },
      { label: 'Eingereicht am', value: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    ])}
    
    <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
      <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0; font-weight: 600;">
        Nachricht:
      </p>
      <p style="color: #111827; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
        ${message}
      </p>
    </div>
    
    <div style="margin: 35px 0; text-align: center;">
      ${getButton('E-Mail beantworten', `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`)}
    </div>
  `

  const mailOptions = {
    from: `"EHE Community Webseite Studio" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Neue Kontaktanfrage: ${subject}`,
    html: getEmailTemplate(content),
    replyTo: email
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendStatusUpdateEmail(email, projectName, oldStatus, newStatus) {
  const statusMessages = {
    'Angenommen': {
      message: 'Herzlichen Glückwunsch! Ihr Projekt wurde angenommen. Wir werden uns in Kürze mit weiteren Details und den nächsten Schritten bei Ihnen melden.',
      color: '#10b981',
      bgColor: '#ecfdf5',
      icon: '✓'
    },
    'Abgelehnt': {
      message: 'Leider konnten wir Ihre Projekt-Anfrage nicht annehmen. Dies kann verschiedene Gründe haben. Gerne können Sie sich bei Fragen direkt an uns wenden.',
      color: '#ef4444',
      bgColor: '#fef2f2',
      icon: '✕'
    },
    'In Bearbeitung': {
      message: 'Ihre Anfrage wird derzeit von unserem Team aktiv bearbeitet. Wir analysieren alle Details und werden Sie über die weitere Entwicklung informieren.',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      icon: '●'
    }
  }

  const statusInfo = statusMessages[newStatus] || {
    message: 'Der Status Ihrer Anfrage wurde aktualisiert.',
    color: '#6b7280',
    bgColor: '#f9fafb',
    icon: '◆'
  }

  const content = `
    <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
      Status-Update für Ihre Projekt-Anfrage
    </h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Guten Tag,
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Es gibt eine wichtige Aktualisierung zum Status Ihrer Projekt-Anfrage.
    </p>
    
    ${getInfoBox([
      { label: 'Projekt-Name', value: `<strong>${projectName}</strong>` },
      { label: 'Vorheriger Status', value: getStatusBadge(oldStatus) },
      { label: 'Neuer Status', value: getStatusBadge(newStatus) },
      { label: 'Aktualisiert am', value: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    ])}
    
    <div style="background: ${statusInfo.bgColor}; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusInfo.color}; margin: 25px 0;">
      <p style="color: ${statusInfo.color}; font-size: 15px; line-height: 1.6; margin: 0; font-weight: 500;">
        <strong style="display: block; margin-bottom: 8px; font-size: 18px;">
          ${statusInfo.icon} ${newStatus}
        </strong>
        ${statusInfo.message}
      </p>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 24px 0;">
      Für Rückfragen oder weitere Informationen stehen wir Ihnen gerne zur Verfügung. 
      Kontaktieren Sie uns unter <a href="mailto:hamburgrp20@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">hamburgrp20@gmail.com</a>.
    </p>
    
    <div style="margin: 35px 0; text-align: center;">
      ${getButton('Zur Website', process.env.NEXT_PUBLIC_BASE_URL || 'https://cookie-manager-5.preview.emergentagent.com')}
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
      Mit freundlichen Grüßen,<br>
      <strong style="color: #111827;">Das EHE Community Team</strong>
    </p>
  `

  const mailOptions = {
    from: `"EHE Community Webseite Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Status-Update: ${projectName} - Neuer Status: ${newStatus}`,
    html: getEmailTemplate(content)
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}
