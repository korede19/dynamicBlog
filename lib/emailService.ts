import nodemailer from "nodemailer";

type EmailParams = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: EmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send the email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || from, // Use your verified email as sender
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
