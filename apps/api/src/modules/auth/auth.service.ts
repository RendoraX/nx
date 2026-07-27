import { createSession, createUser, createVerificationToken, deleteAllSessions, deleteSession, findByEmail, findById, findSession, updatePassword, updateSesson, updateVerificationToken, verifyVerificationToken } from "./auth.repository";
import { forgotPasswordDTO, JWTPayload, loginDTO, refreshTokenDTO, registerDTO, resetPasswordDTO } from "./auth.types";
import { hashPassword, verifyPassword } from "../../../../../packages/auth/src/password";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../../../../packages/auth/src/jwt";
import { veirfyEmail } from "../../../../../packages/email/src/templates/verify-email";
import { resetPasswordEmail } from "../../../../../packages/email/src/templates/reset-password";
import { resetPasswordSuccessEmail } from "../../../../../packages/email/src/templates/reset-password-success";





//COMPLETED , tsting = 1
export const register = async (payload : registerDTO) => {
    try {

        const existing = await findByEmail(payload.email as string);

        if(existing) throw new Error("User already exits.");
        const hashshedPass = await hashPassword(payload.password as string);

        const createdUser = await createUser({
            ...payload,
            password : hashshedPass
        });

        const token = await createVerificationToken(payload.email as string);
        await veirfyEmail(token , payload.email as string);

        return createdUser;
        
    } catch (error : any) {
        throw new error
    }
};


//completed , testing = 1
export const resendVerification = async (payload : {
    email :string
}) => {
    try {
        const token = await updateVerificationToken(payload.email as string);
        await veirfyEmail(token , payload.email as string);
    } catch (error) {
        throw new Error("Error while sending new verification email")
    }
}

