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
  Users,
  Award,
  Heart,
  Globe,
  Zap,
  Shield,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Emma van der Berg",
      role: "CEO & Founder",
      description:
        "Ex-Google productiviteitsexpert met 10+ jaar ervaring in focus research",
      image: "/placeholder.svg",
    },
    {
      name: "Lars Janssen",
      role: "CTO",
      description:
        "Frontend specialist die eerder bij Booking.com en Adyen werkte",
      image: "/placeholder.svg",
    },
    {
      name: "Sofia Rodriguez",
      role: "Head of AI",
      description: "AI researcher met PhD in cognitieve psychologie van de UvA",
      image: "/placeholder.svg",
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      description:
        "UX designer die eerder award-winning apps voor Spotify ontwikkelde",
      image: "/placeholder.svg",
    },
  ];

  const stats = [
    { number: "25.000+", label: "Nederlandse Professionals" },
    { number: "500+", label: "Nederlandse Bedrijven" },
    { number: "40%", label: "Gemiddelde Productiviteitsverbetering" },
    { number: "4.9/5", label: "Gebruikerstevredenheid" },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Nederlandse Kwaliteit",
      description:
        "Geboren in Amsterdam, gebouwd voor Nederlandse professionals en teams",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Privacy First",
      description:
        "Jouw data blijft altijd van jou. GDPR-compliant en gehost in Nederlandse datacenters",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Wetenschappelijk Onderbouwd",
      description:
        "Gebaseerd op bewezen productiviteitstechnieken en cognitieve wetenschap",
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Community Driven",
      description:
        "Ontwikkeld met feedback van duizenden Nederlandse professionals",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "De Start",
      description:
        "FocusFlow wordt opgericht door Emma van der Berg na frustratie met bestaande productiviteitstools",
    },
    {
      year: "2023",
      title: "Eerste 1000 Gebruikers",
      description:
        "Lancering van de beta met Nederlandse professionals uit de tech sector",
    },
    {
      year: "2023",
      title: "AI Coach Launch",
      description:
        "Introductie van de eerste AI-gebaseerde productiviteitscoach in Europa",
    },
    {
      year: "2024",
      title: "Enterprise Groei",
      description:
        "25.000+ professionals en 500+ bedrijven vertrouwen op FocusFlow dagelijks",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
            🇳🇱 Made in Amsterdam
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Over{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FocusFlow
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            FocusFlow is geboren uit frustratie. Frustratie met
            productiviteitstools die niet begrijpen hoe Nederlandse
            professionals werken. We hebben FocusFlow gebouwd om die kloof te
            dichten.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600">Amsterdam, Nederland</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span className="text-gray-600">Opgericht in 2022</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-gray-600">25.000+ gebruikers</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Onze Missie</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Wij geloven dat iedereen het recht heeft op focus in een wereld
                vol afleidingen. Onze missie is om Nederlandse professionals en
                teams te helpen hun potentieel te bereiken door tools te bieden
                die echt begrijpen hoe je werkt, niet hoe software denkt dat je
                zou moeten werken.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Onze{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Waarden
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg border-0 text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Ons Verhaal</h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.year.slice(-2)}
                  </div>
                </div>
                <Card className="flex-1 shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{item.year}</Badge>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ons{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recognition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Erkenning & Awards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Dutch Startup Award 2024</h3>
                <p className="text-sm text-gray-600">Best SaaS Product</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">TechCrunch Feature</h3>
                <p className="text-sm text-gray-600">
                  "AI-Powered Productivity Revolution"
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Fastest Growing</h3>
                <p className="text-sm text-gray-600">
                  ProductHunt #1 Product of the Day
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Word onderdeel van ons{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              verhaal
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Help ons FocusFlow nog beter te maken. Join onze community van
            Nederlandse professionals die dagelijks hun productiviteit
            verbeteren.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate("/pricing")}
            >
              <Zap className="h-5 w-5 mr-2" />
              Start je FocusFlow Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              Praat met ons Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
