import { createCustomPoojaKit, deleteKitById, getAllCustomKits, updatePoojaKitById } from "./admin.repository";
import {createCustomKitSchema, updateCustomKitSchema} from './admin.schema'

export async function getAllKits() {
    try {
        return  getAllCustomKits();
    } catch (error) {
        throw new Error((error as any).message || error || "Get all kits error")
    }
};

export async function createPoojaKit(payload : any) {
    try {
        const validData = createCustomKitSchema.parse(payload)
        return await createCustomPoojaKit(validData)
    } catch (error) {
        throw new Error((error as any).message || error || "Get all kits error")
    }
};

export async function updatePoojaKit(payload : any , templateId : string) {
    try {
        const validUpdateData = updateCustomKitSchema.parse(payload);
        return await updatePoojaKitById(validUpdateData , templateId)
    } catch (error) {
        throw new Error((error as any).message || "Error while updating pooja kit")
    }
};

export async function deletePoojaKit(id : string) {
    try {
        return await deleteKitById(id)
    } catch (error) {
        throw new Error((error as any).message || error || "Pooja kit delete error");
    }
}