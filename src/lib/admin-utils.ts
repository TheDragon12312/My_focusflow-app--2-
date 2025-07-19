import { supabase } from "@/integrations/supabase/client";

/**
 * Promotes a user to admin by email
 * This function can be called from code or browser console
 *
 * @param email - The email of the user to promote to admin
 * @returns Promise<{ success: boolean; message: string; user?: any }>
 */
export const addAdmin = async (
  email: string,
): Promise<{
  success: boolean;
  message: string;
  user?: any;
}> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    // Check if current user is admin (for authorization)
    const { data: currentUser } = await supabase.auth.getUser();
    if (currentUser.user) {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUser.user.id)
        .single();

      if (!currentProfile?.is_admin) {
        return {
          success: false,
          message: "Only admins can promote other users to admin",
        };
      }
    }

    // Find user by email and update admin status
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("email", email)
      .select("id, email, full_name, is_admin")
      .single();

    if (error) {
      console.error("Error promoting user to admin:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status: error.status,
        fullError: error,
      });

      if (error.code === "PGRST116") {
        return {
          success: false,
          message: `No user found with email: ${email}`,
        };
      }

      return {
        success: false,
        message: `Failed to promote user: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Successfully promoted ${email} to admin`,
      user: updatedProfile,
    };
  } catch (error: any) {
    console.error("Unexpected error in addAdmin:", {
      message: error.message || "Unknown error",
      stack: error.stack,
      fullError: error,
    });
    return {
      success: false,
      message: `Unexpected error: ${error.message || "Unknown error"}`,
    };
  }
};

/**
 * Removes admin privileges from a user by email
 *
 * @param email - The email of the user to demote from admin
 * @returns Promise<{ success: boolean; message: string; user?: any }>
 */
export const removeAdmin = async (
  email: string,
): Promise<{
  success: boolean;
  message: string;
  user?: any;
}> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    // Prevent removing admin from the primary admin
    if (email === "djuliusvdijk@protonmail.com") {
      return {
        success: false,
        message:
          "Cannot remove admin privileges from the primary administrator",
      };
    }

    // Check if current user is admin (for authorization)
    const { data: currentUser } = await supabase.auth.getUser();
    if (currentUser.user) {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUser.user.id)
        .single();

      if (!currentProfile?.is_admin) {
        return {
          success: false,
          message: "Only admins can remove admin privileges from other users",
        };
      }
    }

    // Find user by email and remove admin status
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({ is_admin: false })
      .eq("email", email)
      .select("id, email, full_name, is_admin")
      .single();

    if (error) {
      console.error("Error removing admin from user:", error);

      if (error.code === "PGRST116") {
        return {
          success: false,
          message: `No user found with email: ${email}`,
        };
      }

      return {
        success: false,
        message: `Failed to remove admin: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Successfully removed admin privileges from ${email}`,
      user: updatedProfile,
    };
  } catch (error: any) {
    console.error("Unexpected error in removeAdmin:", error);
    return {
      success: false,
      message: `Unexpected error: ${error.message || "Unknown error"}`,
    };
  }
};

/**
 * Lists all admin users
 *
 * @returns Promise<{ success: boolean; message: string; admins?: any[] }>
 */
export const listAdmins = async (): Promise<{
  success: boolean;
  message: string;
  admins?: any[];
}> => {
  try {
    const { data: admins, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, is_admin, created_at")
      .eq("is_admin", true)
      .order("created_at");

    if (error) {
      console.error("Error fetching admin users:", error);
      return {
        success: false,
        message: `Failed to fetch admins: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Found ${admins?.length || 0} admin users`,
      admins: admins || [],
    };
  } catch (error: any) {
    console.error("Unexpected error in listAdmins:", error);
    return {
      success: false,
      message: `Unexpected error: ${error.message || "Unknown error"}`,
    };
  }
};

/**
 * Check if a user is admin by email
 *
 * @param email - The email to check
 * @returns Promise<{ success: boolean; message: string; isAdmin?: boolean }>
 */
export const checkAdminStatus = async (
  email: string,
): Promise<{
  success: boolean;
  message: string;
  isAdmin?: boolean;
}> => {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          message: `No user found with email: ${email}`,
        };
      }

      return {
        success: false,
        message: `Failed to check admin status: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `${email} is ${profile.is_admin ? "an admin" : "not an admin"}`,
      isAdmin: profile.is_admin || false,
    };
  } catch (error: any) {
    console.error("Unexpected error in checkAdminStatus:", error);
    return {
      success: false,
      message: `Unexpected error: ${error.message || "Unknown error"}`,
    };
  }
};

// Make addAdmin available globally for console access
if (typeof window !== "undefined") {
  (window as any).addAdmin = addAdmin;
  (window as any).removeAdmin = removeAdmin;
  (window as any).listAdmins = listAdmins;
  (window as any).checkAdminStatus = checkAdminStatus;
}
