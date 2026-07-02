import { createCategory, deleteCategory, findAll, findBySlug, updateCategory } from "./categories.repository";
import { createCatSchema, deleteCatSchema, updateCatSchema } from "./categories.schema";
import { createCategoryDTO, deleteCategoryDTO, updateCategoryDTO } from "./categories.types";


//completed , test = 0
export const createCat = async (payload : createCategoryDTO) => {
    const isValidCatData =  createCatSchema.parse(payload);
    if(!isValidCatData) throw new Error("Category data is invalid !");

    const existingSlug = await findBySlug(payload.slug as string);
    if(existingSlug) throw new Error("Slug is present !");

    await createCategory(isValidCatData as createCategoryDTO);
};

//completed , test = 0
export const updateCat = async (payload : updateCategoryDTO) => {
    const isValidCatData = updateCatSchema.parse(payload);
    if(!isValidCatData) throw new Error("Invlaid update data !");

    const updated = await updateCategory(isValidCatData as updateCategoryDTO);
};


//completed , test = 0;
export const deleteCat = async (payload : deleteCategoryDTO) => {
    const valid = deleteCatSchema.parse(payload);
    if(!valid) throw new Error("Invalid category data !");

    await deleteCategory(valid.id as string);
};

//completed , test = 0
export const getAllCategory = async () => {
    const categories = await findAll();
    return categories;
};
