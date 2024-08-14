import * as dotenv from 'dotenv';

dotenv.config()

export const jwt_constants = {
  secret: process.env.JWT_SECRET,
};
