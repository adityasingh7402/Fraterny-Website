import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipients, subject, body, isHtml, replyTo, fromName } = await req.json()

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided')
    }

    if (!subject || !body) {
      throw new Error('Subject and body are required')
    }

    // Get SMTP credentials from environment
    const smtpHost = Deno.env.get('VITE_MAILTRAP_HOST')
    const smtpPort = parseInt(Deno.env.get('VITE_MAILTRAP_PORT') || '587')
    const smtpUsername = Deno.env.get('VITE_MAILTRAP_USERNAME')
    const smtpPassword = Deno.env.get('VITE_MAILTRAP_PASSWORD')
    const fromEmail = Deno.env.get('VITE_FROM_EMAIL') || 'noreply@fraterny.com'

    if (!smtpHost || !smtpUsername || !smtpPassword) {
      throw new Error('SMTP credentials not configured')
    }

    const results = []

    // Send emails one by one using raw SMTP
    for (const recipient of recipients) {
      try {
        // Replace template variables
        const personalizedSubject = subject
          .replace(/\{\{\s*name\s*\}\}/gi, recipient.name)
          .replace(/\{\{\s*email\s*\}\}/gi, recipient.email)

        const personalizedBody = body
          .replace(/\{\{\s*name\s*\}\}/gi, recipient.name)
          .replace(/\{\{\s*email\s*\}\}/gi, recipient.email)

        // Build email message
        const boundary = `----=_Part_${Date.now()}_${Math.random()}`
        const message = [
          `From: ${fromName} <${fromEmail}>`,
          `To: ${recipient.email}`,
          `Reply-To: ${replyTo || fromEmail}`,
          `Subject: ${personalizedSubject}`,
          `MIME-Version: 1.0`,
          isHtml 
            ? `Content-Type: text/html; charset=utf-8`
            : `Content-Type: text/plain; charset=utf-8`,
          ``,
          personalizedBody
        ].join('\r\n')

        // Connect to SMTP server
        const conn = await Deno.connect({
          hostname: smtpHost,
          port: smtpPort,
        })

        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        // Helper to read response
        const readResponse = async () => {
          const buffer = new Uint8Array(1024)
          const n = await conn.read(buffer)
          return decoder.decode(buffer.subarray(0, n || 0))
        }

        // Helper to send command
        const sendCommand = async (cmd: string) => {
          await conn.write(encoder.encode(cmd + '\r\n'))
          return await readResponse()
        }

        // SMTP handshake
        await readResponse() // Initial greeting
        await sendCommand(`EHLO ${smtpHost}`)
        await sendCommand(`AUTH LOGIN`)
        await sendCommand(btoa(smtpUsername))
        await sendCommand(btoa(smtpPassword))
        await sendCommand(`MAIL FROM:<${fromEmail}>`)
        await sendCommand(`RCPT TO:<${recipient.email}>`)
        await sendCommand('DATA')
        await conn.write(encoder.encode(message + '\r\n.\r\n'))
        await readResponse()
        await sendCommand('QUIT')

        conn.close()

        results.push({
          email: recipient.email,
          success: true,
        })
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error)
        results.push({
          email: recipient.email,
          success: false,
          error: error.message || 'Failed to send email',
        })
      }
    }

    const totalSent = results.filter(r => r.success).length
    const totalFailed = results.filter(r => !r.success).length

    return new Response(
      JSON.stringify({
        success: true,
        totalSent,
        totalFailed,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending emails:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send emails',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
