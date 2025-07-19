/**
 * Subscription System Usage Examples
 *
 * This file demonstrates how to use the subscription utilities
 * You can import and use these functions in your components
 */

import {
  isFree,
  isPro,
  isTeam,
  isAdmin,
  hasAccessTo,
  getUserPlanInfo,
  getUpgradeMessage,
  addAdmin,
  type User,
} from "@/lib/subscription";
import { supabase } from "@/integrations/supabase/client";

// Example: Check user plan and features
export const exampleUsage = async () => {
  // Get current user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Get user profile from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return;

  // Now you can use all the utility functions
  console.log("=== User Plan Information ===");
  console.log("Is Free user:", isFree(profile));
  console.log("Is Pro user:", isPro(profile));
  console.log("Is Team user:", isTeam(profile));
  console.log("Is Admin:", isAdmin(profile));

  console.log("\n=== Feature Access ===");
  console.log("Has AI Coach:", hasAccessTo("ai_productivity_coach", profile));
  console.log(
    "Has Calendar Integration:",
    hasAccessTo("calendar_integration", profile),
  );
  console.log(
    "Has Team Collaboration:",
    hasAccessTo("team_collaboration", profile),
  );
  console.log("Has Admin Dashboard:", hasAccessTo("admin_dashboard", profile));

  console.log("\n=== Plan Information ===");
  const planInfo = getUserPlanInfo(profile);
  console.log("Plan Details:", planInfo);

  console.log("\n=== Upgrade Messages ===");
  if (!hasAccessTo("ai_productivity_coach", profile)) {
    console.log(
      "AI Coach upgrade message:",
      getUpgradeMessage("ai_productivity_coach"),
    );
  }
};

// Example: Admin functions (only work if you're an admin)
export const adminExamples = async () => {
  console.log("=== Admin Functions ===");

  // Promote user to admin
  const result = await addAdmin("user@example.com");
  console.log("Add admin result:", result);
};

// Example: Component usage patterns
export const ComponentExamples = {
  // In a React component, you might use it like this:
  /*
  import { hasAccessTo, isAdmin } from '@/lib/subscription';
  import { useAuth } from '@/contexts/AuthContext';

  const MyComponent = () => {
    const { user } = useAuth(); // Assuming you have auth context
    const [profile, setProfile] = useState(null);

    useEffect(() => {
      // Load user profile
      const loadProfile = async () => {
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(data);
        }
      };
      loadProfile();
    }, [user]);

    return (
      <div>
        {hasAccessTo('ai_productivity_coach', profile) ? (
          <AICoachButton />
        ) : (
          <UpgradeButton feature="ai_productivity_coach" />
        )}
        
        {isAdmin(profile) && (
          <AdminPanel />
        )}
      </div>
    );
  };
  */
};

// Global functions available in browser console
if (typeof window !== "undefined") {
  (window as any).subscriptionDemo = exampleUsage;
  (window as any).adminDemo = adminExamples;
}
