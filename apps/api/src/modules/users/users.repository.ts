import { prisma } from "../../../../../packages/database/src/client";

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
            id : userId
        },
        include : {
            pincode : true 
        }
    });
};