import { prisma } from "../../../../../packages/database/src/client";

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

export async function createCustomPoojaKit(payload : any) {
    return  await prisma.ritualTemplate.create({
        data : {
            name : payload.name,
            baseBoxPrice : payload.baseBoxPrice,
            description : payload.description,
            slug : payload.slug,
            defaultItems : {
                create : payload.defaultItems.map((item : any) => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            },
            curatedBy : "demo"
        }
    })
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