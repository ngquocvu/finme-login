import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const registerMail = async (req, res) => {
  let nodeConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(nodeConfig);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });
  const { username, userEmail, text, subject } = req.body;

  var email = {
    body: {
      name: username,
      intro: text || "Welcome to our page",
      outro: "Need help, or help questions?Just reply this email",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || "Signup successful",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send({ error }));
};
