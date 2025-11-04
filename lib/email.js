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

export async function sendProjectRequestConfirmation(email, projectName, projectType) {
  const mailOptions = {
    from: `"EHE Community" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Projekt-Anfrage eingegangen - EHE Community',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">Vielen Dank für Ihre Projekt-Anfrage!</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hallo,</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Ihre Projekt-Anfrage wurde erfolgreich bei uns eingereicht:
          </p>
          <div style="background: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #555;"><strong>Projekt-Name:</strong> ${projectName}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Projekt-Typ:</strong> ${projectType}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Ausstehend</span></p>
          </div>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Unser Team wird Ihre Anfrage prüfen und Sie über Änderungen des Status per E-Mail informieren.
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Mit freundlichen Grüßen,<br>
            <strong>EHE Community Webseite Studio</strong>
          </p>
        </div>
        <p style="text-align: center; color: white; font-size: 12px; margin-top: 20px;">
          © 2025 EHE Community. Alle Rechte vorbehalten.
        </p>
      </div>
    `
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
  const statusColors = {
    'pending': '#f59e0b',
    'In Bearbeitung': '#3b82f6',
    'Angenommen': '#10b981',
    'Abgelehnt': '#ef4444'
  }

  const statusColor = statusColors[newStatus] || '#6b7280'

  const mailOptions = {
    from: `"EHE Community" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Status-Update: ${projectName} - EHE Community`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">Status-Update Ihrer Projekt-Anfrage</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hallo,</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Der Status Ihrer Projekt-Anfrage wurde aktualisiert:
          </p>
          <div style="background: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #555;"><strong>Projekt-Name:</strong> ${projectName}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Alter Status:</strong> <span style="color: #6b7280;">${oldStatus}</span></p>
            <p style="margin: 10px 0; color: #555;"><strong>Neuer Status:</strong> <span style="color: ${statusColor}; font-weight: bold; font-size: 18px;">${newStatus}</span></p>
          </div>
          ${newStatus === 'Angenommen' ? `
            <p style="color: #10b981; font-size: 16px; line-height: 1.6; font-weight: bold;">
              🎉 Herzlichen Glückwunsch! Ihr Projekt wurde angenommen. Wir werden uns in Kürze mit weiteren Details bei Ihnen melden.
            </p>
          ` : ''}
          ${newStatus === 'Abgelehnt' ? `
            <p style="color: #ef4444; font-size: 16px; line-height: 1.6;">
              Leider konnten wir Ihre Projekt-Anfrage nicht annehmen. Dies kann verschiedene Gründe haben. Bei Fragen können Sie uns gerne kontaktieren.
            </p>
          ` : ''}
          ${newStatus === 'In Bearbeitung' ? `
            <p style="color: #3b82f6; font-size: 16px; line-height: 1.6;">
              Ihre Anfrage wird derzeit von unserem Team bearbeitet. Wir informieren Sie über weitere Entwicklungen.
            </p>
          ` : ''}
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Mit freundlichen Grüßen,<br>
            <strong>EHE Community Webseite Studio</strong>
          </p>
        </div>
        <p style="text-align: center; color: white; font-size: 12px; margin-top: 20px;">
          © 2025 EHE Community. Alle Rechte vorbehalten.
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}