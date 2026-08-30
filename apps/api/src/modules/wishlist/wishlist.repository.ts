import { prisma } from "../../../../../packages/database/src/client";
import { addWishlistVariant, deleteItemList, getList } from "./wishlist.types";

export const addVariantToWishlist = async (payload : addWishlistVariant) => {
    return await prisma.wishlist.upsert({
        where : {
            userId : payload.identifier as string
        },
        update : {
            items : {
                create : {
                    productId : payload.productId as string,
                    variantId : payload.variantId as string
                }
            }
        },
        
        create : {
            userId : payload.identifier as string,
            
            items : {
                create : {
                    productId : payload.productId as string,
                    variantId : payload.variantId as string
                }
            }
        },

        include : {
            items : true
        }
    })
};




export const getWishlist = async (payload : getList) => {
    return await prisma.wishlist.findUnique({
        where : {
            userId : payload.userId as string
        },
        include : {
            items : {
                include : {
                    product : {
                        include : {
                            images : true
                        }
                    },
                    variant : true
                }
            }
        }
    })
};


export const deleteItemlst = async (payload: deleteItemList) => {
  return await prisma.wishlistItem.delete({
    where: {
      wishlistId_productId_variantId : {
        wishlistId: payload.id,
        productId: payload.productId,
        variantId :payload.variantId
      },
    },
  });
};