
import { Prisma } from "../../../../../packages/database/generated/client/client";
import { prisma } from "../../../../../packages/database/src/client";
import { addressResponse, updateAddressDTO, UserResponse  } from "../users/users.types";
import { registerDTO, updatePasswordDTO } from "./auth.types";
import crypto, { hash } from "crypto";


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
      include : {
        cart : true,
        orders : true ,
        addresses : {
            where : {
                isDeleted : false
            }
        },
        sessions : {
            omit : {
                refreshTokenHash : true,
                userId : true
            },
            where : {
                revoked : false
            }
        },
        wishlist : true
      },
      omit : {
        passwordResetToken : true,
        verificationToken : true,
        updatedAt : true,
      }
    });

    return user;
  } catch (err) {
    console.log("PRISMA ERROR");
  console.dir(err, { depth: null });

  throw err;
  }
};



//TESTES
export const createUser = async (
  userPayload: registerDTO
): Promise<UserResponse> => {

  const user = await prisma.user.create({
    data: userPayload as Prisma.UserCreateInput,
  });

  return user as UserResponse;
};

//TESTED
export const createVerificationToken = async (email : string) => {
    const token = crypto.randomInt(100000, 1000000).toString();
    
    await prisma.verificationToken.create({
        data : {
            token,
            userEmail : email as string
        }
    });
    
    return token;
}

export const updateVerificationToken = async (email : string)=> {
    const token = crypto.randomInt(100000, 1000000).toString();
    await prisma.$transaction([
         prisma.verificationToken.findFirst({
            where : {
                userEmail : email
            }
        }),
         prisma.verificationToken.updateMany({
            where : {
                userEmail : email
            },
            data : {
                token 
            }
        })
    ]);

    return token
}
//TESTED
export const verifyVerificationToken = async (token: string) => {
  const existingToken =
    await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    });

  if (!existingToken) {
    throw new Error("Token is not valid");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: existingToken.userEmail,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  return {
    id: user.id,
    identifier: user.email,
  };
};
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
export const getAllSessionByUserId = async (userId : string) => {
    const sessions = await prisma.session.findMany({
        where : {
            userId : userId as string
        }
    });
    return sessions;
}

//completed , test = 1
export const deleteSession = async (rToken : string) : Promise<any> => {
    try {
        const deletedSession = await prisma.$transaction(async tx => {
            const validSession = await tx.session.findFirst({
                where : {
                    refreshTokenHash : rToken as string
                }
            });

            await tx.session.delete({
                where : {
                    id : validSession?.id
                }
            })
        });
        return deletedSession;
    } catch (error) {
        return error;
    }
};

//completed , test = 1
export const updatePasswordById = async (payload : updatePasswordDTO) => {
     return await prisma.user.update({
        where : {
           id : payload.id as string
        },

        data : {
            password : payload.password as string,
            passwordResetToken : "" as string
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
        },
        include : {
        cart : true,
        orders : true ,
        addresses : {
            where : {
                isDeleted : false
            }
        },
        sessions : true,
      },
      omit : {
        passwordResetToken : true,
        verificationToken : true,
        updatedAt : true,
      }
    });
    return user as UserResponse;
};

export const revokeSessionById = async (userId : string, sessionId : string)=>{
    return await prisma.session.update({
        where : {
            userId,
            id : sessionId as string
        },
        data : {
            revoked : true
        }
    })
}

export const revokeAllSessionById = async (userId : string, sessionId : string)=>{
    return await prisma.session.deleteMany({
        where : {
            userId,
            id : {
                not : sessionId as string
            }
        }
    })
}


export const updatePasswordResetToken = async ( email : string , hashedToken : string) => {
    return await prisma.user.update({
        where : {
            email
        },
        data : {
            passwordResetToken : hashedToken as string
        }
    })
};

export const verifyPasswordResetToken = async (resetToken : string) => {

    const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

    return await prisma.user.findFirst({
        where : {
            passwordResetToken : hashedToken as string
        },
    });
}