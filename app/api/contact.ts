import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../lib/emailService";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {

  res.setHeader("Content-Type", "application/json");


  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Parse the request body
    const { name, email, subject, message } = req.body as ContactFormData;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    if (message.trim().length < 20) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Message must be at least 20 characters",
        });
    }

    // Log the form submission
    console.log("Form submission received:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send the email using our email service
    try {
      // Format the email content
      const emailText = `
        New Contact Form Submission
        ---------------------------
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Sent on: ${new Date().toLocaleString()}
      `;

      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
        
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `;

      await sendEmail({
        to: process.env.EMAIL_RECIPIENT || "oyeyemikorede5@gmail.com", 
        from: email,
        subject: `Contact Form: ${subject}`,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process your request. Please try again later.",
    });
  }
}
