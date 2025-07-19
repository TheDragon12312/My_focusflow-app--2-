import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Play,
  Pause,
  ArrowLeft,
  Clock,
  Brain,
  BarChart3,
  Star,
  CheckCircle,
  Zap,
  Trophy,
  Coffee,
  Timer,
  Rocket,
} from "lucide-react";

const Demo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(1500); // 25 minutes in seconds
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: "Welkom bij FocusFlow! 🎯",
      description:
        "Laat me je laten zien hoe eenvoudig het is om je productiviteit te verhogen.",
      action: "Start Demo",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Stel je Focus Sessie in ⏰",
      description:
        "Kies je taak en de gewenste duur. Wij raden 25 minuten aan (Pomodoro techniek).",
      action: "Focus Sessie Starten",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "AI Coach in Actie 🤖",
      description:
        "Onze AI coach geeft je real-time tips en houdt je gemotiveerd tijdens je sessie.",
      action: "Bekijk AI Tips",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Afleiding Detectie 🛡️",
      description:
        "Automatische detectie van afleidende websites en apps met slimme blokkering.",
      action: "Test Blokkering",
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Pauze Tijd! ☕",
      description:
        "Na je focus sessie krijg je een verdiende pauze met gezonde activiteiten suggesties.",
      action: "Start Pauze",
      color: "from-orange-500 to-yellow-600",
    },
    {
      title: "Analytics & Inzichten 📊",
      description:
        "Zie je voortgang en krijg persoonlijke inzichten over je productiviteitspatronen.",
      action: "Bekijk Statistieken",
      color: "from-cyan-500 to-blue-600",
    },
  ];

  const aiTips = [
    "🎯 Je bent 15 minuten bezig - geweldig! Blijf gefocust op je hoofdtaak.",
    "💡 Tip: Schakel je telefoon naar 'Niet Storen' voor optimale concentratie.",
    "🔥 Je zit in een flow staat! Dit is het perfecte moment voor diep werk.",
    "⚡ Over 10 minuten mag je een verdiende pauze nemen. Volhouden!",
    "🏆 Fantastisch! Je hebt je focus-doel bereikt. Klaar voor de volgende uitdaging?",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          setProgress(((1500 - newTime) / 1500) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  // Auto advance demo steps
  useEffect(() => {
    if (currentStep < demoSteps.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  // Rotate AI tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % aiTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsPlaying(!isPlaying);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setTimer(1500);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Terug naar Home</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FocusFlow Demo
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-700 animate-pulse">
              🔴 Live Demo
            </Badge>
            <Button onClick={resetDemo} variant="outline" size="sm">
              Reset Demo
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Start Nu Gratis
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ervaar FocusFlow in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              2 minuten
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zie hoe FocusFlow je helpt om meer gedaan te krijgen met slimme
            focus sessies, AI coaching en productiviteitsanalyse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Steps */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Demo Stappen</span>
                  <Badge variant="outline">
                    Stap {currentStep + 1} van {demoSteps.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-500 ${
                        index === currentStep
                          ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-105`
                          : index < currentStep
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`font-semibold ${index === currentStep ? "text-white" : "text-gray-900"}`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              index === currentStep
                                ? "text-white/90"
                                : "text-gray-600"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {index < currentStep && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {index === currentStep && (
                            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Progress
                    value={((currentStep + 1) / demoSteps.length) * 100}
                    className="h-2"
                  />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Demo voortgang:{" "}
                    {Math.round(((currentStep + 1) / demoSteps.length) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Coach in Actie</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-900 font-medium animate-pulse">
                    {aiTips[currentTip]}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-purple-600">
                      AI Productiviteitscoach
                    </span>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">
                      Live coaching
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Demo */}
          <div className="space-y-6">
            {/* Focus Timer */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Live Focus Sessie</span>
                  </div>
                  <Badge
                    className={`${isPlaying ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {isPlaying ? "Actief" : "Gepauzeerd"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {formatTime(timer)}
                  </div>
                  <p className="text-gray-600">Demo Email Beantwoorden</p>
                </div>

                <div className="mb-6">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.round(progress)}% voltooid
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pauzeren
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Starten
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setTimer(1500);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    variant="outline"
                    size="lg"
                  >
                    <Timer className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Stats */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Live Statistieken</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((progress / 100) * 25)}
                    </div>
                    <p className="text-sm text-gray-600">Minuten gefocust</p>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <p className="text-sm text-gray-600">Focus kwaliteit</p>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <p className="text-sm text-gray-600">AI suggesties</p>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <p className="text-sm text-gray-600">Afleidingen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Complete */}
            {progress >= 100 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 animate-pulse">
                <CardContent className="text-center p-6">
                  <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-yellow-900 mb-2">
                    🎉 Gefeliciteerd!
                  </h3>
                  <p className="text-yellow-800 mb-4">
                    Je hebt je eerste focus sessie voltooid! Tijd voor een
                    verdiende pauze.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTimer(300); // 5 minute break
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Start Pauze
                    </Button>
                    <Button
                      onClick={() => navigate("/auth")}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Begin Nu!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Klaar om je productiviteit te revolutioneren?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Start je gratis proefperiode en ervaar het verschil van
                AI-gestuurde productiviteit
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  onClick={() => navigate("/auth")}
                  className="bg-white text-blue-600 font-bold hover:bg-gray-100"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start 14-Daagse Proef
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => navigate("/pricing")}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Bekijk Prijzen
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm opacity-75">
                <span>✅ Geen creditcard vereist</span>
                <span>✅ 14 dagen gratis</span>
                <span>✅ Cancel op elk moment</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Demo;
