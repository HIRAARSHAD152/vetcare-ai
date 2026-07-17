import emailTransporter from "../config/email.js";
import env from "../config/env.js";

const sendVerificationOtpEmail = async ({
  email,
  name,
  otp,
}) => {
  await emailTransporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Verify Your VetCare AI Account",
    text: `Hello ${name}, your verification OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <h2>Verify Your VetCare AI Account</h2>
      <p>Hello ${name},</p>
      <p>Your verification OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
};

const sendPasswordResetOtpEmail = async ({
  email,
  name,
  otp,
}) => {
  await emailTransporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "VetCare AI Password Reset OTP",
    text: `Hello ${name}, your password reset OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
};

export { sendVerificationOtpEmail, sendPasswordResetOtpEmail };