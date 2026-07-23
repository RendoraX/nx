import { Request, Response, NextFunction } from "express";

import { validateSession } from "../modules/auth/auth.service";
import { verifyRefreshToken } from "../../../../packages/auth/src/jwt";

export async function guestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next();
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return next();
    }

    const session = await validateSession(refreshToken);

    if (!session) {
      return next();
    }

    return res.status(200).json({
      message: "Already authenticated.",
    });
  } catch {
    return next();
  }
}