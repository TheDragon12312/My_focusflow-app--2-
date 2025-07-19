import React from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { PlanFeatures, PlanType } from "@/lib/subscription-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, Zap, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionGuardProps {
  feature?: keyof PlanFeatures;
  requiredPlan?: PlanType;
  requiresAdmin?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  upgradeMessage?: string;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  feature,
  requiredPlan,
  requiresAdmin = false,
  children,
  fallback,
  showUpgrade = true,
  upgradeMessage,
}) => {
  const { profile, hasAccessTo, isAdmin, isLoading, requestUpgrade } =
    useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Checking access...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please log in to access this feature.</p>
        <Button onClick={() => navigate("/auth")} className="mt-4">
          Log In
        </Button>
      </div>
    );
  }

  // Check admin requirement
  if (requiresAdmin && !isAdmin) {
    return (
      fallback || (
        <Card className="max-w-md mx-auto shadow-lg border-orange-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              This feature requires administrator privileges.
            </p>
          </CardContent>
        </Card>
      )
    );
  }

  // Check feature access
  if (feature && !hasAccessTo(feature)) {
    const shouldShowUpgrade = showUpgrade && profile.plan !== "team";

    return (
      fallback || (
        <FeatureUpgradeCard
          feature={feature}
          currentPlan={profile.plan}
          showUpgrade={shouldShowUpgrade}
          upgradeMessage={upgradeMessage}
          onUpgrade={() => {
            const upgradeUrl = requestUpgrade("pro");
            navigate(upgradeUrl);
          }}
        />
      )
    );
  }

  // Check required plan
  if (requiredPlan) {
    const planHierarchy: Record<PlanType, number> = {
      free: 0,
      pro: 1,
      team: 2,
    };
    const userPlanLevel = planHierarchy[profile.plan];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      const shouldShowUpgrade = showUpgrade;

      return (
        fallback || (
          <PlanUpgradeCard
            requiredPlan={requiredPlan}
            currentPlan={profile.plan}
            showUpgrade={shouldShowUpgrade}
            upgradeMessage={upgradeMessage}
            onUpgrade={() => {
              const upgradeUrl = requestUpgrade(requiredPlan);
              navigate(upgradeUrl);
            }}
          />
        )
      );
    }
  }

  // User has access, render children
  return <>{children}</>;
};

interface FeatureUpgradeCardProps {
  feature: keyof PlanFeatures;
  currentPlan: PlanType;
  showUpgrade: boolean;
  upgradeMessage?: string;
  onUpgrade: () => void;
}

const FeatureUpgradeCard: React.FC<FeatureUpgradeCardProps> = ({
  feature,
  currentPlan,
  showUpgrade,
  upgradeMessage,
  onUpgrade,
}) => {
  const featureNames: Record<keyof PlanFeatures, string> = {
    maxFocusSessionsPerDay: "Unlimited Focus Sessions",
    hasAICoach: "AI Productivity Coach",
    hasAdvancedStats: "Advanced Statistics",
    hasCalendarIntegration: "Calendar Integration",
    hasDistractionBlocking: "Distraction Blocking",
    hasTeamCollaboration: "Team Collaboration",
    hasSharedStats: "Shared Statistics",
    hasAdminDashboard: "Admin Dashboard",
    hasSSOIntegration: "SSO Integration",
    supportType: "Priority Support",
  };

  const featureIcons: Record<keyof PlanFeatures, React.ReactNode> = {
    maxFocusSessionsPerDay: <Zap className="h-8 w-8 text-blue-600" />,
    hasAICoach: <Star className="h-8 w-8 text-purple-600" />,
    hasAdvancedStats: <Star className="h-8 w-8 text-green-600" />,
    hasCalendarIntegration: <Star className="h-8 w-8 text-blue-600" />,
    hasDistractionBlocking: <Shield className="h-8 w-8 text-red-600" />,
    hasTeamCollaboration: <Users className="h-8 w-8 text-indigo-600" />,
    hasSharedStats: <Users className="h-8 w-8 text-green-600" />,
    hasAdminDashboard: <Shield className="h-8 w-8 text-purple-600" />,
    hasSSOIntegration: <Shield className="h-8 w-8 text-blue-600" />,
    supportType: <Star className="h-8 w-8 text-orange-600" />,
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg border-blue-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {featureIcons[feature] || <Lock className="h-8 w-8 text-blue-600" />}
        </div>
        <CardTitle className="text-blue-800">
          {featureNames[feature] || "Premium Feature"}
        </CardTitle>
        <Badge variant="outline" className="mx-auto">
          {currentPlan.toUpperCase()} PLAN
        </Badge>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-4">
          {upgradeMessage || `This feature is available in Pro and Team plans.`}
        </p>
        {showUpgrade && (
          <Button onClick={onUpgrade} className="w-full">
            <Star className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface PlanUpgradeCardProps {
  requiredPlan: PlanType;
  currentPlan: PlanType;
  showUpgrade: boolean;
  upgradeMessage?: string;
  onUpgrade: () => void;
}

const PlanUpgradeCard: React.FC<PlanUpgradeCardProps> = ({
  requiredPlan,
  currentPlan,
  showUpgrade,
  upgradeMessage,
  onUpgrade,
}) => {
  const planNames: Record<PlanType, string> = {
    free: "Free",
    pro: "Pro",
    team: "Team",
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg border-purple-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-purple-800">
          {planNames[requiredPlan]} Plan Required
        </CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline">{currentPlan.toUpperCase()}</Badge>
          <span>→</span>
          <Badge className="bg-purple-100 text-purple-800">
            {requiredPlan.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-4">
          {upgradeMessage ||
            `This feature requires the ${planNames[requiredPlan]} plan.`}
        </p>
        {showUpgrade && (
          <Button onClick={onUpgrade} className="w-full">
            <Star className="h-4 w-4 mr-2" />
            Upgrade to {planNames[requiredPlan]}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionGuard;
