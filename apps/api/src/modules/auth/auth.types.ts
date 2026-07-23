import { UserResponse } from "../users/users.types";

//=================DTO'S=================//
export interface registerDTO{
    name : string;
    email ?: string;
    phone ?: string;
    password : string;
};

export interface loginDTO{
    email ?: string;
    phone ?: number;
    password : string;
    ipAddress ?: string;
    userAgent ?: string;
};

export interface refreshTokenDTO{
    refreshToken : string;
};


export interface forgotPasswordDTO{
    email ?: string;
    phone ?: number;
};

export interface resetPasswordDTO{
    token : string;
    password : string;
};

export interface updatePasswordDTO{
    hashedPassword : string;
    email : string
}

//============RESPONSE TYPES================//

export interface authResponse{
    accessToken : string;
    refreshToken : string;
    user : UserResponse;
};

export interface JWTPayload{
    id : string;
    identifier : string;
    sid : string;
    role : string;
};

