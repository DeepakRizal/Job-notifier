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
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 8px; border: 1px solid #eaeaea;">
      
      <h2 style="color: #333; margin-bottom: 10px;">
         New Job Match Just for You
      </h2>

      <p style="font-size: 16px; color: #555; margin-top: 0;">
        A new job that matches your skills has just been posted.
      </p>

      <div style="padding: 15px; border-left: 4px solid #4f46e5; background: #f3f3ff; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin: 0; color: #1f1f1f; font-size: 20px;">
          ${job.title}
        </h3>
        <p style="margin: 5px 0; color: #444;">
          <strong>${job.company}</strong>
          <br/>
           ${job.location}
        </p>
      </div>

      <a href="${job.url}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 10px;
        "
        target="_blank"
      >
        View Job → 
      </a>

      <p style="margin-top: 25px; font-size: 13px; color: #888;">
        You received this alert because it matches your selected skills.
        <br/>
        <span style="color: #4f46e5;">Job Notifier</span> — Helping you stay ahead 
      </p>
    </div>
  </div>
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
