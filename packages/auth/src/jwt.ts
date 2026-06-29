import { JWTPayload } from "../../../apps/api/src/modules/auth/auth.types";
import { env } from "../../config/src";
import { jwtTokenValidator } from "../../validators/src/auth";
import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: JWTPayload): string => {
  try {
    const jwtP = jwtTokenValidator(payload);
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'shri_ayu',
    });
  } catch (error) {
    throw new Error("Token error generation");
  }
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  try {
    const jwtP = jwtTokenValidator(payload);
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: '1M',
      issuer: 'shri_ayu',
    });
  } catch (error) {
    throw new Error("Token error generation");
  }
};

export const verifyAccessToken = (token: string): string | object => {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: 'shri_ayu',
    });
  } catch (error) {
    throw new Error("Token verification");
  }
};

export const verifyRefreshToken = (token: string): string | object => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'shri_ayu',
    });
  } catch (error) {
    throw new Error("Token verification");
  }
};

