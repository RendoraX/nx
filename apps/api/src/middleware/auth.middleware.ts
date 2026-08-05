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
    
    // Resolve user ID flexibly across standard JWT claims
    const userIdFromToken = payload.id || payload.userId || payload.sub || payload.identifier;

    if (!payload.sid || !userIdFromToken) {
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
      return res.status(401).clearCookie("accessToken").clearCookie("refreshToken").json({
        success: false,
        code: "SESSION_REVOKED",
        message: "Session revoked.",
      });
    }
    
    const expiresAt = new Date(session.expiresAt).getTime();
    if (expiresAt <= Date.now()) {
      return res.status(401).clearCookie("accessToken").clearCookie("refreshToken").json({
        success: false,
        code: "SESSION_EXPIRED",
        message: "Session expired.",
      });
    }
    
    // Safe ID comparison
    const sessionUserId = String(session.userId);
    const tokenUserId = String(userIdFromToken);

    if (sessionUserId !== tokenUserId) {
      console.error(`[Auth Mismatch] Session User: ${sessionUserId} | Token User: ${tokenUserId}`);
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