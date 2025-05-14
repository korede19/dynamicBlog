import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.from || !data.subject || !data.body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { NEXT_PUBLIC_SMTP_EMAIL, NEXT_PUBLIC_SMTP_PASSWORD } = process.env;

    if (!NEXT_PUBLIC_SMTP_EMAIL || !NEXT_PUBLIC_SMTP_PASSWORD) {
      console.error("SMTP credentials are missing.");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: NEXT_PUBLIC_SMTP_EMAIL,
        pass: NEXT_PUBLIC_SMTP_PASSWORD,
      },
    });

    try {
      const testResult = await transport.verify();
      console.log("SMTP Connection Verified:", testResult);
    } catch (error) {
      console.error("SMTP verification failed:", error);
      return new Response(
        JSON.stringify({ error: "SMTP verification failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const emailFrom = {
        name: "Contact Form",
        address: NEXT_PUBLIC_SMTP_EMAIL,
      };

      const sendResult = await transport.sendMail({
        from: emailFrom,
        to: NEXT_PUBLIC_SMTP_EMAIL,
        subject: data.subject,
        html: data.body,
        replyTo: data.from, // Put the user's email as reply-to
      });

      console.log("Email sent:", sendResult);

      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({
          error: "Email sending failed",
          details: (error as Error).message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
