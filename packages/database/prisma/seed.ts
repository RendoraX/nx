import { findByEmail } from "../../../apps/api/src/modules/auth/auth.repository"
import { hashPassword } from "../../auth/src/password"
import { prisma } from "../src/client"

export async function createAdmin(
    payload : {
        email : string,
        password : string,
        role :string
    }
) {

    const hashed = await hashPassword(payload.password)
    const existingAdmin = await findByEmail(payload.email);

    if(existingAdmin) return;

    await prisma.user.create({
        data : {
            email : payload.email as string,
            password : hashed as string,
            name : "admin",
            role : "SUPER_ADMIN",
            isVerified : true
        }
    });
}