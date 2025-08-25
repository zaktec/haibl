import { z } from "zod";
import { ERROR_MESSAGES } from "./errors";
export const mailFormSchema = z.object({
  learnerName: z.string().min(1, ERROR_MESSAGES.LEARNER_NAME_REQUIRED),
  parentName: z.string().min(1, ERROR_MESSAGES.PARENT_NAME_REQUIRED), 
  yeargroup: z.string().min(1, ERROR_MESSAGES.YEAR_GROUP_REQUIRED),
  school: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email(ERROR_MESSAGES.INVALID_EMAIL).optional().or(z.literal('')),
  classPreference: z.string().min(1, "Please select a class preference"),
  targetGrade: z.string().optional(),
  homework: z.string().optional(),
  travelArrangement: z.string().optional(),
  bookingOption: z.string().optional(),
  paymentPreference: z.string().optional(),
  goals: z.string().optional(),
  mathsSet: z.string().optional(),
  notes: z.string().optional(),
  promotionalConsent: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
});
