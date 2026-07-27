import { createAddressById, deleteAddressById, getAddressesByUserId, getAllUsers, getUserSummary } from "./users.repository";
import { createAddressDTOSchema, deleteAddressSchema } from "./users.schema";
import { createAddressDTO, deleteAddressDTO } from "./users.types";

//admin use only
export async function summaryUser() {
    return getUserSummary();
}


//admin use only
export async function allUsers(){
    return getAllUsers();
}


//user only
export async function getAddresses(id : string) {
    try {
        return getAddressesByUserId(id as string);
    } catch (error) {
        throw new Error((error as any).message || "Error while getting all addresses !");
    }   
};

//user only
export async function createAddress(payload : createAddressDTO) {
    try {
        const isPayloadValid = createAddressDTOSchema.parse(payload);
        if(!isPayloadValid) throw new Error("Payload is not valid !");
        return await createAddressById(payload)
    } catch (error) {
        throw new Error((error as any).message || error || "Error while creating the new address")
    }
}

//user only
export async function deleteAddress(payload : deleteAddressDTO) {
    try {
        const isPayloadValid = deleteAddressSchema.parse(payload);
        if(!isPayloadValid) throw new Error("Payload is not valid !")

            return await deleteAddressById(isPayloadValid as unknown as deleteAddressDTO);
    } catch (error) {
        throw new Error((error as any).message || error || "Error while deleting the address !")
    }
}