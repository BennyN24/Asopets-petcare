import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('Attempting to send email with Resend...');
    console.log('Email params:', { 
      to: params.to, 
      from: params.from, 
      subject: params.subject,
      hasHtml: !!params.html,
      hasText: !!params.text,
      hasAttachments: !!(params.attachments && params.attachments.length > 0)
    });

    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || "",
      html: params.html,
    };

    // Add attachments if provided
    if (params.attachments && params.attachments.length > 0) {
      emailData.attachments = params.attachments;
    }

    console.log('Sending email via Resend API...');
    const result = await resend.emails.send(emailData);
    console.log('Resend API response:', result);
    
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
}