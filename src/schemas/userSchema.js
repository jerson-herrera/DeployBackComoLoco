import {z} from "zod"

// Esquema de validación para User
export const userInfoSchema = z.object({
    Nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede tener más de 100 caracteres"),
    
    FechaNacimiento: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "La fecha de nacimiento debe ser válida (YYYY-MM-DD)",
      }),
  
    Cedula: z
      .string()
      .min(4, "La cédula debe tener al menos 4 caracteres")
      .max(20, "La cédula no puede tener más de 20 caracteres"),
  
    Correo: z
      .string()
      .email("El correo no es válido")
      .max(50, "El correo no puede tener más de 50 caracteres"),
  
    Celular: z
      .string()
      .regex(/^[0-9]{10}$/, "El celular debe tener exactamente 10 dígitos"),
  
    Ciudad: z
      .string()
      .max(100, "La ciudad no puede tener más de 100 caracteres"),
  
    Password: z
      .string()
      .min(3, "La contraseña debe tener al menos 3 caracteres")
      .max(50, "La contraseña no puede tener más de 50 caracteres"),
  });