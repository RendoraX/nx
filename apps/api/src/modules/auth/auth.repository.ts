
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../../packages/database/src/client";
import { addressResponse, updateAddressDTO, UserResponse  } from "../users/users.types";
import { registerDTO, updatePasswordDTO } from "./auth.types";
import { randomBytes } from "crypto";


//TESTED
export const findByEmail = async (
  email: string
) => {
  try {
    console.log("repo email:", email);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    console.log("PRISMA ERROR");
  console.dir(err, { depth: null });

  throw err;
  }
};

//TESTES
export const createUser = async (userPayload : registerDTO) : Promise<UserResponse | null> => {
    try {
        const user = await prisma.user.create({
            data : userPayload as Prisma.UserCreateInput
        });
        return user as UserResponse;
    } catch (error : any) {
        return error;
    }
};

//TESTED
export const createVerificationToken = async (email : string) => {
    const token = randomBytes(6).toString("base64");

    await prisma.verificationToken.create({
        data : {
            token,
            userEmail : email as string
        }
    });

    return token;
}

//TESTED
export const verifyVerificationToken = async (token : string) => {
    const tokenExist = await prisma.verificationToken.findFirst({
        where : {
            token : token as string
        }
    });

    if(!tokenExist) throw new Error("Token is invalid.")

    await prisma.verificationToken.delete({
        where : {
            id : tokenExist.id
        }
    });

    await prisma.user.update({
        where : {
            email : tokenExist.userEmail as string
        },

        data : {
            isVerified : true
        }
    });

    return {
        id : tokenExist.id,
        identifier : tokenExist.userEmail
    } as {
        id : string;
        identifier : string;
        sid ?: string
    };
}

//completed tested = 1
export const createSession = async (sessiondata : any) : Promise<any> => {
    try {
        const session = await prisma.session.create({
            data : sessiondata
        });

        return session;
    } catch (error) {
        return error;
    }
};


export const updateSesson = async (payload : {newToken : string , id : string}) => {
    return await prisma.session.update({
        where : {
            id : payload.id as string
        },

        data : {
            refreshTokenHash : payload.newToken as string
        }
    })
}

// completed , tested = 0
export const findSession = async (id : string) => {
    const session = await prisma.session.findUnique({
        where : {
            id  : id as string
        }
    });

    return session;
};

//completed , tested = 0
export const getAllSession = async (userId : string) => {
    const sessions = await prisma.session.findMany({
        where : {
            userId : userId as string
        }
    })
}

//completed , test = 1
export const deleteSession = async (rToken : string) : Promise<any> => {
    try {
        const deletedSession = await prisma.session.delete({
            where : {
                refreshTokenHash : rToken as string
            }
        });
        return deleteSession;
    } catch (error) {
        return error;
    }
};

//completed , test = 1
export const updatePassword = async (payload : updatePasswordDTO) => {
     await prisma.user.update({
        where : {
           email : payload.email as string
        },

        data : {
            password : payload.hashedPassword as string
        }
    });
};

//  completed   , test = 1
export const deleteAllSessions = async (id : string) => {
    await prisma.session.deleteMany({
        where : {
            userId : id as string
        }
    });
};




//testing = 0
export const findById = async (id : string) : Promise<UserResponse | null> => {
    const user = await prisma.user.findFirst({
        where : {
            id : id as string
        }
    });
    return user as UserResponse;
};

//unimplemented , testing = 0
export const updateAddress = async (addressPayload : updateAddressDTO) : Promise<{
    message : string,
    error : any
} | null | addressResponse> => {
    try {
        const response = await prisma.address.update({
            where : {
                id : addressPayload.id as string
            },

            data : addressPayload
        }); 

        return {
            ...response,
            line2: response.line2 ?? undefined
        } as addressResponse;
    } catch (error) {
        return {
            message : "Address update failed.",
           error  
        }
    }
};