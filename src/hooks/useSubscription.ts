import { useState, useEffect, useCallback } from "react";
import {
  subscriptionService,
  UserProfile,
  PlanType,
  PlanFeatures,
} from "@/lib/subscription-service";
import { useAuth } from "@/contexts/AuthContext";

interface UseSubscriptionReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Role checks
  isProUser: boolean;
  isTeamUser: boolean;
  isAdmin: boolean;
  isPaidUser: boolean;

  // Feature access
  hasAccessTo: (feature: keyof PlanFeatures) => boolean;
  canCreateFocusSession: () => Promise<boolean>;

  // Plan management
  updatePlan: (plan: PlanType) => Promise<boolean>;
  requestUpgrade: (plan: PlanType) => string;

  // Admin functions
  addAdmin: (email: string) => Promise<boolean>;
  removeAdmin: (userId: string) => Promise<boolean>;
  getAllUsers: () => Promise<UserProfile[]>;

  // Feature limits
  getFeatureLimits: () => PlanFeatures;

  // Trial management
  startTrial: (durationDays?: number) => Promise<boolean>;
  isTrialExpired: () => Promise<boolean>;

  // Refresh profile data
  refresh: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userProfile = await subscriptionService.getUserProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Role checks
  const isProUser = subscriptionService.isProUser(profile);
  const isTeamUser = subscriptionService.isTeamUser(profile);
  const isAdmin = subscriptionService.isAdmin(profile);
  const isPaidUser = subscriptionService.isPaidUser(profile);

  // Feature access
  const hasAccessTo = useCallback(
    (feature: keyof PlanFeatures) => {
      return subscriptionService.hasAccessTo(feature, profile);
    },
    [profile],
  );

  const canCreateFocusSession = useCallback(async () => {
    return await subscriptionService.canCreateFocusSession(profile);
  }, [profile]);

  // Plan management
  const updatePlan = useCallback(
    async (plan: PlanType) => {
      if (!profile) return false;

      const success = await subscriptionService.updateUserPlan(
        profile.id,
        plan,
      );
      if (success) {
        await loadProfile(); // Refresh profile
      }
      return success;
    },
    [profile, loadProfile],
  );

  const requestUpgrade = useCallback((plan: PlanType) => {
    return subscriptionService.requestPlanUpgrade(plan);
  }, []);

  // Admin functions
  const addAdmin = useCallback(
    async (email: string) => {
      const success = await subscriptionService.addAdmin(email);
      if (success) {
        await loadProfile(); // Refresh profile
      }
      return success;
    },
    [loadProfile],
  );

  const removeAdmin = useCallback(
    async (userId: string) => {
      const success = await subscriptionService.removeAdmin(userId);
      if (success) {
        await loadProfile(); // Refresh profile
      }
      return success;
    },
    [loadProfile],
  );

  const getAllUsers = useCallback(async () => {
    return await subscriptionService.getAllUsers();
  }, []);

  // Feature limits
  const getFeatureLimits = useCallback(() => {
    return subscriptionService.getFeatureLimits(profile);
  }, [profile]);

  // Trial management
  const startTrial = useCallback(
    async (durationDays?: number) => {
      if (!profile) return false;

      const success = await subscriptionService.startTrial(
        profile.id,
        durationDays,
      );
      if (success) {
        await loadProfile(); // Refresh profile
      }
      return success;
    },
    [profile, loadProfile],
  );

  const isTrialExpired = useCallback(async () => {
    return await subscriptionService.isTrialExpired(profile);
  }, [profile]);

  const refresh = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,

    // Role checks
    isProUser,
    isTeamUser,
    isAdmin,
    isPaidUser,

    // Feature access
    hasAccessTo,
    canCreateFocusSession,

    // Plan management
    updatePlan,
    requestUpgrade,

    // Admin functions
    addAdmin,
    removeAdmin,
    getAllUsers,

    // Feature limits
    getFeatureLimits,

    // Trial management
    startTrial,
    isTrialExpired,

    // Refresh
    refresh,
  };
};

// Custom hooks for specific features
export const useFeatureAccess = (feature: keyof PlanFeatures) => {
  const { hasAccessTo, profile, isLoading } = useSubscription();
  return {
    hasAccess: hasAccessTo(feature),
    profile,
    isLoading,
  };
};

export const useAdminAccess = () => {
  const { isAdmin, profile, isLoading } = useSubscription();
  return {
    isAdmin,
    profile,
    isLoading,
  };
};

export const usePlanLimits = () => {
  const { getFeatureLimits, profile, isLoading } = useSubscription();
  return {
    limits: getFeatureLimits(),
    profile,
    isLoading,
  };
};
