import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await resend.emails.send({
      from: "PermitPath Contact <contact@mail.permitpathnav.com>",
      to: ["support@permitpathnav.com"],
      reply_to: email,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message." });
  }
}