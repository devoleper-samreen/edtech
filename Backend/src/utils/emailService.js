import { Resend } from 'resend';

const getResend = () => new Resend(process.env.RESEND_API_KEY);

const adminEmail = () => process.env.EMAIL_USER;

// Admin notification — new enrollment
export const sendEnrollmentEmail = async ({ name, email, phone, course, message }) => {
  console.error('[EMAIL] sendEnrollmentEmail called, admin:', adminEmail());

  await getResend().emails.send({
    from: 'TechFox <onboarding@resend.dev>',
    to: adminEmail(),
    subject: `New Enrollment Request – ${course}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #FA8128; padding: 24px 32px;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">TechFox — New Enrollment</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #6b7280; font-size: 15px; margin: 0 0 20px;">A new enrollment request has been submitted. Details below:</p>
          <div style="background: #fff7ed; border-left: 4px solid #FA8128; border-radius: 4px; padding: 16px 20px;">
            <table style="width: 100%; font-size: 14px; color: #374151; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #9ca3af; width: 130px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Phone</td><td style="padding: 6px 0; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Email</td><td style="padding: 6px 0; font-weight: 600;">${email || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Course</td><td style="padding: 6px 0; font-weight: 600;">${course}</td></tr>
              ${message ? `<tr><td style="padding: 6px 0; color: #9ca3af;">Message</td><td style="padding: 6px 0;">${message}</td></tr>` : ''}
            </table>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 14px 32px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 TechFox. All Rights Reserved.</p>
        </div>
      </div>
    `,
  });

  console.error('[EMAIL] Enrollment email sent!');
};

// Admin notification — new enquiry
export const sendEnquiryEmail = async ({ name, email, phone, course, message }) => {
  console.error('[EMAIL] sendEnquiryEmail called, admin:', adminEmail());

  await getResend().emails.send({
    from: 'TechFox <onboarding@resend.dev>',
    to: adminEmail(),
    subject: `New Enquiry – ${course}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #FA8128; padding: 24px 32px;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">TechFox — New Enquiry</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #6b7280; font-size: 15px; margin: 0 0 20px;">A new enquiry has been submitted. Details below:</p>
          <div style="background: #fff7ed; border-left: 4px solid #FA8128; border-radius: 4px; padding: 16px 20px;">
            <table style="width: 100%; font-size: 14px; color: #374151; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #9ca3af; width: 130px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Phone</td><td style="padding: 6px 0; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Email</td><td style="padding: 6px 0; font-weight: 600;">${email || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Course</td><td style="padding: 6px 0; font-weight: 600;">${course}</td></tr>
              ${message ? `<tr><td style="padding: 6px 0; color: #9ca3af;">Message</td><td style="padding: 6px 0;">${message}</td></tr>` : ''}
            </table>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 14px 32px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 TechFox. All Rights Reserved.</p>
        </div>
      </div>
    `,
  });

  console.error('[EMAIL] Enquiry email sent!');
};

// Admin notification — new callback request
export const sendCallbackEmail = async ({ name, email, phone, type, company, requiredTraining, message }) => {
  console.error('[EMAIL] sendCallbackEmail called, admin:', adminEmail());

  await getResend().emails.send({
    from: 'TechFox <onboarding@resend.dev>',
    to: adminEmail(),
    subject: `New Callback Request – ${type || 'General'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #FA8128; padding: 24px 32px;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">TechFox — New Callback Request</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #6b7280; font-size: 15px; margin: 0 0 20px;">A new callback request has been submitted. Details below:</p>
          <div style="background: #fff7ed; border-left: 4px solid #FA8128; border-radius: 4px; padding: 16px 20px;">
            <table style="width: 100%; font-size: 14px; color: #374151; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #9ca3af; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Phone</td><td style="padding: 6px 0; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Email</td><td style="padding: 6px 0; font-weight: 600;">${email || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Type</td><td style="padding: 6px 0; font-weight: 600;">${type || 'General'}</td></tr>
              ${company ? `<tr><td style="padding: 6px 0; color: #9ca3af;">Company</td><td style="padding: 6px 0; font-weight: 600;">${company}</td></tr>` : ''}
              ${requiredTraining ? `<tr><td style="padding: 6px 0; color: #9ca3af;">Training Required</td><td style="padding: 6px 0; font-weight: 600;">${requiredTraining}</td></tr>` : ''}
              ${message ? `<tr><td style="padding: 6px 0; color: #9ca3af;">Message</td><td style="padding: 6px 0;">${message}</td></tr>` : ''}
            </table>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 14px 32px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 TechFox. All Rights Reserved.</p>
        </div>
      </div>
    `,
  });

  console.error('[EMAIL] Callback email sent!');
};

// Password reset email — sent to user
export const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  await getResend().emails.send({
    from: 'TechFox <onboarding@resend.dev>',
    to: email,
    subject: 'Reset Your TechFox Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #FA8128; padding: 24px 32px;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">TechFox — Password Reset</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 15px;">You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #FA8128; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">Or copy this link: <a href="${resetUrl}" style="color: #FA8128;">${resetUrl}</a></p>
        </div>
        <div style="background: #f9fafb; padding: 14px 32px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 TechFox. All Rights Reserved.</p>
        </div>
      </div>
    `,
  });
};
