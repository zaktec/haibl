export const ERROR_MESSAGES = {
  LEARNER_NAME_REQUIRED: "Learner name is required",
  PARENT_NAME_REQUIRED: "Parent name is required", 
  YEAR_GROUP_REQUIRED: "Year group is required",
  INVALID_EMAIL: "Invalid email address",
  VALIDATION_FAILED: "Validation failed",
  MAIL_CREDENTIALS_NOT_CONFIGURED: "Mail credentials not configured",
  FAILED_TO_SEND_EMAIL: "Failed to send email",
  UNKNOWN_ERROR: "Unknown error",
  // Zod specific errors
  ZOD_REQUIRED: "This field is required",
  ZOD_INVALID_TYPE: "Invalid type provided",
  ZOD_TOO_SMALL: "Value is too small",
  ZOD_TOO_BIG: "Value is too big",
  ZOD_INVALID_STRING: "Invalid string format"
} as const;