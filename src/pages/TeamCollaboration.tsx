
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  ArrowLeft,
  Shield,
  Focus,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const TeamCollaboration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-focus-50 via-white to-zen-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("nav.team")}</h1>
              <p className="text-gray-600">Team samenwerking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Shield className="h-12 w-12 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("team.disabled")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("team.focusIndividual")}
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Focus className="h-5 w-5 text-primary" />
                Individuele Productiviteit
              </CardTitle>
              <CardDescription>
                Maximaliseer je persoonlijke focus en productiviteit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/focus")}
                  className="h-16 flex flex-col items-center space-y-1"
                >
                  <Focus className="h-6 w-6" />
                  <span>Start Focus Sessie</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/statistics")}
                  className="h-16 flex flex-col items-center space-y-1"
                >
                  <Users className="h-6 w-6" />
                  <span>Bekijk Statistieken</span>
                </Button>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Terug naar Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500 space-y-2">
            <p>
              💡 Focus op je eigen productiviteit voor de beste resultaten
            </p>
            <p>
              Gebruik de AI Coach voor persoonlijke begeleiding en tips
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;
