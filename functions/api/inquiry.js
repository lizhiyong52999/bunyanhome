/**
 * BunyanHome Inquiry Form API
 * Cloudflare Pages Function + Resend Email API
 * 
 * Environment Variables (set in Cloudflare Dashboard):
 * - RESEND_API_KEY: Your Resend API key
 * - INQUIRY_TO_EMAIL: Recipient email (default: sales@bunyanhome.com)
 * - INQUIRY_FROM_EMAIL: Sender email (default: inquiry@bunyanhome.com)
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const data = await request.json();
    
    // Honeypot check - bots fill this field
    if (data._gotcha && data._gotcha.trim() !== '') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate required fields
    const { name, email, message } = data;
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please fill in all required fields (Name, Email, Message).' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please enter a valid email address.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check for Resend API key
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email service not configured. Please contact us via WhatsApp.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Build email content
    const toEmail = env.INQUIRY_TO_EMAIL || 'sales@bunyanhome.com';
    const fromEmail = env.INQUIRY_FROM_EMAIL || 'inquiry@bunyanhome.com';
    
    const subject = `New Inquiry from ${name}${data.company ? ' (' + data.company + ')' : ''} - BunyanHome.com`;
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Inquiry - BunyanHome.com</h2>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background: #f8f9fa;">
      <td style="padding: 10px; font-weight: bold; width: 150px;">Name:</td>
      <td style="padding: 10px;">${escapeHtml(name)}</td>
    </tr>
    ${data.company ? `<tr>
      <td style="padding: 10px; font-weight: bold;">Company:</td>
      <td style="padding: 10px;">${escapeHtml(data.company)}</td>
    </tr>` : ''}
    <tr style="background: #f8f9fa;">
      <td style="padding: 10px; font-weight: bold;">Email:</td>
      <td style="padding: 10px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
    </tr>
    ${data.phone ? `<tr>
      <td style="padding: 10px; font-weight: bold;">Phone/WhatsApp:</td>
      <td style="padding: 10px;">${escapeHtml(data.phone)}</td>
    </tr>` : ''}
    ${data.country ? `<tr style="background: #f8f9fa;">
      <td style="padding: 10px; font-weight: bold;">Country:</td>
      <td style="padding: 10px;">${escapeHtml(data.country)}</td>
    </tr>` : ''}
    ${data.product ? `<tr>
      <td style="padding: 10px; font-weight: bold;">Product Interest:</td>
      <td style="padding: 10px;">${escapeHtml(data.product)}</td>
    </tr>` : ''}
    ${data.quantity ? `<tr style="background: #f8f9fa;">
      <td style="padding: 10px; font-weight: bold;">Quantity:</td>
      <td style="padding: 10px;">${escapeHtml(data.quantity)}</td>
    </tr>` : ''}
    ${data.destination ? `<tr>
      <td style="padding: 10px; font-weight: bold;">Destination:</td>
      <td style="padding: 10px;">${escapeHtml(data.destination)}</td>
    </tr>` : ''}
  </table>
  
  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Message:</h3>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="color: #999; font-size: 12px;">This inquiry was submitted via BunyanHome.com contact form.</p>
</body>
</html>`;
    
    const textContent = `New Inquiry from BunyanHome.com

Name: ${name}
${data.company ? 'Company: ' + data.company + '\n' : ''}Email: ${email}
${data.phone ? 'Phone/WhatsApp: ' + data.phone + '\n' : ''}${data.country ? 'Country: ' + data.country + '\n' : ''}${data.product ? 'Product Interest: ' + data.product + '\n' : ''}${data.quantity ? 'Quantity: ' + data.quantity + '\n' : ''}${data.destination ? 'Destination: ' + data.destination + '\n' : ''}
Message:
${message}`;
    
    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromEmail}`,
        to: [toEmail],
        subject: subject,
        html: htmlContent,
        text: textContent,
        reply_to: email,
      }),
    });
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to send email. Please try again or contact us via WhatsApp.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Inquiry form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An error occurred. Please try again or contact us via WhatsApp.' 
    }), {
      status: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json' 
      },
    });
  }
}

// Handle OPTIONS preflight
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
