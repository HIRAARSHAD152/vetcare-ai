import "dotenv/config";
import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),

  PORT: port({
    default: 5000,
  }),

  CLIENT_URL: str(),

  MONGODB_URI: str(),

  JWT_SECRET: str(),

  JWT_EXPIRES_IN: str(),

  COOKIE_SECRET: str(),

  CLOUDINARY_CLOUD_NAME: str(),

  CLOUDINARY_API_KEY: str(),

  CLOUDINARY_API_SECRET: str(),

  SMTP_HOST: str(),

  SMTP_PORT: port(),

  SMTP_USER: str(),

  SMTP_PASS: str(),

  EMAIL_FROM: str(),

  JWT_REFRESH_EXPIRES_IN: str({default: "30d",}),
  
});

export default env;