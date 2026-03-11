// api/contact.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// TEMP: send to an email you can check easily (e.g. Gmail)
const TO_EMAIL = "support@permitpathnav.com";
// Use Resend's default verified sender for now
const FROM_EMAIL = "Acme <onboarding@resend.dev>";

// TEMP: allow all origins while testing
const ALLOWED_ORIGIN = "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
}

module.exports = async (req, res) => {
  try {
    // CORS preflight
    if (req.method === "OPTIONS") {
      setCors(res);
      return res.status(200).end();
    }

    setCors(res);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    console.log("Resend result:", result);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
