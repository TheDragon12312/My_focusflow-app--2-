import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    "introduction",
    "dataController", 
    "informationCollection",
    "useOfInformation",
    "dataSharing",
    "dataSecurity",
    "userRights",
    "changes",
    "contact",
  ];

  const renderList = (key: string) => {
    try {
      const list = t(`privacyPolicy.${key}.list`, { returnObjects: true });
      
      // Controleer of het daadwerkelijk een array is
      if (Array.isArray(list) && list.length > 0) {
        return (
          <ul className="list-disc pl-5 space-y-1 mt-3">
            {list.map((item: string, index: number) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      
      // Als het geen array is, return null
      return null;
    } catch (error) {
      console.error(`Error rendering list for ${key}:`, error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="dark:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">
            {t("privacyPolicy.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("privacyPolicy.title")}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("privacyPolicy.lastUpdated", { 
                date: new Date().toLocaleDateString("nl-NL", {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })
              })}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {sections.map((section) => (
              <div key={section} className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
                  {t(`privacyPolicy.${section}.title`)}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t(`privacyPolicy.${section}.content`)}
                </p>
                
                {/* Render lijst alleen als die bestaat */}
                {renderList(section)}
                
                {/* Extra content voor userRights */}
                {section === "userRights" && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                    {t(`privacyPolicy.${section}.content2`)}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
