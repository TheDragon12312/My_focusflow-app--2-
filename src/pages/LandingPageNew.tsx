import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Target,
  Clock,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  Play,
  Smartphone,
  Globe,
  Users,
  TrendingUp,
  Star,
  Award,
  Timer,
  Eye,
  MessageCircle,
  Mail,
  ChevronRight,
  Download,
  Monitor,
  Wifi,
  Lock,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [liveStats, setLiveStats] = useState({
    activeUsers: 12847,
    sessionsToday: 45623,
    avgProductivity: 87,
  });

  // Live stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 5),
        avgProductivity: Math.min(
          99,
          prev.avgProductivity + (Math.random() > 0.7 ? 1 : 0),
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Slimme Focus Sessies",
      description:
        "AI-geoptimaliseerde focusblokken die zich aanpassen aan jouw ritme",
      details: [
        "Personalized Pomodoro timing",
        "Intelligente pauze suggesties",
        "Adaptieve moeilijkheidsgraden",
      ],
      highlight: "Nieuw: AI-optimalisatie",
      route: "/focus",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI Productiviteitscoach",
      description:
        "Real-time coaching en persoonlijke inzichten voor betere prestaties",
      details: [
        "Live productiviteitsanalyse",
        "Patroonherkenning en tips",
        "Motiverende coaching berichten",
      ],
      highlight: "Meest populair",
      route: "/dashboard",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Geavanceerde Analytics",
      description:
        "Diepgaande inzichten in je productiviteitspatronen en vooruitgang",
      details: [
        "Realtime productiviteitstracking",
        "Gedetailleerde rapportages",
        "Voorspellende analytics",
      ],
      route: "/statistics",
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      title: "Smart Calendar Sync",
      description:
        "Naadloze integratie met Google Calendar en Outlook voor optimale planning",
      details: [
        "Auto-sync met calendars",
        "Slimme meeting voorbereiding",
        "Conflictdetectie",
      ],
      route: "/calendar",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Afleidingsbeveiliging",
      description:
        "Proactieve bescherming tegen digitale afleidingen en tijdverspilling",
      details: ["Website blocking", "App beperkingen", "Afleidingsanalyse"],
      route: "/settings",
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Team Collaboration",
      description:
        "Verhoog de productiviteit van je hele team met gedeelde doelen",
      details: ["Team dashboards", "Gezamenlijke doelen", "Collaboratie tools"],
      route: "/team",
    },
  ];

  const pricing = [
    {
      id: "free",
      name: "Gratis",
      price: "€0",
      period: "/maand",
      description: "Perfect om te beginnen met focus",
      features: [
        "Tot 5 focus sessies per dag",
        "Basis statistieken",
        "Simpele timer",
        "Email ondersteuning",
      ],
      cta: "Gratis Beginnen",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "€9.99",
      period: "/maand",
      description: "Voor professionals die alles uit hun dag willen halen",
      features: [
        "Onbeperkte focus sessies",
        "AI Productiviteitscoach",
        "Geavanceerde analytics",
        "Calendar integratie",
        "Afleidingsbeveiliging",
        "Priority support",
        "Data export",
      ],
      cta: "Probeer 30 Dagen Gratis",
      popular: true,
    },
    {
      id: "team",
      name: "Team",
      price: "€19.99",
      period: "/maand per gebruiker",
      description: "Voor teams die samen productiever willen worden",
      features: [
        "Alles van Pro",
        "Team dashboards",
        "Collaboratie tools",
        "Admin panel",
        "Custom integraties",
        "Dedicated support",
        "SSO ondersteuning",
      ],
      cta: "Team Trial Starten",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FocusFlow
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Prijzen
              </a>
              <Button variant="ghost" onClick={() => navigate("/about")}>
                Over Ons
              </Button>
              <Button variant="ghost" onClick={() => navigate("/contact")}>
                Contact
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Inloggen
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Gratis Proberen
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  🚀 Nieuw: AI-Powered Productiviteit
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Focus. Flow.{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Flourish.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  De Nederlandse #1 productiviteitsapp die je helpt om dieper te
                  focussen, meer te bereiken, en minder gestrest te zijn. Met
                  AI-coaching.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
                  onClick={() => navigate("/auth")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start je eerste focus sessie
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById("demo");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Live Demo Bekijken
                </Button>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {liveStats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Actieve gebruikers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {liveStats.sessionsToday.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Sessies vandaag</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {liveStats.avgProductivity}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Gem. productiviteit
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Timer className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Deep Work Sessie</h3>
                        <p className="text-sm text-gray-500">25:00 focustijd</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Actief
                    </Badge>
                  </div>

                  <Progress value={65} className="h-2" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Productiviteit</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Afleidingen</span>
                      <span className="text-green-600 font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Voortgang</span>
                      <span className="font-medium">16:15 / 25:00</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          AI Coach Tip
                        </p>
                        <p className="text-sm text-blue-700">
                          Je bent in een goede flow! Nog 9 minuten vol
                          doorzetten.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">
              Krachtige Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alles wat je nodig hebt om te excelleren
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van AI-coaching tot team collaboratie - FocusFlow heeft alle tools
              om jouw productiviteit naar het volgende level te brengen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {feature.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {feature.highlight && (
                    <Badge className="mb-4 bg-blue-100 text-blue-700">
                      {feature.highlight}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(feature.route)}
                  >
                    Probeer {feature.title.split(" ")[0]}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">
              Simpele Prijzen
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Begin gratis, upgrade wanneer je klaar bent
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kies het plan dat het beste bij jou past. Alle plannen bevatten
              een 30-dagen geld-terug garantie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Meest Populair
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-6 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border border-gray-300 hover:border-gray-400"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate(`/checkout?plan=${plan.id}`)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om je beste werkdag ooit te hebben?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Sluit je aan bij duizenden professionals die al elke dag
            productiever worden met FocusFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8"
              onClick={() => navigate("/auth")}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Gratis Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate("/contact")}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Vragen? Neem Contact Op
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FocusFlow</span>
              </div>
              <p className="text-gray-300 mb-4">
                De Nederlandse #1 productiviteitsapp voor professionals en
                teams. Van Amsterdam naar de wereld.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/dashboard")}
                >
                  Features
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/calendar")}
                >
                  Integraties
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/roadmap")}
                >
                  Roadmap
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Ondersteuning</h3>
              <ul className="space-y-3 text-gray-400">
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/help")}
                >
                  Help Center
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </li>
                <li
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => navigate("/community")}
                >
                  Community
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">
                  Privacy
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Terms
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Security
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; 2025 FocusFlow. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">
                Made with ❤️ in Amsterdam
              </span>
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-400"
              >
                🇳🇱 Dutch Made
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
