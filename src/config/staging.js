import dotenv from "dotenv"
dotenv.config()


export const development = {
  mongodb_connection_url: process.env.STAGING_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.STAGING_BCRYPT_SALT_ROUND,
  jwt_secret_key_restr: process.env.STAGING_JWT_SECRET_RESTAURANT,
  jwt_secret_key: process.env.STAGING_JWT_SECRET,
  port: +process.env.PORT
}