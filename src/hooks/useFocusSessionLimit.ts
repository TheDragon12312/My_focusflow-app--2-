import { useState, useCallback } from "react";
import {
  hasReachedDailyFocusLimit,
  isFree,
  type User,
} from "@/lib/subscription";

export const useFocusSessionLimit = () => {
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const checkFocusSessionLimit = useCallback(
    async (user: User | null): Promise<boolean> => {
      if (!user || !isFree(user)) {
        return true; // Pro en Team gebruikers hebben geen limiet
      }

      const hasReachedLimit = await hasReachedDailyFocusLimit(user);

      if (hasReachedLimit) {
        setShowLimitPopup(true);
        return false; // Kan geen nieuwe sessie starten
      }

      return true; // Kan nieuwe sessie starten
    },
    [],
  );

  const closeLimitPopup = useCallback(() => {
    setShowLimitPopup(false);
  }, []);

  return {
    showLimitPopup,
    checkFocusSessionLimit,
    closeLimitPopup,
  };
};
