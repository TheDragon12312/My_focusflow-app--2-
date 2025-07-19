import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FocusLimitPopup } from "@/components/FocusLimitPopup";
import { useFocusSessionLimit } from "@/hooks/useFocusSessionLimit";
import {
  isFree,
  isPro,
  isTeam,
  isAdmin,
  getUserPlanInfo,
  type User,
} from "@/lib/subscription";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const FocusSessionStarter: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showLimitPopup, checkFocusSessionLimit, closeLimitPopup } =
    useFocusSessionLimit();

  // Laad gebruikersprofiel
  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        setProfile(data);
      } catch (error) {
        console.error("Fout bij laden profiel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [authUser]);

  const handleStartSession = async () => {
    if (!profile) return;

    const canStart = await checkFocusSessionLimit(profile);

    if (canStart) {
      // Hier zou je de focus sessie starten
      console.log("Focus sessie gestart!");

      // Voorbeeld: voeg een nieuwe focus block toe aan de database
      const { error } = await supabase.from("focus_blocks").insert({
        user_id: profile.id,
        duration: 25, // 25 minuten
        block_type: "focus",
        status: "active",
      });

      if (error) {
        console.error("Fout bij starten focus sessie:", error);
      }
    }
    // Als canStart false is, wordt automatisch de popup getoond
  };

  if (isLoading) {
    return <div>Laden...</div>;
  }

  if (!profile) {
    return <div>Niet ingelogd</div>;
  }

  const planInfo = getUserPlanInfo(profile);

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Focus Sessie</h2>

        <div className="mb-4 text-sm text-gray-600">
          <p>
            <strong>Plan:</strong> {planInfo.planDisplayName}
          </p>
          <p>
            <strong>Status:</strong>
            {isFree(profile) && " Gratis (max 5 sessies per dag)"}
            {isPro(profile) && " Pro (onbeperkte sessies)"}
            {isTeam(profile) && " Team (onbeperkte sessies)"}
            {isAdmin(profile) && " + Admin toegang"}
          </p>
        </div>

        <Button onClick={handleStartSession} className="w-full" size="lg">
          Start Focus Sessie (25 min)
        </Button>
      </div>

      <FocusLimitPopup isOpen={showLimitPopup} onClose={closeLimitPopup} />
    </div>
  );
};
