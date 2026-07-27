import { Request, Response, NextFunction } from "express";
import { validateSession } from "../modules/auth/auth.service";

const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  // Clear access token too if you store it in cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

export async function guestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies?.refreshToken;

  // No cookie → user is a guest
  if (!refreshToken) {
    return next();
  }

  try {
    await validateSession(refreshToken);
    console.log
    // User already logged in
    return res.status(200).json({
      message: "Already authenticated.",
    });
  } catch {
    // Invalid/stale session → logout silently
    clearAuthCookies(res);

    return next();
  }
}