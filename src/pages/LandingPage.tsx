import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import {
  Target,
  Brain,
  Clock,
  BarChart3,
  Users,
  Star,
  Check,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Heart,
  Sparkles,
  Timer,
  Crown,
  Rocket,
  Trophy,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeUsers, setActiveUsers] = useState(2847);
  const [completedSessions, setCompletedSessions] = useState(34521);

  // Animate numbers for psychological effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3));
      setCompletedSessions((prev) => prev + Math.floor(Math.random() * 8));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      content:
        "FocusFlow completely transformed my productivity. I now complete 40% more work in less time. The AI coaching is incredibly helpful!",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Developer",
      content:
        "The distraction detection feature is amazing. It keeps me on track even when working from home with all the distractions around.",
      rating: 5,
      avatar: "👨‍💻",
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
      content:
        "My team's productivity has skyrocketed since we started using FocusFlow. The collaboration features are fantastic!",
      rating: 5,
      avatar: "👩‍🎨",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FocusFlow
              </span>
              <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                Live: {activeUsers.toLocaleString()} users online
              </Badge>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium hover:scale-105"
              >
                {t("landing.features")}
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium hover:scale-105"
              >
                {t("landing.pricing")}
              </a>
              <Button
                variant="ghost"
                onClick={() => navigate("/about")}
                className="font-medium hover:text-blue-600 hover:bg-blue-50"
              >
                {t("landing.about")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="font-medium hover:text-blue-600 hover:bg-blue-50"
              >
                {t("landing.contact")}
              </Button>

              {/* Language Toggle Buttons */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("nl")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    language === "nl"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇳🇱 NL
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    language === "en"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="font-medium hover:text-blue-600 hover:bg-blue-50"
              >
                {t("landing.signIn")}
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {t("landing.getStartedFree")}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-6 animate-bounce">
              {t("landing.topApp2024")}
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t("landing.heroTitle")}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                {t("landing.heroTitleSpan")}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("landing.heroDescription")} {activeUsers.toLocaleString()}
              {t("landing.heroDescriptionEnd")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Play className="h-5 w-5 mr-2" />
                {t("landing.startFreeTrial")}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/demo")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t("landing.watchDemo")}
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"
                    ></div>
                  ))}
                </div>
                <span className="font-medium">
                  {t("landing.joinUsers")} {activeUsers.toLocaleString()}
                  {t("landing.joinUsersEnd")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-medium">{t("landing.rating")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("landing.featuresSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8 text-purple-600" />,
                title: t("landing.aiCoach"),
                description: t("landing.aiCoachDesc"),
                badge: t("landing.premium"),
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: t("landing.smartBlocking"),
                description: t("landing.smartBlockingDesc"),
                badge: t("landing.popular"),
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: t("landing.teamCollaboration"),
                description: t("landing.teamCollaborationDesc"),
                badge: t("landing.new"),
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
                title: t("landing.advancedAnalytics"),
                description: t("landing.advancedAnalyticsDesc"),
              },
              {
                icon: <Timer className="h-8 w-8 text-red-600" />,
                title: t("landing.pomodoroTimer"),
                description: t("landing.pomodoroTimerDesc"),
              },
              {
                icon: <Target className="h-8 w-8 text-indigo-600" />,
                title: t("landing.goalTracking"),
                description: t("landing.goalTrackingDesc"),
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    {feature.badge && (
                      <Badge
                        className={`
                        ${feature.badge === t("landing.premium") ? "bg-purple-100 text-purple-700" : ""}
                        ${feature.badge === t("landing.popular") ? "bg-green-100 text-green-700" : ""}
                        ${feature.badge === t("landing.new") ? "bg-blue-100 text-blue-700" : ""}
                      `}
                      >
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("landing.testimonialsTitle")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="relative">
            <Card className="max-w-4xl mx-auto border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("landing.pricingTitle")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landing.pricingSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: t("landing.free"),
                price: "$0",
                period: t("landing.freeForever"),
                description: t("landing.freeDesc"),
                features: [
                  language === "nl"
                    ? "Tot 5 focussessies per dag"
                    : "Up to 5 focus sessions per day",
                  language === "nl" ? "Basis statistieken" : "Basic statistics",
                  language === "nl" ? "Eenvoudige timer" : "Simple timer",
                  language === "nl" ? "E-mail ondersteuning" : "Email support",
                ],
                cta: t("landing.getStartedFree"),
                popular: false,
              },
              {
                name: t("landing.pro"),
                price: "$9.99",
                period: t("landing.proPrice"),
                description: t("landing.proDesc"),
                features: [
                  language === "nl"
                    ? "Onbeperkte focussessies"
                    : "Unlimited focus sessions",
                  language === "nl"
                    ? "AI productiviteitscoach"
                    : "AI productivity coach",
                  language === "nl"
                    ? "Geavanceerde analytics"
                    : "Advanced analytics",
                  language === "nl"
                    ? "Agenda integratie"
                    : "Calendar integration",
                  language === "nl"
                    ? "Afleidingsblokkering"
                    : "Distraction blocking",
                  language === "nl"
                    ? "Prioriteitsondersteuning"
                    : "Priority support",
                ],
                cta: t("landing.startFreeTrial"),
                popular: true,
              },
              {
                name: t("landing.team"),
                price: "$19.99",
                period: t("landing.proPrice"),
                description: t("landing.teamDesc"),
                features: [
                  language === "nl" ? "Alles van Pro" : "Everything in Pro",
                  language === "nl" ? "Teamcollaboratie" : "Team collaboration",
                  language === "nl" ? "Gedeelde analytics" : "Shared analytics",
                  language === "nl" ? "Admin dashboard" : "Admin dashboard",
                  language === "nl" ? "SSO integratie" : "SSO integration",
                  language === "nl"
                    ? "Toegewijde ondersteuning"
                    : "Dedicated support",
                ],
                cta: t("landing.contactSales"),
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`
                relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105
                ${plan.popular ? "ring-2 ring-blue-600 bg-gradient-to-b from-blue-50 to-white" : ""}
              `}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
                    {t("landing.mostPopular")}
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() =>
                      navigate(
                        plan.name === "Free"
                          ? "/auth"
                          : `/checkout?plan=${plan.name.toLowerCase()}`,
                      )
                    }
                    className={`
                      w-full py-3 font-semibold transition-all duration-300 hover:scale-105
                      ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                          : "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }
                    `}
                    variant={plan.popular ? "default" : "outline"}
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t("landing.ctaTitle")}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {t("landing.startFreeTrial")}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/contact")}
              className="border-2 border-white bg-white text-black hover:bg-gray-100 hover:text-black px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              {t("landing.contactSales")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FocusFlow</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                {t("landing.footerDescription")}
              </p>
              <div className="text-sm text-gray-500">
                {t("landing.securePrivate")}{" "}
                {completedSessions.toLocaleString()}
                {t("landing.sessionsCompleted")}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("landing.product")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.features")}
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.pricing")}
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/demo")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.demo")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/roadmap")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.roadmap")}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("landing.company")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.about")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.contact")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/help")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.help")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/community")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.community")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/terms")}
                    className="hover:text-white transition-colors"
                  >
                    {t("landing.termsOfConditions")}
                  </button>
                </li>
                {/* Add Privacy Policy button */}
                <li>
                  <button
                    onClick={() => navigate("/privacy-policy")}
                    className="hover:text-white transition-colors"
                  >
                    {t("Privacy Policy")}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t("landing.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
