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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  ArrowLeft,
  Users,
  MessageCircle,
  Heart,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Plus,
  Star,
  Eye,
  ThumbsUp,
  Share2,
  BookOpen,
  Video,
  Mic,
  Coffee,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react";

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const communityStats = {
    totalMembers: 25647,
    activeToday: 2847,
    postsThisWeek: 1453,
    helpfulAnswers: 8924,
  };

  const popularPosts = [
    {
      id: 1,
      title: "Hoe ik mijn productiviteit met 80% verbeterde in 30 dagen",
      author: "Emma van der Berg",
      role: "Marketing Manager @ Mollie",
      avatar: "/placeholder.svg",
      replies: 47,
      likes: 156,
      views: 2341,
      timeAgo: "2 uur geleden",
      category: "Success Stories",
      preview:
        "Na maanden van experimenteren heb ik eindelijk de perfecte FocusFlow workflow gevonden...",
    },
    {
      id: 2,
      title: "AI Coach tips die niemand je vertelt (maar wel moet weten)",
      author: "Lars Janssen",
      role: "Developer @ Adyen",
      avatar: "/placeholder.svg",
      replies: 23,
      likes: 89,
      views: 1567,
      timeAgo: "5 uur geleden",
      category: "Tips & Tricks",
      preview:
        "De AI Coach heeft verborgen features die je workflow kunnen revolutioneren...",
    },
    {
      id: 3,
      title:
        "Team Focus Sessions: Hoe wij als remote team 40% productiever werden",
      author: "Sofia Rodriguez",
      role: "Product Lead @ Booking.com",
      avatar: "/placeholder.svg",
      replies: 34,
      likes: 112,
      views: 1823,
      timeAgo: "1 dag geleden",
      category: "Team Collaboration",
      preview:
        "Remote werken was een uitdaging tot we FocusFlow team features ontdekten...",
    },
  ];

  const categories = [
    {
      name: "Success Stories",
      description: "Deel je FocusFlow success verhaal",
      posts: 234,
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      name: "Tips & Tricks",
      description: "Productiviteitshacks en hidden features",
      posts: 567,
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      name: "Team Collaboration",
      description: "Alles over samenwerken met FocusFlow",
      posts: 189,
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50 border-green-200",
    },
    {
      name: "Feature Requests",
      description: "Voorstellen voor nieuwe features",
      posts: 142,
      icon: <Plus className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      name: "Technical Support",
      description: "Hulp bij problemen en configuratie",
      posts: 298,
      icon: <MessageCircle className="h-6 w-6 text-red-500" />,
      color: "bg-red-50 border-red-200",
    },
    {
      name: "General Discussion",
      description: "Algemene discussies over productiviteit",
      posts: 423,
      icon: <Coffee className="h-6 w-6 text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
    },
  ];

  const events = [
    {
      title: "FocusFlow Monthly Meetup Amsterdam",
      date: "Donderdag 15 Dec, 19:00",
      location: "WeWork Metropolis, Amsterdam",
      attendees: 45,
      type: "offline",
      description: "Maandelijkse meetup voor FocusFlow gebruikers in Amsterdam",
    },
    {
      title: "Productiviteit Webinar: AI & Focus",
      date: "Vrijdag 22 Dec, 15:00",
      location: "Online",
      attendees: 234,
      type: "online",
      description: "Deep dive in AI-powered productiviteit met onze experts",
    },
    {
      title: "Team Collaboration Workshop",
      date: "Maandag 8 Jan, 14:00",
      location: "Online",
      attendees: 89,
      type: "online",
      description:
        "Leer hoe je FocusFlow optimaal inzet voor team collaboration",
    },
  ];

  const topContributors = [
    {
      name: "Emma van der Berg",
      role: "Community Moderator",
      posts: 156,
      helpfulAnswers: 89,
      reputation: 2847,
      avatar: "/placeholder.svg",
    },
    {
      name: "Lars Janssen",
      role: "Power User",
      posts: 134,
      helpfulAnswers: 67,
      reputation: 2234,
      avatar: "/placeholder.svg",
    },
    {
      name: "Sofia Rodriguez",
      role: "Team Expert",
      posts: 98,
      helpfulAnswers: 78,
      reputation: 1956,
      avatar: "/placeholder.svg",
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
                  FocusFlow Community
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            FocusFlow{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Verbind met 25.000+ Nederlandse professionals die hun productiviteit
            transformeren. Deel ervaringen, krijg tips, en word onderdeel van
            onze groeiende community.
          </p>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {communityStats.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Community Members</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {communityStats.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Actief Vandaag</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {communityStats.postsThisWeek.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Posts Deze Week</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {communityStats.helpfulAnswers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Helpvolle Antwoorden
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Zoek in de community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="popular">Populair</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="categories">Categorieën</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Populaire Discussies</h2>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback>
                              {post.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{post.category}</Badge>
                              <span className="text-xs text-gray-500">
                                {post.timeAgo}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{post.preview}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">
                                  {post.author}
                                </span>
                                <span className="text-sm text-gray-500">
                                  • {post.role}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.replies}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6 mt-6">
                <h2 className="text-2xl font-bold">Community Categorieën</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category, index) => (
                    <Card
                      key={index}
                      className={`shadow-lg border-2 hover:shadow-xl transition-shadow cursor-pointer ${category.color}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-white rounded-lg">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {category.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {category.posts} posts
                              </span>
                              <Button variant="ghost" size="sm">
                                Bekijk →
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Aankomende Events</h2>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Mijn Agenda
                  </Button>
                </div>

                <div className="space-y-4">
                  {events.map((event, index) => (
                    <Card key={index} className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                className={
                                  event.type === "online"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }
                              >
                                {event.type === "online" ? (
                                  <>
                                    <Video className="h-3 w-3 mr-1" />
                                    Online
                                  </>
                                ) : (
                                  <>
                                    <Coffee className="h-3 w-3 mr-1" />
                                    Offline
                                  </>
                                )}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {event.attendees} deelnemers
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {event.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline">Deelnemen</Button>
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
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>
                  Onze meest actieve community members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={contributor.avatar}
                        alt={contributor.name}
                      />
                      <AvatarFallback>
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {contributor.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {contributor.role}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{contributor.reputation} rep</span>
                        <span>•</span>
                        <span>{contributor.helpfulAnswers} helpful</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Wees respectvol en constructief</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Zoek eerst voordat je vraagt</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Deel je kennis en ervaring</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Help anderen waar je kunt</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nieuwe bij FocusFlow?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Begin met onze getting started guide en stel je voor aan de
                  community!
                </p>
                <Button size="sm" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Getting Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
