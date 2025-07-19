import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";
import {
  Session,
  User,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  isInitialized: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loginWithMicrosoft: async () => {},
  loginWithGitHub: async () => {},
  loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const handleUserProfile = async (user: User) => {
  try {
    if (!user?.id) {
      console.error("User ID is missing");
      return;
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profile:", profileError);
      return;
    }

    if (existingProfile) {
      console.log("Existing profile:", existingProfile);
      return;
    }

    const email = user.email || "example@email.com";
    const username = email.split("@")[0];

    const { data, error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name || username,
      avatar_url: user.user_metadata.avatar_url,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Could not create user profile:", error);
      toast.error("Could not create user profile. Please try again.");
    } else {
      console.log("User profile created successfully!", data);
      toast.success("Welcome to FocusFlow! 🎉");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log("Auth event:", event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Send verification email on signup - checking for SIGNED_UP event
        if (event === 'SIGNED_UP' as AuthChangeEvent && session?.user?.email) {
          try {
            const redirectUrl = `${window.location.origin}/dashboard`;
            await supabase.functions.invoke('send-verification-email', {
              body: {
                email: session.user.email,
                confirmationUrl: `https://cwgnlsrqnyugloobrsxz.supabase.co/auth/v1/verify?token=${session.access_token}&type=signup&redirect_to=${redirectUrl}`
              }
            });
            console.log("Verification email sent successfully");
          } catch (error) {
            console.error("Failed to send verification email:", error);
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    } else {
      throw error;
    }
  };

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with Google');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithMicrosoft = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isLoading: loading,
    isInitialized: !loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithGitHub,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        isInitialized: !loading,
        login,
        signup,
        logout,
        loginWithMicrosoft,
        loginWithGitHub,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
