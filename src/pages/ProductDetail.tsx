import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  Shield,
  Clock,
  Play,
  Download,
  ExternalLink,
  Heart,
  MessageCircle,
  TrendingUp,
  Award,
} from "lucide-react";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Product data based on productId
  const productData = {
    starter: {
      title: "Starter Plan",
      subtitle: "Perfect voor individuele professionals",
      price: "€9,99",
      period: "/maand",
      description:
        "Begin je productiviteitsreis met essentiële focus tools en basis statistieken.",
      rating: 4.8,
      users: "10.000+",
      features: [
        "Onbeperkte focus sessies",
        "Basis statistieken & rapportage",
        "5 app integraties",
        "E-mail notificaties",
        "Mobiele app toegang",
        "Community support",
      ],
      detailedFeatures: {
        focus: [
          "Pomodoro timer met aanpasbare intervallen",
          "Korte en lange pauze modus",
          "Geluid en trilnotificaties",
          "Basis distraction blocking",
        ],
        analytics: [
          "Dagelijkse focus tijd tracking",
          "Wekelijkse productiviteitsrapport",
          "Basis distractie analyse",
          "Eenvoudige trends visualisatie",
        ],
        integrations: [
          "Google Calendar basis sync",
          "Email notifications",
          "Basic Slack integratie",
          "Export naar CSV",
          "5 app connecties totaal",
        ],
      },
      testimonials: [
        {
          name: "Sarah van der Berg",
          role: "Freelance Designer",
          content:
            "FocusFlow Starter heeft mijn productiviteit met 40% verbeterd. De interface is zo clean!",
          rating: 5,
        },
        {
          name: "Mark Janssen",
          role: "Student",
          content:
            "Perfect voor mijn studie. De Pomodoro timer werkt geweldig tijdens het leren.",
          rating: 5,
        },
      ],
    },
    pro: {
      title: "Pro Plan",
      subtitle: "Voor ambitieuze professionals en kleine teams",
      price: "€19,99",
      period: "/maand",
      description:
        "Unlock geavanceerde AI-coaching, uitgebreide integraties en team collaboration features.",
      rating: 4.9,
      users: "25.000+",
      features: [
        "Alles van Starter, plus:",
        "AI Productivity Coach",
        "Onbeperkte integraties",
        "Geavanceerde analytics",
        "Team collaboration (tot 10 leden)",
        "Priority support",
        "Aangepaste workflows",
        "API toegang",
      ],
      detailedFeatures: {
        ai: [
          "Persoonlijke AI productivity coach",
          "Slimme break timing suggesties",
          "Productiviteitspatroon analyse",
          "Gepersonaliseerde tips en tricks",
          "Automatische workflow optimalisatie",
        ],
        analytics: [
          "Geavanceerde productiviteitsmetrics",
          "Wekelijkse en maandelijkse trends",
          "Distractie heatmaps",
          "Goal tracking en achievements",
          "Export naar meerdere formaten",
        ],
        team: [
          "Team dashboard met realtime status",
          "Gedeelde focus sessies",
          "Team productiviteitsrapportage",
          "Member invitation management",
          "Role-based permissions",
        ],
      },
      testimonials: [
        {
          name: "Emma Rodriguez",
          role: "Marketing Manager",
          content:
            "De AI coach is game-changing! Het leert echt van mijn werkpatronen en geeft relevante tips.",
          rating: 5,
        },
        {
          name: "Thomas Chen",
          role: "Startup Founder",
          content:
            "Ons team van 8 personen gebruikt FocusFlow Pro daily. Onze productiviteit is met 60% gestegen!",
          rating: 5,
        },
      ],
    },
    enterprise: {
      title: "Enterprise Plan",
      subtitle: "Voor grote organisaties en enterprise teams",
      price: "Aangepast",
      period: "/maand",
      description:
        "Enterprise-grade beveiliging, onbeperkte teams, dedicated support en custom integraties.",
      rating: 4.9,
      users: "500+ bedrijven",
      features: [
        "Alles van Pro, plus:",
        "Onbeperkte team members",
        "Enterprise SSO (SAML, LDAP)",
        "Advanced security & compliance",
        "Dedicated account manager",
        "Custom integraties",
        "On-premise deployment optie",
        "SLA garantie",
        "Training en onboarding",
      ],
      detailedFeatures: {
        security: [
          "Enterprise-grade encryptie",
          "GDPR & SOC2 compliance",
          "Advanced audit logs",
          "Role-based access control",
          "Single Sign-On integration",
        ],
        support: [
          "Dedicated customer success manager",
          "24/7 priority support",
          "Custom training sessies",
          "Quarterly business reviews",
          "Direct engineering contact",
        ],
        enterprise: [
          "Unlimited teams en projects",
          "Advanced reporting dashboard",
          "Custom workflow automation",
          "API rate limiting verhoogd",
          "White-label opties beschikbaar",
        ],
      },
      testimonials: [
        {
          name: "David van Oosten",
          role: "CTO, TechCorp NL",
          content:
            "FocusFlow Enterprise heeft onze 200+ developers geholpen om 45% meer geconcentreerd te werken.",
          rating: 5,
        },
        {
          name: "Lisa Vermeulen",
          role: "HR Director, Innovation BV",
          content:
            "De enterprise features en dedicated support maken het perfect voor onze multinational.",
          rating: 5,
        },
      ],
    },
  };

  const product = productData[productId as keyof typeof productData];

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Product niet gevonden</CardTitle>
            <CardDescription>
              Het opgevraagde product bestaat niet
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/pricing")} className="w-full">
              Bekijk alle plannen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/pricing")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Terug naar prijzen</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FocusFlow
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Bewaren
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Start Gratis Trial
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
            {product.users} Nederlandse professionals vertrouwen dit plan
          </Badge>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{product.subtitle}</p>
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {product.price}
              </div>
              <div className="text-gray-600">{product.period}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <div className="text-sm text-gray-600">Gebruikersrating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 mb-1">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-bold">{product.users}</span>
              </div>
              <div className="text-sm text-gray-600">Actieve gebruikers</div>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overzicht</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="testimonials">Reviews</TabsTrigger>
                <TabsTrigger value="comparison">Vergelijking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Wat krijg je met {product.title}?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Waarom kiezen voor {product.title}?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold mb-1">Instant Impact</h3>
                        <p className="text-sm text-gray-600">
                          Merk direct verschil in je productiviteit
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold mb-1">100% Veilig</h3>
                        <p className="text-sm text-gray-600">
                          Nederlandse servers, GDPR compliant
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold mb-1">
                          Bewezen Resultaat
                        </h3>
                        <p className="text-sm text-gray-600">
                          Gemiddeld 40% productiviteitsverbetering
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-6">
                {Object.entries(product.detailedFeatures).map(
                  ([category, features]) => (
                    <Card key={category} className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="capitalize">
                          {category === "ai"
                            ? "AI Features"
                            : category === "analytics"
                              ? "Analytics & Reporting"
                              : category === "team"
                                ? "Team Collaboration"
                                : category === "security"
                                  ? "Security & Compliance"
                                  : category === "support"
                                    ? "Support & Success"
                                    : category === "enterprise"
                                      ? "Enterprise Features"
                                      : category === "focus"
                                        ? "Focus Tools"
                                        : category === "integrations"
                                          ? "Integraties"
                                          : category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  {product.testimonials.map((testimonial, index) => (
                    <Card key={index} className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">
                                {testimonial.name}
                              </h3>
                              <Badge variant="outline">
                                {testimonial.role}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 mb-3">
                              {Array.from({ length: testimonial.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-500 fill-current"
                                  />
                                ),
                              )}
                            </div>
                            <p className="text-gray-700 italic">
                              "{testimonial.content}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6 mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Plan Vergelijking</CardTitle>
                    <CardDescription>
                      Zie hoe {product.title} zich verhoudt tot andere plannen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 font-semibold">
                              Feature
                            </th>
                            <th className="text-center py-3 font-semibold">
                              Starter
                            </th>
                            <th className="text-center py-3 font-semibold">
                              Pro
                            </th>
                            <th className="text-center py-3 font-semibold">
                              Enterprise
                            </th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          <tr className="border-b">
                            <td className="py-3">Focus sessies</td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">AI Productivity Coach</td>
                            <td className="text-center py-3">-</td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">Team collaboration</td>
                            <td className="text-center py-3">-</td>
                            <td className="text-center py-3">Tot 10 leden</td>
                            <td className="text-center py-3">Onbeperkt</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">Enterprise SSO</td>
                            <td className="text-center py-3">-</td>
                            <td className="text-center py-3">-</td>
                            <td className="text-center py-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{product.price}</h3>
                  <p className="text-gray-600 mb-6">{product.period}</p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4"
                    onClick={() =>
                      navigate("/checkout", { state: { plan: productId } })
                    }
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start 30-Dagen Gratis Trial
                  </Button>
                  <p className="text-xs text-gray-500 mb-4">
                    Geen creditcard vereist • Cancel altijd • Nederlandse
                    support
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Inbegrepen in je trial:
                    </p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Alle {product.title} features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Nederlandse ondersteuning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Migratie hulp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Hulp nodig?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat met Sales
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Boek een Demo
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Snelle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Setup tijd</span>
                  <span className="font-medium">&lt; 5 minuten</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Gebruikerstevredenheid
                  </span>
                  <span className="font-medium">
                    {Math.round(product.rating * 20)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gemiddelde ROI</span>
                  <span className="font-medium">340%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Klant retentie</span>
                  <span className="font-medium">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
