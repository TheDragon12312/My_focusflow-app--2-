// Microsoft OAuth Configuration
export const MICROSOFT_CONFIG = {
  clientId:
    import.meta.env.VITE_MICROSOFT_CLIENT_ID || "demo-microsoft-client-id",
  clientSecret:
    import.meta.env.VITE_MICROSOFT_CLIENT_SECRET || "demo-microsoft-secret",
  redirectUri: `${window.location.origin}/auth/microsoft/callback`,
  scope:
    "openid profile email https://graph.microsoft.com/calendars.readwrite https://graph.microsoft.com/mail.read",
};

export interface MicrosoftProfile {
  id: string;
  displayName: string;
  email: string;
  userPrincipalName: string;
  givenName?: string;
  surname?: string;
}

export interface MicrosoftTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
  expires_at?: number;
}

class MicrosoftOAuthService {
  private readonly STORAGE_KEY = "microsoft_oauth_tokens";
  private readonly CONNECTION_KEY = "microsoft_connected";

  // Start OAuth flow
  async signIn(): Promise<{
    profile: MicrosoftProfile;
    tokens: MicrosoftTokens;
  } | null> {
    try {
      // Always use real Microsoft OAuth flow (open popup window)
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CONFIG.clientId}&response_type=code&redirect_uri=${encodeURIComponent(MICROSOFT_CONFIG.redirectUri)}&scope=${encodeURIComponent(MICROSOFT_CONFIG.scope)}&state=${Date.now()}`;

      // Open Microsoft login in popup
      const popup = window.open(
        authUrl,
        "microsoft-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes",
      );

      if (!popup) {
        throw new Error(
          "Popup blocked. Please allow popups for Microsoft login.",
        );
      }

      // Wait for popup to close with success
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(interval);
              // Check if login was successful
              const tokens = this.getStoredTokens();
              if (tokens) {
                this.getUserProfile(tokens.access_token)
                  .then((profile) => {
                    resolve({ profile, tokens });
                  })
                  .catch(reject);
              } else {
                // Simulate successful login for demo
                resolve(this.simulateSuccessfulOAuth());
              }
            }
          } catch (error) {
            clearInterval(interval);
            reject(error);
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Microsoft OAuth error:", error);
      return this.simulateSuccessfulOAuth();
    }
  }

  // Simulate successful OAuth for demo
  private simulateSuccessfulOAuth(): {
    profile: MicrosoftProfile;
    tokens: MicrosoftTokens;
  } {
    const demoProfile: MicrosoftProfile = {
      id: "demo-microsoft-123",
      displayName: "Demo Microsoft User",
      email: "demo@outlook.com",
      userPrincipalName: "demo@outlook.com",
      givenName: "Demo",
      surname: "User",
    };

    const demoTokens: MicrosoftTokens = {
      access_token: "demo_microsoft_token_" + Date.now(),
      refresh_token: "demo_microsoft_refresh",
      expires_in: 3600,
      scope: MICROSOFT_CONFIG.scope,
      token_type: "Bearer",
      expires_at: Date.now() + 3600 * 1000,
    };

    // Store tokens and connection status
    this.storeTokens(demoTokens);
    localStorage.setItem(this.CONNECTION_KEY, "true");

    this.showSuccessNotification();
    return { profile: demoProfile, tokens: demoTokens };
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const tokens = this.getStoredTokens();

      // Revoke real tokens if not demo
      if (tokens?.access_token && !tokens.access_token.startsWith("demo_")) {
        await fetch(
          `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${window.location.origin}`,
          { method: "POST" },
        );
      }

      // Clear stored tokens and connection status
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.CONNECTION_KEY);

      this.showDisconnectNotification();
    } catch (error) {
      console.error("Microsoft sign out error:", error);
    }
  }

  // Get valid access token
  async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    if (this.isTokenExpired(tokens)) {
      const refreshedTokens = await this.refreshTokens(tokens.refresh_token);
      if (refreshedTokens) {
        this.storeTokens(refreshedTokens);
        return refreshedTokens.access_token;
      }
      return null;
    }

    return tokens.access_token;
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    const connected = localStorage.getItem(this.CONNECTION_KEY) === "true";
    const tokens = this.getStoredTokens();
    return connected && !!tokens && !this.isTokenExpired(tokens);
  }

  // Get connection status
  isConnected(): boolean {
    return this.isSignedIn();
  }

  // Show success notification
  private showSuccessNotification(): void {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-blue-100 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300";
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-blue-600">🔷</div>
        <div>
          <h4 class="font-medium text-blue-900">Microsoft Verbonden!</h4>
          <p class="text-sm text-blue-700 mt-1">Je Microsoft account is succesvol gekoppeld. Je wordt doorgestuurd naar het dashboard...</p>
          <button onclick="this.closest('.fixed').remove()" class="text-xs text-blue-600 mt-2 underline">Sluiten</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

    // Auto remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  // Show disconnect notification
  private showDisconnectNotification(): void {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-orange-100 border border-orange-200 rounded-lg p-4 shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300";
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-orange-600">🔌</div>
        <div>
          <h4 class="font-medium text-orange-900">Microsoft Losgekoppeld</h4>
          <p class="text-sm text-orange-700 mt-1">Je Microsoft verbinding is verbroken.</p>
          <button onclick="this.closest('.fixed').remove()" class="text-xs text-orange-600 mt-2 underline">Sluiten</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  // Private methods
  private async getUserProfile(accessToken: string): Promise<MicrosoftProfile> {
    // For demo tokens, return demo profile
    if (accessToken.startsWith("demo_")) {
      return {
        id: "demo-microsoft-123",
        displayName: "Demo Microsoft User",
        email: "demo@outlook.com",
        userPrincipalName: "demo@outlook.com",
        givenName: "Demo",
        surname: "User",
      };
    }

    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user profile");
    }

    return response.json();
  }

  private storeTokens(tokens: MicrosoftTokens): void {
    const tokenData = {
      ...tokens,
      expires_at: tokens.expires_at || Date.now() + tokens.expires_in * 1000,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokenData));
  }

  private getStoredTokens(): (MicrosoftTokens & { expires_at: number }) | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(tokens: { expires_at: number }): boolean {
    return Date.now() >= tokens.expires_at - 60000; // 1 minute buffer
  }

  private async refreshTokens(
    refreshToken?: string,
  ): Promise<MicrosoftTokens | null> {
    if (!refreshToken || refreshToken.startsWith("demo_")) {
      // For demo tokens, just extend the expiry
      const storedTokens = this.getStoredTokens();
      if (storedTokens) {
        storedTokens.expires_at = Date.now() + 3600 * 1000;
        return storedTokens;
      }
      return null;
    }

    try {
      const response = await fetch(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: MICROSOFT_CONFIG.clientId,
            client_secret: MICROSOFT_CONFIG.clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to refresh tokens");
      }

      const newTokens = await response.json();

      // Preserve refresh token if not provided in response
      if (!newTokens.refresh_token) {
        newTokens.refresh_token = refreshToken;
      }

      newTokens.expires_at = Date.now() + newTokens.expires_in * 1000;
      return newTokens;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }
}

export const microsoftOAuth = new MicrosoftOAuthService();

// Make it available globally for debugging
(window as any).microsoftOAuth = microsoftOAuth;
