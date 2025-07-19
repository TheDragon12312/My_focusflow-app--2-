import {
  hasReachedDailyFocusLimit,
  isFree,
  type User,
} from "@/lib/subscription";

/**
 * Controleer of een gebruiker een nieuwe focus sessie kan starten
 * Voor gratis gebruikers: max 5 per dag
 * Voor Pro/Team: onbeperkt
 *
 * @param user - De gebruiker om te controleren
 * @returns Promise<{ canStart: boolean; needsUpgrade: boolean }>
 */
export const canStartFocusSession = async (
  user: User | null,
): Promise<{
  canStart: boolean;
  needsUpgrade: boolean;
}> => {
  if (!user) {
    return { canStart: false, needsUpgrade: false };
  }

  // Pro en Team gebruikers hebben geen limiet
  if (!isFree(user)) {
    return { canStart: true, needsUpgrade: false };
  }

  // Controleer dagelijkse limiet voor gratis gebruikers
  const hasReachedLimit = await hasReachedDailyFocusLimit(user);

  return {
    canStart: !hasReachedLimit,
    needsUpgrade: hasReachedLimit,
  };
};

/**
 * Eenvoudige functie om focus sessie limiet te controleren
 * Toont automatisch een alert als de limiet is bereikt
 *
 * @param user - De gebruiker om te controleren
 * @returns Promise<boolean> - true als sessie kan starten
 */
export const checkAndStartFocusSession = async (
  user: User | null,
): Promise<boolean> => {
  const { canStart, needsUpgrade } = await canStartFocusSession(user);

  if (needsUpgrade) {
    // Toon browser alert (je kunt dit vervangen door je eigen popup component)
    const upgrade = confirm(
      "Je hebt het maximum van 5 focus-sessies vandaag bereikt voor het gratis plan. " +
        "Upgrade naar Pro voor onbeperkte sessies en extra functies.\n\n" +
        "Wil je nu upgraden?",
    );

    if (upgrade) {
      window.location.href = "/upgrade";
    }

    return false;
  }

  return canStart;
};
