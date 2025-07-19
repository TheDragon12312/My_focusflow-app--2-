import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const TermsOfService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t("terms.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {t("terms.title")}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              {t("terms.lastUpdated")}: 27 juni 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.acceptance.title")}
              </h2>
              <p>{t("terms.acceptance.content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.services.title")}
              </h2>
              <p>{t("terms.services.content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.userAccounts.title")}
              </h2>
              <p>{t("terms.userAccounts.content")}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t("terms.userAccounts.responsibilities.accuracy")}</li>
                <li>{t("terms.userAccounts.responsibilities.security")}</li>
                <li>{t("terms.userAccounts.responsibilities.conduct")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.privacy.title")}
              </h2>
              <p>{t("terms.privacy.content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.subscriptions.title")}
              </h2>
              <p>{t("terms.subscriptions.content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.termination.title")}
              </h2>
              <p>{t("terms.termination.content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("terms.contact.title")}
              </h2>
              <p>{t("terms.contact.content")}</p>
              <p className="font-semibold mt-2">
                Email: focusflow@alwaysdata.net
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
