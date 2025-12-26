// Minimal mailer placeholder. Replace with SendGrid/Postmark/etc. in production.
export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  // In dev, log the message. In production, integrate with an email provider.
  console.log('Sending email to', to)
  console.log('Subject:', subject)
  console.log('Text:', text)
  if (html) console.log('HTML:', html)
  return true
}
