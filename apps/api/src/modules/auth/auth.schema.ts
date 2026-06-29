//PLEASE REFER AUTH.TYPES.TS TO HAVE LOOK ON DTO'S AND INTERFACES FOR IT

import * as z from "zod";
import {
  loginDTO,
  registerDTO,
  refreshTokenDTO,
  forgotPasswordDTO,
  resetPasswordDTO,
} from "./auth.types";


export const registerSchema = (): z.ZodType<registerDTO> =>
  z.object({
    name: z
      .string()
      .nonempty({
        message: "Please provide name",
      })
      .min(3, {
        message: "Name must be at least 3 characters",
      }),

    email: z
      .string()
      .email({
        message: "Please provide valid email",
      })
      .optional(),

    phone: z
      .string({
        message: "Please provide valid phone number",
      })
      .optional(),

    password: z
      .string()
      .nonempty({
        message: "Please provide password",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  });

export const loginSchema = (): z.ZodType<loginDTO> =>
  z
    .object({
      email: z
        .string()
        .email({
          message: "Please provide valid email",
        })
        .optional(),

      phone: z.number().optional(),

      password: z.string().nonempty({
        message: "Please provide password",
      }),
    })
    .refine((data) => data.email || data.phone, {
      message: "Please provide either email or phone",
      path: ["email"],
    });


export const refreshTokenSchema = (): z.ZodType<refreshTokenDTO> =>
  z.object({
    refreshToken: z.string().nonempty({
      message: "Refresh token is required",
    }),
  });


export const forgotPasswordSchema = (): z.ZodType<forgotPasswordDTO> =>
  z
    .object({
      email: z
        .string()
        .email({
          message: "Please provide valid email",
        })
        .optional(),

      phone: z.number().optional(),
    })
    .refine((data) => data.email || data.phone, {
      message: "Please provide either email or phone",
      path: ["email"],
    });


export const resetPasswordSchema = (): z.ZodType<resetPasswordDTO> =>
  z.object({
    token: z.string().nonempty({
      message: "Token is required",
    }),

    password: z
      .string()
      .nonempty({
        message: "Please provide password",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  });