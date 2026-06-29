import { z } from "zod";
import { JWTPayload } from "../../../apps/api/src/modules/auth/auth.types";

export const jwtTokenValidator = (payload : JWTPayload) => 
  z.object({
    id : z.string(),
    identifier : z.string()
  });