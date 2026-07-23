import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken, verifyRefreshToken } from "../../../../packages/auth/src/jwt";



interface JwtPayload {
  email: string;
  role : string
}

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {


    const token = req.cookies

    const decoded = token.accessToken ? verifyAccessToken(token.accessToken) : verifyRefreshToken(token.refreshToken)

   decoded ? () => console.log(decoded) : () => console.log("invalid ");

    if(!["SUPER_ADMIN" , "ADMIN"].includes(decoded.role)){
      return res.status(401).json({
        message :"This action is restricted",
        success : false
      })
    }
     console.log((req as any).user)
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};