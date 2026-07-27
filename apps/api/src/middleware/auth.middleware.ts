import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../../../packages/auth/src/jwt";
import { findSession } from "../modules/auth/auth.repository";

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        code: "ACCESS_TOKEN_MISSING",
        message: "Authentication required.",
      });
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return res.status(401).json({
        success: false,
        code: "ACCESS_TOKEN_INVALID",
        message: "Access token expired.",
      });
    }
    
    if (!payload.sid || !payload.id) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_PAYLOAD_INVALID",
        message: "Invalid token payload.",
      });
    }
    
    const session = await findSession(payload.sid);
    
    if (!session) {
      return res.status(401).clearCookie("accessToken").clearCookie("refreshToken").json({
        success: false,
        code: "SESSION_NOT_FOUND",
        message: "Session not found.",
      });
    }
    
    if (session.revoked) {
      return res.status(401).json({
        success: false,
        code: "SESSION_REVOKED",
        message: "Session revoked.",
      });
    }
    
    if (session.expiresAt.getTime() <= Date.now()) {
      return res.status(401).json({
        success: false,
        code: "SESSION_EXPIRED",
        message: "Session expired.",
      });
    }
    
    if (String(session.userId) !== String(payload.identifier)) {
      return res.status(401).json({
        success: false,
        code: "USER_MISMATCH",
        message: "Invalid session.",
      });
    }
    
    req.user = payload;
    req.session = session;

    return next();
  } catch (error) {
    console.error("Auth Middleware:", error);

    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Unauthorized.",
    });
  }
}