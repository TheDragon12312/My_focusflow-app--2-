/**
 * Utility for proper error logging to prevent [object Object] display
 * Use this instead of console.error(message, error) directly
 */

export interface ErrorInfo {
  message: string;
  details?: any;
  hint?: string;
  code?: string;
  status?: number;
  stack?: string;
  fullError: any;
}

/**
 * Formats error for proper console logging
 * @param error - The error object to format
 * @returns Formatted error info object
 */
export const formatError = (error: any): ErrorInfo => {
  if (!error) {
    return {
      message: "Unknown error occurred",
      fullError: error,
    };
  }

  // If it's already a formatted error, return as is
  if (typeof error === "object" && error.message && error.fullError) {
    return error;
  }

  // Handle Supabase/PostgreSQL errors
  if (error.message && typeof error === "object") {
    return {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      status: error.status,
      stack: error.stack,
      fullError: error,
    };
  }

  // Handle Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      fullError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      fullError: error,
    };
  }

  // Handle any other type
  return {
    message: String(error),
    fullError: error,
  };
};

/**
 * Safe console.error that properly formats error objects
 * @param message - The error message
 * @param error - The error object to log
 */
export const logError = (message: string, error: any): void => {
  const formattedError = formatError(error);
  console.error(message, formattedError);
};

/**
 * Safe console.error for Supabase errors specifically
 * @param message - The error message
 * @param error - The Supabase error object
 */
export const logSupabaseError = (message: string, error: any): void => {
  if (!error) {
    console.error(message + ": Unknown error occurred");
    return;
  }

  // Extract error information safely
  const errorMessage = error?.message || "Unknown Supabase error";
  const errorCode = error?.code || "No code";
  const errorDetails = error?.details || "No details";
  const errorHint = error?.hint || "No hint";
  const errorStatus = error?.status || "No status";

  // Log as separate lines to avoid [object Object] issues
  console.group(message);
  console.error("Message:", errorMessage);
  console.error("Code:", errorCode);
  console.error("Details:", errorDetails);
  console.error("Hint:", errorHint);
  console.error("Status:", errorStatus);

  // Log stack trace if available
  if (error?.stack) {
    console.error("Stack:", error.stack);
  }

  // Log the raw error for debugging
  console.error("Raw error:", JSON.stringify(error, null, 2));
  console.groupEnd();
};
