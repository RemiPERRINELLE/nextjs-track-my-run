import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const data = await resend.emails.send({
      from: 'TrackMyRun <noreply@remiperrinelle.com>',
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    return { success: false, error };
  }
};
