import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';

export const usePremiumFeatures = () => {
  const { user } = useAuth();

  const checkFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user) return false;

    // Admin access for specified email
    if (user.email === 'djuliusvdijk@protonmail.com') {
      return true;
    }

    try {
      // Check subscription status from Supabase
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .single();

      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      // Feature access based on subscription tier
      const tierFeatures: Record<SubscriptionTier, string[]> = {
        free: ['basic_focus_tracking', 'calendar_view'],
        pro: [
          'basic_focus_tracking',
          'calendar_view',
          'ai_coach',
          'advanced_analytics',
          'google_calendar',
          'microsoft_calendar',
          'focus_recommendations'
        ],
        team: [
          'basic_focus_tracking',
          'calendar_view',
          'ai_coach',
          'advanced_analytics',
          'google_calendar',
          'microsoft_calendar',
          'focus_recommendations',
          'team_analytics',
          'shared_focus_sessions'
        ],
        enterprise: [
          'basic_focus_tracking',
          'calendar_view',
          'ai_coach',
          'advanced_analytics',
          'google_calendar',
          'microsoft_calendar',
          'focus_recommendations',
          'team_analytics',
          'shared_focus_sessions',
          'custom_integrations',
          'priority_support'
        ]
      };

      return tierFeatures[subscription.tier as SubscriptionTier].includes(featureKey);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const hasFeatureAccess = async (featureKey: string): Promise<boolean> => {
    // Cache results for 5 minutes
    const cacheKey = `feature_access_${user?.id}_${featureKey}`;
    const cachedResult = sessionStorage.getItem(cacheKey);
    
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const hasAccess = await checkFeatureAccess(featureKey);
    sessionStorage.setItem(cacheKey, JSON.stringify(hasAccess));
    setTimeout(() => sessionStorage.removeItem(cacheKey), 5 * 60 * 1000);
    
    return hasAccess;
  };

  return {
    hasFeatureAccess,
  };
};
