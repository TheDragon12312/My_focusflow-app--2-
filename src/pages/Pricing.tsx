import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  ArrowLeft,
  CheckCircle,
  Zap,
  Users,
  Shield,
  Star,
  Clock,
  Brain,
  Award,
  Calendar,
  BarChart3,
  Settings,
  Mail,
  Phone,
} from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "€9,99",
      period: "/maand",
      yearlyPrice: "€99,99",
      description:
        "Perfect voor individuele professionals die hun focus willen verbeteren",
      popular: false,
      features: [
        "Onbeperkte focus sessies",
        "Basis statistieken & rapportage",
        "5 app integraties",
        "E-mail notificaties",
        "Mobiele app toegang",
        "Community support",
        "Basis Pomodoro timer",
        "Eenvoudige distraction blocking",
      ],
      notIncluded: [
        "AI Productivity Coach",
        "Team collaboration",
        "Geavanceerde analytics",
        "Priority support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "€19,99",
      period: "/maand",
      yearlyPrice: "€199,99",
      description: "Voor ambitieuze professionals en kleine teams",
      popular: true,
      features: [
        "Alles van Starter, plus:",
        "AI Productivity Coach met real-time insights",
        "Onbeperkte integraties (Google, Outlook, Slack)",
        "Geavanceerde analytics & rapportage",
        "Team collaboration (tot 10 leden)",
        "Priority support",
        "Aangepaste workflows",
        "API toegang",
        "Distractie heatmaps",
        "Goal tracking & achievements",
      ],
      notIncluded: [
        "Enterprise SSO",
        "Dedicated account manager",
        "Custom integraties",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Aangepast",
      period: "/maand",
      yearlyPrice: "Vanaf €499,99",
      description: "Voor grote organisaties met enterprise-grade behoeften",
      popular: false,
      features: [
        "Alles van Pro, plus:",
        "Onbeperkte team members",
        "Enterprise SSO (SAML, LDAP)",
        "Advanced security & compliance",
        "Dedicated account manager",
        "Custom integraties",
        "On-premise deployment optie",
        "SLA garantie (99.9% uptime)",
        "Training en onboarding",
        "Quarterly business reviews",
        "White-label opties",
      ],
      notIncluded: [],
    },
  ];

  const testimonials = [
    {
      name: "Emma van der Berg",
      role: "Marketing Director, Mollie",
      content:
        "FocusFlow heeft ons team van 15 personen geholpen om 40% productiever te worden. De AI coach geeft echt relevante tips!",
      rating: 5,
      plan: "Pro",
    },
    {
      name: "Lars Janssen",
      role: "CTO, Adyen",
      content:
        "De enterprise features zijn perfect voor onze 200+ developers. Geweldige integratie met onze bestaande tools.",
      rating: 5,
      plan: "Enterprise",
    },
    {
      name: "Sofia Rodriguez",
      role: "Freelance Designer",
      content:
        "Als freelancer is FocusFlow Starter perfect. Simpel, effectief en betaalbaar. Mijn productiviteit is met 60% gestegen!",
      rating: 5,
      plan: "Starter",
    },
  ];

  const faqs = [
    {
      question: "Kan ik van plan wisselen?",
      answer:
        "Ja, je kunt altijd upgraden of downgraden. Wijzigingen gaan direct in en je betaalt alleen het verschil pro-rata.",
    },
    {
      question: "Is er een gratis trial?",
      answer:
        "Ja! Alle plannen hebben een 30-dagen gratis trial. Geen creditcard vereist voor de trial.",
    },
    {
      question: "Wat gebeurt er als ik opzeg?",
      answer:
        "Je kunt altijd opzeggen. Je data blijft beschikbaar tot het einde van je betaalde periode en je kunt je gegevens exporteren.",
    },
    {
      question: "Welke betaalmethoden accepteren jullie?",
      answer:
        "We accepteren alle gangbare creditcards, PayPal en Nederlandse betaalmethoden zoals iDEAL.",
    },
    {
      question: "Is mijn data veilig?",
      answer:
        "Absoluut! We gebruiken enterprise-grade beveiliging, GDPR-compliance en Nederlandse datacenters.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Terug naar home</span>
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
              <Button variant="outline" onClick={() => navigate("/login")}>
                Inloggen
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => navigate("/checkout")}
              >
                Gratis Starten
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
            ⚡ 30 dagen gratis trial - Geen creditcard vereist
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Kies het{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              perfecte plan
            </span>{" "}
            voor jouw productiviteit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Of je nu een individuele professional bent of een enterprise team
            leidt, we hebben de juiste tools om jouw focus naar het volgende
            niveau te tillen.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-600">
                25.000+ Nederlandse professionals
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-600">4.9/5 sterren rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600">GDPR compliant</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`shadow-xl border-0 relative ${
                plan.popular
                  ? "ring-2 ring-blue-500 scale-105 bg-gradient-to-br from-blue-50 to-purple-50"
                  : "bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    🔥 Meest Populair
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                  {plan.yearlyPrice && plan.price !== "Aangepast" && (
                    <div className="text-sm text-gray-500 mt-1">
                      of {plan.yearlyPrice} jaarlijks (2 maanden gratis!)
                    </div>
                  )}
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.notIncluded.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Niet inbegrepen:
                    </p>
                    <div className="space-y-2">
                      {plan.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 space-y-3">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() =>
                      navigate("/checkout", { state: { plan: plan.id } })
                    }
                  >
                    {plan.price === "Aangepast"
                      ? "Contact Opnemen"
                      : "Start Gratis Trial"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/product/${plan.id}`)}
                  >
                    Meer Informatie
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Wat zeggen{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nederlandse professionals
            </span>
            ?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                    <Badge variant="outline">{testimonial.plan}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Plan Vergelijking
          </h2>
          <Card className="shadow-xl border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">
                        Features
                      </th>
                      <th className="text-center py-4 px-6 font-semibold">
                        Starter
                      </th>
                      <th className="text-center py-4 px-6 font-semibold bg-blue-50">
                        Pro
                      </th>
                      <th className="text-center py-4 px-6 font-semibold">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-4 px-6">Focus sessies</td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6 bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-4 px-6">AI Productivity Coach</td>
                      <td className="text-center py-4 px-6">-</td>
                      <td className="text-center py-4 px-6 bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-4 px-6">Team collaboration</td>
                      <td className="text-center py-4 px-6">-</td>
                      <td className="text-center py-4 px-6 bg-blue-50">
                        Tot 10 leden
                      </td>
                      <td className="text-center py-4 px-6">Onbeperkt</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-4 px-6">Enterprise SSO</td>
                      <td className="text-center py-4 px-6">-</td>
                      <td className="text-center py-4 px-6 bg-blue-50">-</td>
                      <td className="text-center py-4 px-6">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-4 px-6">Dedicated support</td>
                      <td className="text-center py-4 px-6">-</td>
                      <td className="text-center py-4 px-6 bg-blue-50">
                        Priority
                      </td>
                      <td className="text-center py-4 px-6">24/7 Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Veelgestelde Vragen
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om je productiviteit te{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              transformeren
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 25.000+ Nederlandse professionals die hun focus al hebben
            verbeterd met FocusFlow. Start vandaag nog met je gratis trial.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate("/checkout")}
            >
              <Zap className="h-5 w-5 mr-2" />
              Start 30-Dagen Gratis Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              <Phone className="h-5 w-5 mr-2" />
              Praat met Sales
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Geen creditcard vereist • Cancel altijd • Nederlandse support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
