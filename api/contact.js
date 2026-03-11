// api/contact.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "support@permitpathnav.com";
// for now use Resend's default verified sender
const FROM_EMAIL = "Acme <onboarding@resend.dev>";

// Adjust this to your real site in production
const ALLOWED_ORIGIN = "https://permitpathnav.com";

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
  // Handle CORS preflight
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

  try {
  console.log("Calling Resend with:", { name, email, message });

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
