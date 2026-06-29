import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../../../packages/auth/src/jwt";

interface AuthRequest extends Request {
    user ?: any
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return res.status(401).json({
        message: "Access token expired.",
      });
    }

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}