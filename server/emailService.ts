
import sgMail from '@sendgrid/mail';
import { env } from './config';

// Initialize SendGrid with production API key
sgMail.setApiKey(env.SENDGRID_API_KEY);

const FROM_EMAIL = 'noreply@asopets.com'; // Replace with your verified sender email

export async function sendConfirmationEmail(to: string, confirmationUrl: string): Promise<void> {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Confirm Your AsoPets Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to AsoPets!</h2>
        <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Confirm Email Address
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${confirmationUrl}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create an account with AsoPets, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Reset Your AsoPets Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
        <p style="color: #dc2626; font-weight: bold;">This link will expire in 1 hour.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}
