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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Target,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  Users,
  Headphones,
  Book,
} from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      "Bericht verzonden! We nemen binnen 24 uur contact met je op.",
    );
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      category: "general",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email Support",
      description: "Stuur ons een bericht",
      contact: "focusflow@alwaysdata.net",
      availability: "24/7 - Response binnen 4 uur",
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Telefoon Support",
      description: "Bel voor directe hulp",
      contact: "+31 20 123 4567",
      availability: "Ma-Vr 9:00-18:00",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      title: "Live Chat",
      description: "Chat met onze experts",
      contact: "Chat starten",
      availability: "Ma-Vr 9:00-22:00",
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-600" />,
      title: "Kantoor Bezoek",
      description: "Kom langs in Amsterdam",
      contact: "Science Park 123, 1098 XG Amsterdam",
      availability: "Op afspraak",
    },
  ];

  const categories = [
    { value: "general", label: "Algemene Vragen" },
    { value: "technical", label: "Technische Support" },
    { value: "billing", label: "Facturatie & Abonnementen" },
    { value: "features", label: "Feature Verzoeken" },
    { value: "partnership", label: "Partnerships" },
    { value: "enterprise", label: "Enterprise Oplossingen" },
  ];

  const faqs = [
    {
      question: "Hoe snel kan ik beginnen met FocusFlow?",
      answer:
        "Je kunt direct starten! Registreer een gratis account en je hebt binnen 30 seconden toegang tot alle basisfeatures.",
    },
    {
      question: "Welke integraties zijn beschikbaar?",
      answer:
        "We integreren met Google Calendar, Outlook, Gmail, Slack, en meer dan 50 andere populaire tools die Nederlandse teams gebruiken.",
    },
    {
      question: "Is mijn data veilig?",
      answer:
        "Absoluut! We gebruiken enterprise-grade beveiliging en slaan alle data op in EU datacenters conform GDPR-richtlijnen.",
    },
    {
      question: "Kan ik FocusFlow proberen voordat ik betaal?",
      answer:
        "Ja! We bieden een 30-dagen gratis trial zonder creditcard vereiste. Alle Pro features zijn beschikbaar tijdens de trial.",
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
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Contact &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Heb je vragen over FocusFlow? Ons Nederlandse support team staat
            klaar om je te helpen. We reageren gemiddeld binnen 2 uur.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              97% Tevredenheid
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Clock className="h-4 w-4 mr-2" />
              &lt; 2 uur responstijd
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Users className="h-4 w-4 mr-2" />
              Nederlands Team
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Stuur ons een bericht
                </CardTitle>
                <CardDescription>
                  Vul het formulier in en we nemen zo snel mogelijk contact met
                  je op
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Naam *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Je volledige naam"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="je@bedrijf.nl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Bedrijf</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        placeholder="Je bedrijfsnaam"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categorie</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Onderwerp *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="Waar gaat je vraag over?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Bericht *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Beschrijf je vraag of probleem zo gedetailleerd mogelijk..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Bericht Versturen
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods & Info */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Contact Opties</CardTitle>
                <CardDescription>
                  Verschillende manieren om met ons in contact te komen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {method.icon}
                      <div className="flex-1">
                        <h3 className="font-semibold">{method.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          {method.contact}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method.availability}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Veelgestelde Vragen</CardTitle>
                <CardDescription>
                  Misschien staat je antwoord hier al
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h4 className="font-medium text-sm mb-2">{faq.question}</h4>
                    <p className="text-xs text-gray-600">{faq.answer}</p>
                  </div>
                ))}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/help")}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Volledige Help Center
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Headphones className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Premium Support</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enterprise klanten krijgen toegang tot dedicated support en
                    een persoonlijke account manager.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/pricing")}
                  >
                    Meer Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
