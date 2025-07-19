import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Target,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Chrome, // Use Chrome as Google icon alternative
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, user, loginWithGitHub, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Pre-fill email from landing page if provided
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setIsLogin(false); // Assume they want to sign up
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess("Welkom terug! Je wordt doorgestuurd...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        if (password !== confirmPassword) {
          setError("Wachtwoorden komen niet overeen");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Wachtwoord moet minimaal 6 karakters lang zijn");
          setIsLoading(false);
          return;
        }

        await signup(email, password);
        setSuccess("Account aangemaakt! Welkom bij FocusFlow!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err: any) {
      setError(err.message || "Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Instant productiviteitsboost",
      description: "Start direct met focussessies",
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "AI-gedreven inzichten",
      description: "Personalized coaching vanaf dag 1",
    },
    {
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: "100% veilig & privé",
      description: "Je data blijft altijd van jou",
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Setup in 30 seconden",
      description: "Begin direct met focussen",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FocusFlow
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Terug naar home</span>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {isLogin ? "Welkom terug!" : "Start je focus journey"}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {isLogin
                      ? "Log in om door te gaan met je productiviteitsreis"
                      : "Maak je gratis account aan en word 40% productiever"}
                  </CardDescription>
                </div>

                {!isLogin && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    🎉 30 dagen gratis trial - geen creditcard nodig
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSignIn("google")}
                    disabled={isLoading}
                  >
                    <Chrome className="h-5 w-5" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleSignIn("github")}
                    disabled={isLoading}
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Of ga door met email
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mailadres</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="je@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isLogin ? "Je wachtwoord" : "Minimaal 6 karakters"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Bevestig wachtwoord
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Herhaal je wachtwoord"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600"
                        >
                          Onthoud mij
                        </Label>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-blue-600"
                      >
                        Wachtwoord vergeten?
                      </Button>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? "Inloggen..." : "Account aanmaken..."}
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        {isLogin ? "Inloggen" : "Gratis Account Maken"}
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <span className="text-gray-600">
                    {isLogin ? "Nog geen account?" : "Heb je al een account?"}
                  </span>{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-blue-600"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    {isLogin ? "Maak er een aan" : "Log in"}
                  </Button>
                </div>

                {!isLogin && (
                  <p className="text-xs text-gray-500 text-center">
                    Door je account aan te maken ga je akkoord met onze{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Voorwaarden
                    </a>{" "}
                    en{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacybeleid
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Benefits */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Waarom 10.000+ professionals kiezen voor FocusFlow?
              </h2>
              <p className="text-lg text-gray-600">
                Join de revolutie in productiviteit en ervaar het verschil
                binnen één week.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-md p-4 bg-white/60 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">47%</div>
                <p className="text-sm text-gray-700 mb-4">
                  Gemiddelde productiviteitsverbetering in de eerste week
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Geen setup tijd</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Direct resultaat</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Vertrouwd door teams bij:
                </p>
                <div className="flex items-center justify-center space-x-6 opacity-60">
                  <span className="font-semibold">Spotify</span>
                  <span className="font-semibold">Adyen</span>
                  <span className="font-semibold">Mollie</span>
                  <span className="font-semibold">Booking.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