//completed testing = 1
export const verificationToken = async (payload: {
    token: string;
    ipAddress: string;
    userAgent: string;
}) => {
    try {
        const valid = await verifyVerificationToken(payload.token);

        if (!valid) {
            throw new Error("Token verification failed.");
        }

        const session = await createSession({
            userId: valid.id, // Make sure this is the User.id
            ipAddress: payload.ipAddress,
            userAgent: payload.userAgent,
            expiresAt: new Date(
                        new Date().setMonth(new Date().getMonth() + 1)
                    ), // 30 days
        });

        const accessToken = generateAccessToken({
            ...valid,
            sid: session.id,
            role : "USER"
        });

        const refreshToken = generateRefreshToken({
            ...valid,
            sid: session.id,
            role : 'USER'
        });

        const refreshTokenHash = await hashPassword(refreshToken);

        await updateSesson({
            id: session.id,
            newToken: refreshTokenHash,
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error: any) {
        throw new Error(error.message || "Error while verification.");
    }
};

//completed testing = 1
export const login = async (payload : loginDTO) : Promise<{
    accessToken : string,
    refreshToken : string
}> => {
    try {

        
        const existing = await findByEmail(payload.email as string);
        if(!existing) throw new Error("User not exits.")
            const isValidPassword = await verifyPassword(payload.password as string , existing.password as string);
        
        if(!isValidPassword) throw new Error("Invalid credentials.");
        
        const createdSession = await createSession({
            userId : existing.id,
            ipAddress : payload.ipAddress,
            userAgent : payload.userAgent,
            expiresAt: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            )
        })
        const accessToken =  generateAccessToken({id : existing.id ,identifier : existing.id as string , sid : createdSession.id as string , role :existing.role});
        const refreshToken =  generateRefreshToken({id : existing.id ,identifier : existing.id as string , sid : createdSession.id as string , role : existing.role});
        const refreshTokenHash = await hashPassword(refreshToken as string);
        
        await updateSesson({id : createdSession.id , newToken : refreshTokenHash});
        
        console.log(existing)
        return { 
            accessToken, refreshToken
        }
    } catch (error : any) {
        throw new Error(error.message as string);
    }
};

//completed , test = 0
export const refreshTokenRotate = async (payload : refreshTokenDTO) => {
    try {

        const refreshToken = payload.refreshToken as string;
        const isValidRefreshToken =  verifyRefreshToken(refreshToken);
        if(!isValidRefreshToken) throw new Error("Refresh Token is expired !!");

        const session = await findSession(isValidRefreshToken.sid as string);
        if(!session) throw new Error("Session not found !!");

        if(!(verifyPassword(refreshToken , session.refreshTokenHash as string))){
            throw new Error("RefreshToken is not valid !!!")
        };
        
        const newAccessToken = generateAccessToken({
            id : isValidRefreshToken.id as string,
            identifier : isValidRefreshToken.identifier,
            sid : session.id as string,
            role : "USER"
        })
        const newRefreshTokenString = generateRefreshToken({
            id : isValidRefreshToken.id as string,
            identifier : isValidRefreshToken.identifier,
            sid : session.id as string,
            role : "USER"
        });

        const newRefreshTokenStringHash = await hashPassword(newRefreshTokenString as string);
        await updateSesson({
            id : session.id as string,
            newToken : newRefreshTokenStringHash as string
        })

        return {
            newAccessToken,
            newRefreshTokenString
        }
    } catch (error) {
        throw new Error((error as any).message)
    }
};

//completed , test = 1
export const logout = async (refreshToken : string) => {
    try {
        console.log(refreshToken)
        const deletedSession = await deleteSession(refreshToken);
    } catch (error) {
        throw new Error("[auth ser] :: Logout failed.")
    }
};

// completed , test = 1
export const logoutAll = async (userId : string) => {
    try {
        await deleteAllSessions(userId);
    } catch (error) {
        throw new Error("Sessions revoke error !")
    }
}

//completed , test =1
export const forgotPassword = async (payload : forgotPasswordDTO) => {
    try {
        const exiting = await findByEmail(payload.email as string);
        if(!exiting) throw new Error("User not found !");
        
        const tkn = await createVerificationToken(payload.email as string);
        
        const URL = `https://localhost:4000/auth/forgot-pass?token=${tkn}`;
        await resetPasswordEmail(URL , exiting.name as string , payload.email as string);
    } catch (error) {
        throw new Error("Init forgot pass !")   
    }
};

//completed , test = 1
export const resetPassword = async (payload : resetPasswordDTO) => {
    try {
        const verifiedToken = await verifyVerificationToken(payload.token as string);
        if(!verifiedToken) throw new Error("Token is invalid");

        const hashedPassword = await hashPassword(payload.password as string);
        await updatePassword({
            hashedPassword : hashedPassword as string,
            email : verifiedToken.identifier as string
        });

        const user = await findByEmail(verifiedToken.identifier as string);
        await deleteAllSessions(user?.id as string);
        await resetPasswordSuccessEmail(user?.name as string , verifiedToken.identifier as string);

    } catch (error) {
        throw new Error("Reset error !");
    }    
};

//completed , test = 0;;
export const getMeByToken = async (token : string) => {
    try {
        const validTokenData = verifyAccessToken(token as string);
        if(!validTokenData) throw new Error("Access Token is not valid !!");
        const user =  await findById(validTokenData.identifier) as any;
        user.currentSessionId = validTokenData.sid as string;

        const {password , ...userWP} = user;
        return userWP;
    } catch (error : any) {
        console.log( "===================================\n\n\n", error.message , "\n\n\n=============================")
        throw new Error(error.message || "Error while getting me !");
    }
}
//=============MIDDLEWARE=============//
export const validateSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new Error("Invalid refresh token");
  }

  const hash = await hashPassword(refreshToken);

  const session = await findSession(hash);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.revoked) {
    throw new Error("Session revoked");
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    throw new Error("Session expired");
  }

  // Extra security checks
  if (session.userId !== payload.userId) {
    throw new Error("Session user mismatch");
  }

  if (session.refreshTokenHash !== hash) {
    throw new Error("Session hash mismatch");
  }

  return {
    session,
    payload,
  };
};