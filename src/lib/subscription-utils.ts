import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type UserPlan = "free" | "pro" | "team";
export type User = Tables<"profiles"> & {
  plan?: UserPlan;
  is_admin?: boolean;
};

// Plan checking utilities
export const isFree = (user: User | null): boolean => {
  if (!user) return true;
  return user.plan === "free" || !user.plan;
};

export const isPro = (user: User | null): boolean => {
  if (!user) return false;
  return user.plan === "pro";
};

export const isTeam = (user: User | null): boolean => {
  if (!user) return false;
  return user.plan === "team";
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.is_admin === true;
};

// Feature access control
type FeatureName =
  | "unlimited_focus_sessions"
  | "ai_productivity_coach"
  | "advanced_analytics"
  | "calendar_integration"
  | "distraction_blocking"
  | "priority_support"
  | "team_collaboration"
  | "shared_analytics"
  | "admin_dashboard"
  | "sso_integration"
  | "dedicated_support";

const FEATURE_MATRIX: Record<UserPlan, FeatureName[]> = {
  free: [],
  pro: [
    "unlimited_focus_sessions",
    "ai_productivity_coach",
    "advanced_analytics",
    "calendar_integration",
    "distraction_blocking",
    "priority_support",
  ],
  team: [
    "unlimited_focus_sessions",
    "ai_productivity_coach",
    "advanced_analytics",
    "calendar_integration",
    "distraction_blocking",
    "priority_support",
    "team_collaboration",
    "shared_analytics",
    "admin_dashboard",
    "sso_integration",
    "dedicated_support",
  ],
};

export const hasAccessTo = (
  featureName: FeatureName,
  user: User | null,
): boolean => {
  if (!user) return false;

  // Admins have access to all features
  if (isAdmin(user)) return true;

  const userPlan = user.plan || "free";
  return FEATURE_MATRIX[userPlan].includes(featureName);
};

// Daily limits for free users
export const FREE_PLAN_LIMITS = {
  FOCUS_SESSIONS_PER_DAY: 5,
} as const;

// Check if user has reached daily focus session limit
export const hasReachedDailyFocusLimit = async (
  user: User | null,
): Promise<boolean> => {
  if (!user || !isFree(user)) return false;

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("focus_blocks")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lt("created_at", `${today}T23:59:59.999Z`);

  if (error) {
    console.error("Error checking daily focus limit:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      status: error.status,
      fullError: error,
    });
    return false;
  }

  return (data?.length || 0) >= FREE_PLAN_LIMITS.FOCUS_SESSIONS_PER_DAY;
};

// Get user's current plan information
export const getUserPlanInfo = (user: User | null) => {
  if (!user) {
    return {
      plan: "free" as UserPlan,
      planDisplayName: "Gratis",
      isAdmin: false,
      features: [],
    };
  }

  const plan = user.plan || "free";
  const planDisplayNames = {
    free: "Gratis",
    pro: "Pro",
    team: "Team",
  };

  return {
    plan,
    planDisplayName: planDisplayNames[plan],
    isAdmin: isAdmin(user),
    features: FEATURE_MATRIX[plan],
  };
};

// Utility to get plan upgrade suggestions
export const getUpgradeMessage = (featureName: FeatureName): string => {
  const proFeatures = FEATURE_MATRIX.pro;
  const teamFeatures = FEATURE_MATRIX.team;

  if (proFeatures.includes(featureName)) {
    return "Deze functie is beschikbaar met het Pro-plan. Upgrade voor onbeperkte focus-sessies, AI-coach en meer!";
  }

  if (teamFeatures.includes(featureName)) {
    return "Deze functie is beschikbaar met het Team-plan. Upgrade voor team samenwerking, gedeelde statistieken en toegewijde ondersteuning!";
  }

  return "Deze functie vereist een betaald plan. Upgrade voor geavanceerde productiviteitsfuncties!";
};

// Specifiek bericht voor dagelijkse limiet van gratis plan
export const getDailyLimitMessage = (): string => {
  return "Je hebt het maximum van 5 focus-sessies vandaag bereikt voor het gratis plan. Upgrade naar Pro voor onbeperkte sessies en extra functies.";
};
