import { prisma } from "../../../../../packages/database/src/client";
import { createCategoryDTO, deleteCategoryDTO, updateCategoryDTO } from "./categories.types";


//completed , test = 0
export async function createCategory(payload : createCategoryDTO) {
    await prisma.category.create({
        data : payload
    });
};

//completed , test = 0
export async function findById(id : string){
    return await prisma.category.findUnique({
        where : {
            id : id
        }
    });
};


//completed , test = 0
export async function findBySlug(slug : string){
    return await prisma.category.findUnique({
        where : {
            slug : slug
        }
    });
};

//completed , test = 0
export async function findAll() {
    return await prisma.category.findMany();
}

//completed , test = 0
export async function updateCategory(payload: updateCategoryDTO) {
  const { id, ...data } = payload;

  return prisma.category.update({
    where: { id },
    data,
  });
}

//completed , test = 0 
export async function deleteCategory(id : string) {
    await prisma.category.delete({
        where : {
            id : id
        }
    });
};