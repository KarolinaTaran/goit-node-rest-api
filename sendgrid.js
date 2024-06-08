import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_EMAIL,
      subject,
      html,
    };
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
