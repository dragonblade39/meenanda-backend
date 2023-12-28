const express = require("express");
const router = express.Router();
const Schema = require("../schema/Schema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  //   host: "smtp-mail.outlook.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

const sendOTPVerificationEmail = async (
  { name, email, subject, message },
  res
) => {
  try {
    const mailOptionsUser = generateMailOptions({
      to: email,
      subject: "Thank you for reaching out!",
      html: `<p>Dear <strong>${name}</strong>,</p>
    <p>We appreciate your interest and the opportunity to assist you. Your query is important to us, and we will make every effort to provide you with the information you need.</p>
    <p>Thank you for considering us. <em>We reach you as soon as possible</em> and providing a satisfactory resolution to your query.
    </p>
    <p><strong>Best regards,</strong></p>
    <p>Abhishek Kumar</p>
    <p>Admin</p>
    <p>Ph No.: +91 99869 43389</p>
    `,
    });

    const mailOptionsAdmin = generateMailOptions({
      to: process.env.AUTH_EMAIL,
      subject: "Hey! You got a Message from your Company Website!",
      html: `<p>Hi Abhishek Kumar, You got a New Message !</p>
    <p><strong>Name</strong>:-${name}</p>
    <p><strong>Email</strong>:-${email}</p>
    <p><strong>Subject</strong>:-${subject}</p>
    <p><strong>Message</strong>:-${message}</p>
    `,
    });

    await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsAdmin),
    ]);
    res.status(200).json("Successfull");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json("Error creating user");
  }
};

function generateMailOptions({
  from = process.env.AUTH_EMAIL,
  to,
  subject,
  html,
}) {
  return {
    from: {
      name: "Meenanda Infratech",
      address: from,
    },
    to,
    subject,
    html,
  };
}

router.post("/create", async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    const newUser = new Schema({
      name,
      email,
      subject,
      message,
    });

    await newUser.save();
    sendOTPVerificationEmail({ name, email, subject, message }, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
