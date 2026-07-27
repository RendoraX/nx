import { prisma } from "../../../../../packages/database/src/client";
import { createAddressDTO, deleteAddressDTO } from "./users.types";

//admin use only
export async function getUserSummary(){
    return await prisma.$transaction(async (tx) => {
        const totalAccounts = await tx.user.count();
        const suspendedRegisteries = await tx.user.count({
            where : {
                isVerified : false
            }
        });

        return {
            totalAccounts,
            suspendedRegisteries
        }
    })
};

//admin use only
export async function getAllUsers() {
    return await prisma.user.findMany({
        include : {
            cart : {
                include : {
                    items : true
                }
            }
        }
    });
};


//user use only
export async function getAddressesByUserId(userId : string){
    return await prisma.address.findMany({
        where : {
            userId : userId,
            isDeleted : false
        }
    });
};

//user only
export async function createAddressById(payload : createAddressDTO) {
    return await prisma.address.create({
        data : {
            fullName : payload.fullName as string,
            line1 : payload.line1 as string,
            phone : payload.phone as string,
            postalCode : payload.postalCode,
            isDefault : payload.isDefault as boolean,
            line2 : payload.line2 ? payload.line2 as string : "",
            userId : payload.userId as string,
            
        }
    })
};

export async function deleteAddressById(payload: deleteAddressDTO) {
  return prisma.$transaction(async (tx) => {
    // Soft delete
    await tx.address.update({
      where: {
        id: payload.id,
      },
      data: {
        isDeleted: true,
      },
    });

    // Remove default from all active addresses
    await tx.address.updateMany({
      where: {
        userId: payload.userId,
        isDeleted: false,
      },
      data: {
        isDefault: false,
      },
    });

    // Find the newest active address
    const lastAddress = await tx.address.findFirst({
      where: {
        userId: payload.userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Make it the default
    if (lastAddress) {
      await tx.address.update({
        where: {
          id: lastAddress.id,
        },
        data: {
          isDefault: true,
        },
      });
    }
  });
}