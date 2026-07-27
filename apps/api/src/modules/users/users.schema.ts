import z from 'zod'

export const createAddressDTOSchema = z.object({
    fullName : z.string().nonempty("Please provide the full name !"),
    line1 : z.string().nonempty("Please provide you full address !"),
    phone : z.string().nonempty("Please provide contact number").min(10 , "Please provide valid number !"),
    postalCode : z.string().nonempty("Please provide valid postacl codde"),
    isDefault : z.boolean().default(true),
    line2 : z.string().optional(),
    userId : z.string().nonempty("User id is not available")
});


export const deleteAddressSchema = z.object({
    id : z.string().nonempty("Id is not available !"),
    userId : z.string().nonempty("This acttion not belong to this user !")
})