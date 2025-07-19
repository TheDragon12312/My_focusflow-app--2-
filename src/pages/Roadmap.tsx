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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Zap,
  Brain,
  Users,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  Mic,
  Video,
  MessageCircle,
  Award,
  ThumbsUp,
  Eye,
  Star,
  Lightbulb,
  Code,
  Palette,
} from "lucide-react";

const Roadmap = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState("Q1-2025");

  const roadmapItems = {
    "Q4-2024": {
      status: "completed",
      items: [
        {
          title: "AI Productivity Coach 2.0",
          description:
            "Geavanceerde AI-algorithms voor gepersonaliseerde productiviteitsadviezen",
          status: "completed",
          votes: 234,
          category: "AI & Machine Learning",
          icon: <Brain className="h-5 w-5" />,
          completion: 100,
        },
        {
          title: "Team Collaboration Hub",
          description: "Real-time team dashboard met shared focus sessions",
          status: "completed",
          votes: 189,
          category: "Team Features",
          icon: <Users className="h-5 w-5" />,
          completion: 100,
        },
        {
          title: "Advanced Analytics Dashboard",
          description: "Uitgebreide rapportage en productiviteitsinsights",
          status: "completed",
          votes: 156,
          category: "Analytics",
          icon: <BarChart3 className="h-5 w-5" />,
          completion: 100,
        },
      ],
    },
    "Q1-2025": {
      status: "in-progress",
      items: [
        {
          title: "Native Mobile Apps",
          description:
            "iOS en Android apps met offline sync en push notificaties",
          status: "in-progress",
          votes: 567,
          category: "Mobile",
          icon: <Smartphone className="h-5 w-5" />,
          completion: 75,
          eta: "Februari 2025",
        },
        {
          title: "Voice Commands & Siri Integration",
          description:
            "Spraakbesturing voor hands-free focus sessie management",
          status: "in-progress",
          votes: 234,
          category: "Voice & AI",
          icon: <Mic className="h-5 w-5" />,
          completion: 45,
          eta: "Maart 2025",
        },
        {
          title: "Slack & Teams Deep Integration",
          description: "Diepere integratie met team communicatie tools",
          status: "planned",
          votes: 189,
          category: "Integrations",
          icon: <MessageCircle className="h-5 w-5" />,
          completion: 20,
          eta: "Maart 2025",
        },
      ],
    },
    "Q2-2025": {
      status: "planned",
      items: [
        {
          title: "Focus Rooms (Virtual Spaces)",
          description:
            "Virtuele focus ruimtes met ambient sounds en visual environments",
          status: "planned",
          votes: 423,
          category: "Innovation",
          icon: <Globe className="h-5 w-5" />,
          completion: 0,
          eta: "Mei 2025",
        },
        {
          title: "AI Meeting Summarizer",
          description: "Automatische meeting samenvattingen en action items",
          status: "planned",
          votes: 345,
          category: "AI & Productivity",
          icon: <Video className="h-5 w-5" />,
          completion: 0,
          eta: "Juni 2025",
        },
        {
          title: "Wellness & Break Optimizer",
          description:
            "AI-gedreven wellness checks en break timing optimalisatie",
          status: "planned",
          votes: 278,
          category: "Wellness",
          icon: <Award className="h-5 w-5" />,
          completion: 0,
          eta: "Juni 2025",
        },
      ],
    },
    "Q3-2025": {
      status: "planned",
      items: [
        {
          title: "Enterprise SSO & Security Suite",
          description:
            "SAML, LDAP, en geavanceerde security features voor enterprise",
          status: "planned",
          votes: 198,
          category: "Enterprise",
          icon: <Shield className="h-5 w-5" />,
          completion: 0,
          eta: "Augustus 2025",
        },
        {
          title: "Custom Workflow Builder",
          description:
            "Drag-and-drop workflow creator voor custom productiviteitsflows",
          status: "planned",
          votes: 312,
          category: "Automation",
          icon: <Code className="h-5 w-5" />,
          completion: 0,
          eta: "September 2025",
        },
        {
          title: "White-label Solutions",
          description:
            "Volledig aanpasbare white-label versie voor enterprise klanten",
          status: "planned",
          votes: 145,
          category: "Enterprise",
          icon: <Palette className="h-5 w-5" />,
          completion: 0,
          eta: "September 2025",
        },
      ],
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "planned":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "AI & Machine Learning": "bg-purple-100 text-purple-700",
      "Team Features": "bg-blue-100 text-blue-700",
      Analytics: "bg-green-100 text-green-700",
      Mobile: "bg-orange-100 text-orange-700",
      "Voice & AI": "bg-yellow-100 text-yellow-700",
      Integrations: "bg-red-100 text-red-700",
      Innovation: "bg-pink-100 text-pink-700",
      "AI & Productivity": "bg-indigo-100 text-indigo-700",
      Wellness: "bg-teal-100 text-teal-700",
      Enterprise: "bg-gray-100 text-gray-700",
      Automation: "bg-cyan-100 text-cyan-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const upcomingFeatures = [
    {
      title: "AI Code Review Assistant",
      description:
        "Voor developers: AI die code reviews doet tijdens focus sessies",
      votes: 89,
      category: "Developer Tools",
    },
    {
      title: "Biometric Integration",
      description: "Heart rate en stress monitoring via Apple Watch/Fitbit",
      votes: 167,
      category: "Health Tech",
    },
    {
      title: "AR Focus Overlay",
      description: "Augmented Reality overlay voor focus zone visualization",
      votes: 234,
      category: "Emerging Tech",
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
              <Button variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                Feature Request
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Star className="h-4 w-4 mr-2" />
                Vote on Features
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            FocusFlow{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ontdek wat we bouwen voor de toekomst van productiviteit. Stem op
            features, volg de voortgang, en help ons prioriteiten stellen voor
            de komende releases.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-600">
                Community-driven development
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600">Quarterly releases</span>
            </div>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-purple-500" />
              <span className="text-gray-600">User feedback prioriteit</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Roadmap */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="categories">Per Categorie</TabsTrigger>
                <TabsTrigger value="voting">Community Voting</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-8 mt-6">
                {Object.entries(roadmapItems).map(([quarter, data]) => (
                  <div key={quarter}>
                    <div className="flex items-center space-x-4 mb-6">
                      <h2 className="text-2xl font-bold">{quarter}</h2>
                      <Badge className={getStatusColor(data.status)}>
                        {data.status === "completed"
                          ? "Voltooid"
                          : data.status === "in-progress"
                            ? "In Progress"
                            : "Gepland"}
                      </Badge>
                    </div>

                    <div className="grid gap-4">
                      {data.items.map((item, index) => (
                        <Card key={index} className="shadow-lg border-0">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4 flex-1">
                                <div
                                  className={`p-2 rounded-lg ${getCategoryColor(item.category)} bg-opacity-20`}
                                >
                                  {item.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                      {item.title}
                                    </h3>
                                    <Badge
                                      className={getStatusColor(item.status)}
                                    >
                                      {item.status === "completed"
                                        ? "✓"
                                        : item.status === "in-progress"
                                          ? "🔄"
                                          : "📅"}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 mb-3">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <Badge
                                      variant="outline"
                                      className={getCategoryColor(
                                        item.category,
                                      )}
                                    >
                                      {item.category}
                                    </Badge>
                                    {item.eta && (
                                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span>ETA: {item.eta}</span>
                                      </div>
                                    )}
                                  </div>
                                  {item.completion > 0 && (
                                    <div className="mt-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">
                                          Voortgang
                                        </span>
                                        <span className="text-sm font-medium">
                                          {item.completion}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={item.completion}
                                        className="w-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button variant="outline" size="sm">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {item.votes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="categories" className="space-y-6 mt-6">
                <h2 className="text-2xl font-bold">Features per Categorie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "AI & Machine Learning",
                    "Team Features",
                    "Mobile",
                    "Enterprise",
                    "Integrations",
                    "Innovation",
                  ].map((category) => (
                    <Card key={category} className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.values(roadmapItems)
                            .flatMap((quarter) => quarter.items)
                            .filter((item) => item.category === category)
                            .map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="font-medium">
                                  {item.title}
                                </span>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status === "completed"
                                    ? "✓"
                                    : item.status === "in-progress"
                                      ? "🔄"
                                      : "📅"}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="voting" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Community Feature Requests
                  </h2>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Nieuwe Feature Voorstellen
                  </Button>
                </div>

                <div className="space-y-4">
                  {upcomingFeatures.map((feature, index) => (
                    <Card key={index} className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {feature.title}
                              </h3>
                              <Badge variant="outline">
                                {feature.category}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 ml-6">
                            <div className="text-center">
                              <div className="font-bold text-blue-600">
                                {feature.votes}
                              </div>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                            <Button variant="outline">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Vote
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Release Schedule</CardTitle>
                <CardDescription>
                  Onze planning voor de komende releases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q1 2025</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q2 2025</span>
                    <Badge className="bg-gray-100 text-gray-700">Planned</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Q3 2025</span>
                    <Badge className="bg-gray-100 text-gray-700">Planned</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Development Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Features Delivered</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Development</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Community Votes</span>
                    <span className="font-medium">3,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feature Requests</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Heb je een idee?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Deel je feature request met de community en laat anderen erop
                  stemmen!
                </p>
                <Button size="sm" variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Feature Voorstellen
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Beta Testing</CardTitle>
                <CardDescription>
                  Test nieuwe features voordat ze live gaan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Join onze beta program en krijg early access tot nieuwe
                  features.
                </p>
                <Button size="sm" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Word Beta Tester
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
