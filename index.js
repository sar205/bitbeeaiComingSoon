const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// MongoDB Config
require("./mongodb/config");
const UserEmail = require("./mongodb/userEmail/userEmail");

app.use(bodyParser.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    credentials: true,
  })
);

const sendConfirmationEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"BitBee AI" <${process.env.EMAIL}>`,
      to: email,
      subject: "Thank You for Connecting with BitBee AI!",
      text: `Dear valued user,

Thank you for connecting with BitBee AI! We appreciate your interest in our platform and look forward to helping you explore the power of AI. Stay tuned for more updates and exciting features!

Warm regards,
The BitBee AI Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

app.post("/api/store/email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existingEmail = await UserEmail.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newEmail = new UserEmail({ email });
    await newEmail.save();

    // Send confirmation email
    await sendConfirmationEmail(email);

    res.status(200).json({ message: "SuccessFull Subscribe BitBeeAI" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
