import { createSession, createUser, createVerificationToken, deleteAllSessions, deleteSession, findByEmail, findSession, updatePassword, verifyVerificationToken } from "./auth.repository";
import { forgotPasswordDTO, loginDTO, refreshTokenDTO, registerDTO, resetPasswordDTO } from "./auth.types";
import { hashPassword, verifyPassword } from "../../../../../packages/auth/src/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../../../packages/auth/src/jwt";
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


//completed testing = 1
export const verificationToken = async (token : string) => {
    try {
        const valid = await verifyVerificationToken(token as string);
        if(!valid) throw new Error("Token verification failed.");

        const accessToken = generateAccessToken(valid);
        const refreshToken = generateRefreshToken(valid);

        return { 
            accessToken , refreshToken
        }
    } catch (error : any) {
        throw new Error("Error while verification.")
    }
}

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

        const accessToken =  generateAccessToken({id : existing.id ,identifier : existing.email as string});
        const refreshToken =  generateRefreshToken({id : existing.id ,identifier : existing.email as string});

        await createSession({
            userId : existing.id,
            refreshToken,
            ipAddress : payload.ipAddress,
            userAgent : payload.userAgent,
            expiresAt : new Date(Date.now() + 30)
        })

        return { 
            accessToken, refreshToken
        }
    } catch (error : any) {
        throw new Error(error.message as string);
    }
};

//completed , test = 0
export const refreshToken = async (payload : refreshTokenDTO) => {
    try {

        const isValidrefreshToken = verifyRefreshToken(payload.refreshToken as string);
        if(!isValidrefreshToken) throw new Error("Invalid Refresh token");


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


//=============MIDDLEWARE=============//

export const validateSession = async (refreshTokan : string) => {
    const payload =  verifyRefreshToken(refreshTokan);

  if (!payload) {
    throw new Error("Invalid refresh token");
  }

  const hash = await hashPassword(refreshTokan);

  const session = await findSession(refreshTokan as string)

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.revoked) {
    throw new Error("Session revoked");
  }

  if (session.expiresAt < new Date()) {
    throw new Error("Session expired");
  }

  return {
    session,
    payload,
  };
};
