import { getAddressesByUserId, getAllUsers, getUserSummary } from "./users.repository";

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
}