import { prisma } from "../../../../../packages/database/src/client";
import { CreateKitInput } from "./admin.schema";

export async function getAllCustomKits() {
    return await prisma.ritualTemplate.findMany({
        include : {
            defaultItems : {
                include : {
                    product : {
                        include : {
                            variants : true
                        }
                    }
                }
            }
        }
    });
};

export async function createCustomPoojaKit(payload: CreateKitInput) {
  return await prisma.ritualTemplate.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      baseBoxPrice: payload.baseBoxPrice,
      isActive: payload.isActive,
      curatedBy: payload.curatedBy,
      defaultItems: {
        create: payload.defaultItems.map((item) => ({
          quantity: item.quantity,
          product: {
            connect: { id: item.productId }
          },
          variant: item.variantId
            ? { connect: { id: item.variantId } }
            : undefined
        }))
      }
    }
  });
}

export async function updatePoojaKitById(payload : any , id : string) {
  const { defaultItems, ...rest } = payload;

return  await prisma.$transaction(async (tx) => {
  await tx.templateItem.deleteMany({
    where: {
      templateId: id,
    },
  });

  const result = await tx.ritualTemplate.update({
    where: { id },
    data: {
      ...rest,
    },
  });

  await tx.templateItem.createMany({
    data: defaultItems.map((item: any) => ({
      templateId: id,
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

});
}

export async function deleteKitById(id : string) {
    return await prisma.$transaction(async  tx => {
        await tx.templateItem.deleteMany({
            where : {
                templateId : id
            }
        });

        await tx.ritualTemplate.delete({
            where : {
                id
            }
        });
    });
}


export async function getKitBySlug(slug : string){
    return prisma.ritualTemplate.findUnique({
        where : {
            slug
        },
        include : {
            defaultItems: {
                include : {
                    variant : {
                      include : {
                        product : true
                      }
                    }
                }
            }
        }
    })
}