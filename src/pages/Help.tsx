import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  ArrowLeft,
  Search,
  Book,
  Video,
  MessageCircle,
  Download,
  Star,
  Clock,
  Users,
  Settings,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  HelpCircle,
  ExternalLink,
  Play,
  FileText,
  Headphones,
} from "lucide-react";

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Aan de Slag",
      description: "Eerste stappen met FocusFlow",
      articles: 12,
      popular: true,
    },
    {
      icon: <Settings className="h-6 w-6 text-blue-500" />,
      title: "Instellingen & Configuratie",
      description: "Personaliseer je FocusFlow ervaring",
      articles: 8,
      popular: false,
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      title: "Integraties",
      description: "Verbind met Google, Outlook & meer",
      articles: 15,
      popular: true,
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      title: "Statistieken & Rapportage",
      description: "Begrijp je productiviteitsdata",
      articles: 6,
      popular: false,
    },
    {
      icon: <Users className="h-6 w-6 text-orange-500" />,
      title: "Team Features",
      description: "Samenwerking en team management",
      articles: 10,
      popular: true,
    },
    {
      icon: <Shield className="h-6 w-6 text-red-500" />,
      title: "Beveiliging & Privacy",
      description: "Data veiligheid en GDPR compliance",
      articles: 5,
      popular: false,
    },
  ];

  const popularArticles = [
    {
      title: "Hoe start ik mijn eerste focus sessie?",
      category: "Aan de Slag",
      readTime: "3 min",
      rating: 4.9,
      views: 2547,
    },
    {
      title: "Google Calendar integratie instellen",
      category: "Integraties",
      readTime: "5 min",
      rating: 4.8,
      views: 1823,
    },
    {
      title: "AI Coach configureren voor optimale tips",
      category: "Instellingen",
      readTime: "4 min",
      rating: 4.7,
      views: 1456,
    },
    {
      title: "Team uitnodigen en rollen toewijzen",
      category: "Team Features",
      readTime: "6 min",
      rating: 4.9,
      views: 1234,
    },
    {
      title: "Productiviteitsstatistieken begrijpen",
      category: "Statistieken",
      readTime: "7 min",
      rating: 4.6,
      views: 987,
    },
  ];

  const faqs = [
    {
      question: "Wat is FocusFlow en hoe kan het mij helpen?",
      answer:
        "FocusFlow is een Nederlandse productiviteitsapp die gebruik maakt van de Pomodoro Technique, AI-coaching en slimme integraties om je focus en productiviteit te verbeteren. Het helpt je door distracties te minimaliseren, je tijd beter in te delen en inzichten te geven in je werkpatronen.",
    },
    {
      question: "Hoe werkt de AI Coach precies?",
      answer:
        "Onze AI Coach analyseert je werkpatronen, focussessies en productiviteitsdata om gepersonaliseerde tips te geven. Het leert van je gedrag en past de adviezen aan op basis van wat voor jou het beste werkt. Alle analyse gebeurt lokaal en privé.",
    },
    {
      question: "Welke integraties zijn beschikbaar?",
      answer:
        "We integreren met populaire Nederlandse tools zoals Google Workspace, Microsoft 365, Outlook, Slack, Trello, Asana, en nog veel meer. Nieuwe integraties worden regelmatig toegevoegd op basis van gebruikersfeedback.",
    },
    {
      question: "Is mijn data veilig en privé?",
      answer:
        "Ja, privacy staat bij ons voorop. Alle data wordt versleuteld opgeslagen in EU datacenters, we volgen GDPR-richtlijnen strikt, en je data wordt nooit gedeeld met derde partijen zonder expliciete toestemming.",
    },
    {
      question: "Kan ik FocusFlow gratis proberen?",
      answer:
        "Absoluut! We bieden een 30-dagen gratis trial aan waarin je toegang hebt tot alle Pro features. Geen creditcard vereist, en je kunt op elk moment opzeggen.",
    },
    {
      question: "Hoe kan ik mijn team toevoegen?",
      answer:
        "In de Team Collaboration Hub kun je teamleden uitnodigen via email. Zij ontvangen een uitnodiging en kunnen direct beginnen. Je kunt rollen toewijzen en team-statistieken bekijken.",
    },
    {
      question: "Welke browsers worden ondersteund?",
      answer:
        "FocusFlow werkt optimaal in alle moderne browsers: Chrome, Firefox, Safari, en Edge. We raden de laatste versie aan voor de beste ervaring.",
    },
    {
      question: "Hoe kan ik mijn abonnement opzeggen?",
      answer:
        "Je kunt je abonnement op elk moment opzeggen in je account instellingen. Na opzegging blijf je toegang houden tot je betaalde features tot het einde van je huidige factuurperiode.",
    },
  ];

  const quickActions = [
    {
      icon: <Video className="h-5 w-5" />,
      title: "Video Tutorials",
      description: "Leer FocusFlow kennen met onze video guides",
      action: "Bekijk Videos",
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Quick Start Guide",
      description: "PDF handleiding voor nieuwe gebruikers",
      action: "Download PDF",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat Support",
      description: "Chat direct met onze support experts",
      action: "Start Chat",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Persoonlijke Demo",
      description: "Boek een 1-op-1 demo sessie",
      action: "Boek Demo",
    },
  ];

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <Button onClick={() => navigate("/contact")} variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Help &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Support Center
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Vind antwoorden op je vragen, leer nieuwe features kennen, en word
            een FocusFlow expert. Onze help center is gemaakt door Nederlandse
            gebruikers, voor Nederlandse gebruikers.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Zoek naar artikelen, tutorials, of help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {action.icon}
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <Button variant="outline" size="sm">
                  {action.action}
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Help Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Help Categorieën</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category, index) => (
                  <Card
                    key={index}
                    className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{category.title}</h3>
                            {category.popular && (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                Populair
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {category.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {category.articles} artikelen
                            </span>
                            <Button variant="ghost" size="sm">
                              <ArrowLeft className="h-3 w-3 rotate-180" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {searchQuery
                  ? `Zoekresultaten (${filteredArticles.length})`
                  : "Populaire Artikelen"}
              </h2>
              <div className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Badge variant="outline">{article.category}</Badge>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{article.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>
                                {article.views.toLocaleString()} views
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Book className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Veelgestelde Vragen</h2>
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Nog steeds hulp nodig?</CardTitle>
                <CardDescription>
                  Ons Nederlandse support team staat klaar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => navigate("/contact")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Opnemen
                </Button>
                <div className="text-center text-sm text-gray-600">
                  <p>
                    Gemiddelde responstijd: <strong>2 uur</strong>
                  </p>
                  <p>
                    Klanttevredenheid: <strong>97%</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Nieuw bij FocusFlow?</CardTitle>
                <CardDescription>
                  Start met onze getting started guide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span>Account aanmaken</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span>Eerste focus sessie starten</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span>Integraties configureren</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <span>AI Coach activeren</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">API Documentatie</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Voor developers die FocusFlow willen integreren
                </p>
                <Button variant="outline" size="sm">
                  Bekijk Docs
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
