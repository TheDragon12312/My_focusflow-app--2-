import { supabase } from "@/integrations/supabase/client";

export class IntegrationsDebugger {
  async debugTableAccess() {
    try {
      console.log("=== DEBUGGING INTEGRATIONS TABLE ACCESS ===");

      // 1. Check if user is authenticated
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log("1. User check:", { user: user?.id, error: userError });

      if (!user) {
        console.log("❌ No authenticated user found");
        return;
      }

      // 2. Try to select from integrations table (read permission)
      console.log("2. Testing SELECT permission...");
      const { data: selectData, error: selectError } = await supabase
        .from("integrations")
        .select("*")
        .limit(1);

      console.log("Select result:", {
        data: selectData,
        error: selectError
          ? {
              message: selectError.message,
              details: selectError.details,
              hint: selectError.hint,
              code: selectError.code,
              status: selectError.status,
            }
          : null,
      });

      // 3. Try to select with user filter
      console.log("3. Testing SELECT with user filter...");
      const { data: userSelectData, error: userSelectError } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id);

      console.log("User select result:", {
        data: userSelectData,
        error: userSelectError
          ? {
              message: userSelectError.message,
              details: userSelectError.details,
              hint: userSelectError.hint,
              code: userSelectError.code,
              status: userSelectError.status,
            }
          : null,
      });

      // 4. Try to insert a test record
      console.log("4. Testing INSERT permission...");
      const testIntegration = {
        user_id: user.id,
        integration_type: "google_calendar",
        access_token: "test_token",
        is_active: true,
      };

      const { data: insertData, error: insertError } = await supabase
        .from("integrations")
        .insert([testIntegration])
        .select();

      console.log("Insert result:", {
        data: insertData,
        error: insertError
          ? {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              code: insertError.code,
              status: insertError.status,
            }
          : null,
      });

      // 5. If insert worked, clean up
      if (insertData && insertData.length > 0) {
        console.log("5. Cleaning up test record...");
        const { error: deleteError } = await supabase
          .from("integrations")
          .delete()
          .eq("id", insertData[0].id);

        console.log("Delete result:", {
          error: deleteError
            ? {
                message: deleteError.message,
                details: deleteError.details,
                hint: deleteError.hint,
                code: deleteError.code,
                status: deleteError.status,
              }
            : null,
        });
      }

      console.log("=== DEBUG COMPLETE ===");
    } catch (error) {
      console.error("Debug script error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
    }
  }

  async debugUserProfile() {
    try {
      console.log("=== DEBUGGING USER PROFILE ===");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      console.log("Auth user:", user);

      if (user) {
        // Check if there's a profiles record
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("Profile record:", { data: profile, error: profileError });
      }
    } catch (error) {
      console.error("Profile debug error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
    }
  }
}

export const integrationsDebugger = new IntegrationsDebugger();

// Make it available globally for debugging
(window as any).integrationsDebugger = integrationsDebugger;
