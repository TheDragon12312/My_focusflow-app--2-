
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, ArrowLeft, Wind, Zap, Heart, MapPin } from 'lucide-react';

const PauseMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const completedTask = location.state?.completedTask || 'Focustaak';
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minute break
  const [isActive, setIsActive] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const totalTime = 15 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const activities = [
    {
      id: 'breathing',
      name: 'Ademhalingsoefening',
      description: '4-7-8 ademhalingstechniek voor ontspanning',
      icon: Wind,
      duration: '3-5 min',
      color: 'text-blue-500'
    },
    {
      id: 'stretch',
      name: 'Korte stretches',
      description: 'Eenvoudige rekoefeningen voor nek en schouders',
      icon: Zap,
      duration: '5-10 min',
      color: 'text-green-500'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness moment',
      description: 'Korte meditatie om je gedachten te kalmeren',
      icon: Heart,
      duration: '5-10 min',
      color: 'text-purple-500'
    },
    {
      id: 'walk',
      name: 'Korte wandeling',
      description: 'Stap even naar buiten voor frisse lucht',
      icon: MapPin,
      duration: '10-15 min',
      color: 'text-orange-500'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast({
        title: "Pauze afgelopen! 🚀",
        description: "Tijd om weer aan de slag te gaan!",
      });
      navigate('/dashboard');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, navigate, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreak = () => {
    setIsActive(true);
    toast({
      title: "Pauze gestart! 🌟",
      description: "Neem even rust en laad jezelf op.",
    });
  };

  const skipBreak = () => {
    navigate('/dashboard');
  };

  const selectActivity = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const getActivityContent = () => {
    switch (selectedActivity) {
      case 'breathing':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse-gentle">🫁</div>
            <div className="space-y-2">
              <p className="font-medium">4-7-8 Ademhalingsoefening</p>
              <p className="text-sm text-gray-600">Adem 4 seconden in, houd 7 seconden vast, adem 8 seconden uit</p>
            </div>
          </div>
        );
      case 'stretch':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse-gentle">🤸‍♂️</div>
            <div className="space-y-2">
              <p className="font-medium">Korte Stretch Routine</p>
              <p className="text-sm text-gray-600">Rol je schouders, rek je nek en strek je armen</p>
            </div>
          </div>
        );
      case 'mindfulness':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse-gentle">🧘‍♀️</div>
            <div className="space-y-2">
              <p className="font-medium">Mindfulness Moment</p>
              <p className="text-sm text-gray-600">Sluit je ogen en focus op je ademhaling</p>
            </div>
          </div>
        );
      case 'walk':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse-gentle">🚶‍♂️</div>
            <div className="space-y-2">
              <p className="font-medium">Korte Wandeling</p>
              <p className="text-sm text-gray-600">Stap even naar buiten en geniet van de frisse lucht</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 via-white to-zen-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pauzemodus</h1>
              <p className="text-gray-600">Goed gedaan met: {completedTask}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Timer */}
        {!selectedActivity && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-zen-50 to-zen-100">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-4xl font-mono font-bold text-zen-600">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600">
                {isActive ? 'Pauze loopt...' : 'Pauze van 15 minuten'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Activity Selection or Content */}
        {!selectedActivity ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Kies een ontspanningsactiviteit
              </h2>
              <p className="text-gray-600">
                Of start gewoon je pauze timer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <Card 
                  key={activity.id}
                  className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => selectActivity(activity.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-3">
                      <activity.icon className={`h-6 w-6 ${activity.color}`} />
                      <span className="text-lg">{activity.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              {!isActive ? (
                <Button onClick={startBreak} size="lg" className="px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Start Pauze
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-zen-600 font-medium animate-pulse-gentle">
                    Pauze is actief... Ontspan! 🌱
                  </p>
                </div>
              )}
              <Button onClick={skipBreak} variant="outline" size="lg">
                Pauze Overslaan
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {getActivityContent()}
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setSelectedActivity(null)}
                variant="outline"
              >
                Terug naar keuze
              </Button>
              <Button onClick={skipBreak}>
                Doorgaan naar Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PauseMode;
