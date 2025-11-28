import nodemailer from "nodemailer";
import dotenv from "dotenv";
//Populating environment variables
dotenv.config({ path: "../.env" });

console.log(process.env.SMTP_HOST);

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to, job) {
  const subject = `New Job Match: ${job.title}`;
  const text = `
  A new job matches your skills!
  Title: ${job.title}
  Location:${job.location}
  Link:${job.url}

  Go apply quickly!
  `;

  const html = `
    <h2>New Job Match Found</h2>
    <p><strong>${job.title}</strong></p>
    <p>${job.company} — ${job.location}</p>
    <p><a href="${job.url}" target="_blank">View Job →</a></p>
    <br/>
    <small>Sent by Job Notifier</small>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Job Notifier" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.log("An Error occured while sending an email", error);
    return false;
  }
}
