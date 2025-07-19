export type UserProfile = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: "github" | "microsoft";
};

class OAuthServiceClass {
  private readonly STORAGE_PREFIX = "oauth_";

  // GitHub OAuth methods
  async authenticateGitHub(): Promise<UserProfile | null> {
    try {
      // Simulate OAuth flow - in a real app, this would use GitHub's OAuth API
      const mockProfile: UserProfile = {
        id: "github_" + Date.now(),
        email: "user@github.com",
        name: "GitHub User",
        picture: "https://via.placeholder.com/150",
        provider: "github",
      };

      // Store the profile
      this.storeProfile(mockProfile);
      return mockProfile;
    } catch (error) {
      console.error("GitHub authentication failed:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return null;
    }
  }

  // Microsoft OAuth methods
  async authenticateMicrosoft(): Promise<UserProfile | null> {
    try {
      const mockProfile: UserProfile = {
        id: "microsoft_" + Date.now(),
        email: "user@outlook.com",
        name: "Microsoft User",
        picture: "https://via.placeholder.com/150",
        provider: "microsoft",
      };

      this.storeProfile(mockProfile);
      return mockProfile;
    } catch (error) {
      console.error("Microsoft authentication failed:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return null;
    }
  }

  // Store profile in localStorage
  storeProfile(profile: UserProfile): void {
    const key = `${this.STORAGE_PREFIX}${profile.provider}_profile`;
    localStorage.setItem(key, JSON.stringify(profile));
    localStorage.setItem(
      `${this.STORAGE_PREFIX}${profile.provider}_connected`,
      "true",
    );
  }

  // Get stored profile
  getStoredProfile(provider: "github" | "microsoft"): UserProfile | null {
    try {
      const key = `${this.STORAGE_PREFIX}${provider}_profile`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Check if provider is connected
  isProviderConnected(provider: "github" | "microsoft"): boolean {
    const key = `${this.STORAGE_PREFIX}${provider}_connected`;
    return localStorage.getItem(key) === "true";
  }

  // Disconnect provider
  disconnectProvider(provider: "github" | "microsoft"): void {
    const profileKey = `${this.STORAGE_PREFIX}${provider}_profile`;
    const connectedKey = `${this.STORAGE_PREFIX}${provider}_connected`;

    localStorage.removeItem(profileKey);
    localStorage.removeItem(connectedKey);
  }

  // Clear all OAuth data
  clearAll(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const OAuthService = new OAuthServiceClass();
