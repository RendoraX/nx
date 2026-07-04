import { registerDTO, resetPasswordDTO } from "./auth.types";
import { Request, Response } from "express";
import { forgotPassword, login, logout, logoutAll, refreshTokenRotate, register, resetPassword, verificationToken } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { verifyRefreshToken } from "../../../../../packages/auth/src/jwt";
import { UserResponse } from "../users/users.types";
import { string } from "zod";

//completed , tested = 1
export const registerEndpoint = async ( req : Request, res : Response) => {
    try {
        const payload = await req.body;
        const registerSchemaValid = registerSchema().parse(payload);

         await register(registerSchemaValid as registerDTO);        
        
        return res.status(200).json({
            message : "Register successfully."
        });
    } catch (error : any) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error",
            error  : error | error.message
        })
    }
};

//completed , tested = 1
export const verificationTokenEndpoint = async (req : Request ,res : Response) => {
    try {
        const payload = {
            token : await req.body.token as string,
            ipAddress :  req.ip as string,
            userAgent : req.headers["user-agent"] as string
        };

        await verificationToken(payload);

        return  res.status(200).json({
            message : "User verified successfully."
        });
    } catch (error : any) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error",
            error  : error | error.message
        })
    }
};


//completed , tested = 1
export const loginEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body;
        const metadata = {
            ipAddress : await req.ip,
            userAgent : await req.headers["user-agent"]      
        };

        console.log(payload)
        
        const loginSchemaValid = loginSchema().parse({...payload , ...metadata});

        
        const cookies = await login(loginSchemaValid)

        console.log(cookies)
        return  res.status(200)
        .cookie("accessToken", cookies.accessToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
})
        .cookie("refreshToken", cookies.refreshToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
})
        .json({
            message : "User logged  successfully."
        })
    } catch (error : any) {
        console.log((error as any).message)
        return res.status(500).json({
            message : "Internal server error.",
            error :  error.message | error
        })
    }
};

//completed , testing = 1
export const logoutEndpoint = async (req : Request , res : Response) =>{
    try {
        const {refreshToken} = req.cookies
        if(!refreshToken) throw new Error("Invalid request !")
        await logout(refreshToken.refreshToken as string)

        return res.status(200)
                    .clearCookie("accessToken")
                    .clearCookie("refreshToken")
                    .json({
                        message : "User logout successfully !"
                    });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error.",
            error :  error.message | error
        })
    }
}

//completed , testing = 1;
export const logoutAllDevicesEndpoint = async (req : Request , res : Response) => {
    try {
        const token =  req.cookies;

        const data : UserResponse = verifyRefreshToken(token.refreshToken) as UserResponse;

        await logoutAll(data.id as string)

        return res.status(200)
                    .clearCookie("accessToken")
                    .clearCookie("refreshToken")
                    .json({
                        message : "Logged successfully !"
                    });

    } catch (error) {
        return res.status(500).json({
            message : "Internal server error.",
            error : (error as any).message
        })
    }
}

//completed , testing = 1;
export const forgotPasswordInitEndpoint  = async (req : Request ,res : Response) => {
    try {
        const payload = await req.body;

        await forgotPassword(payload);

        return res.status(200).json({
            message : "Forgot pass URL sent !"
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error.",
            error : error | error.message
        })
    }
}

//completed , testing = 1;
export const resetPasswordEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body;
        await resetPassword(payload);

        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                message : "Password changed Successfully !"
            });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error",
            error : error | (error as any).message 
        })
    }
}

//completed 
export const rotateRefreshTokenEndpoint = async (req : Request , res : Response) => {
    try {
        const {refreshToken} = await req.cookies;

        const tokens =await refreshTokenRotate({
            refreshToken
        });
        return res.status(200)
                    .cookie("accessToken" , tokens.newAccessToken as string)
                    .cookie("refreshToken" , tokens.newRefreshTokenString as string)
                    .json({
                        message : "Token rotated successfully !"
                    });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error.",
            error : error.message | error
        })
    }
}