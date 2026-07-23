// apps/web/app/account/actions/address-actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from "next/cache";

// 1. Strict input validation schema reflecting your Prisma model boundaries
const addressInputSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long").max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid E.164 phone number pattern"),
  line1: z.string().min(5, "Address details are too short").max(250),
  line2: z.string().max(250).nullable().optional().transform(val => val === '' ? null : val),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().regex(/^[A-Z0-9 -]{3,10}$/i, "Invalid postal code format"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

// Mock database session helper simulating absolute server-side security checks
async function getAuthenticatedUser() {
  // In your real setup, pull this from your session engine (e.g., NextAuth, iron-session, Clerk)
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) throw new Error("UNAUTHORIZED_ACCESS");
  return { id: "usr_2026_secure_alpha" };
}

/**
 * Persists a validated address record securely to the backend database infrastructure.
 */
export async function createAddressAction(rawInput: unknown) {
  try {
    const user = await getAuthenticatedUser();
    
    // Parse input safely on the server to prevent dirty injection attempts
    const validatedData = addressInputSchema.parse(rawInput);

    // Simulated atomic transaction strategy (Prisma equivalent)
    // If setting a new default target coordinates configuration, clear old ones first
    if (validatedData.isDefault) {
      /* await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      }); */
    }

    const savedRecord = {
      id: `cuid_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    revalidatePath('/account');
    return { success: true, data: savedRecord };

  } catch (error) {
    console.error("[ADDRESS_WRITE_FAILURE]", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation constraints failed.", details: error.flatten().fieldErrors };
    }
    return { success: false, error: "Internal server execution intercept." };
  }
}

/**
 * Removes an explicitly bound database address node ensuring target owner identity verification.
 */
export async function deleteAddressAction(addressId: string) {
  try {
    const user = await getAuthenticatedUser();

    if (!addressId || typeof addressId !== 'string') {
      return { success: false, error: "Invalid record pointer." };
    }

    // Prisma security equivalent logic pattern:
    // Ensure the entry belongs strictly to the requesting session identity before purging
    /* await prisma.address.delete({
      where: { id: addressId, userId: user.id }
    }); */

    revalidatePath('/account');
    return { success: true };

  } catch (error) {
    console.error("[ADDRESS_PURGE_FAILURE]", error);
    return { success: false, error: "Transaction rejection processing record drop." };
  }
}