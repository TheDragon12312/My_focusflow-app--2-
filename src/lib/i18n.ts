export type Language = "nl" | "en" | "fr" | "de" | "es";

// Aangepaste interface die ook arrays en objecten ondersteunt
interface Translations {
  [key: string]: {
    [lang in Language]: string | string[] | any;
  };
}

const translations: Translations = {
  // Navigation
  "nav.dashboard": {
    nl: "Dashboard",
    en: "Dashboard",
    fr: "Tableau de bord",
    de: "Dashboard",
    es: "Panel",
  },
  "nav.focus": {
    nl: "Focus",
    en: "Focus",
    fr: "Focus",
    de: "Fokus",
    es: "Enfoque",
  },
  "nav.statistics": {
    nl: "Statistieken",
    en: "Statistics",
    fr: "Statistiques",
    de: "Statistiken",
    es: "Estadísticas",
  },
  "nav.settings": {
    nl: "Instellingen",
    en: "Settings",
    fr: "Paramètres",
    de: "Einstellungen",
    es: "Configuración",
  },
  "nav.team": {
    nl: "Team",
    en: "Team",
    fr: "Équipe",
    de: "Team",
    es: "Equipo",
  },

  // Focus Mode
  "focus.title": {
    nl: "Focus Mode",
    en: "Focus Mode",
    fr: "Mode Focus",
    de: "Fokus Modus",
    es: "Modo Enfoque",
  },
  "focus.task_placeholder": {
    nl: "Bijv. E-mails beantwoorden, Rapport schrijven, Coding...",
    en: "e.g. Answer emails, Write report, Coding...",
    fr: "ex. Répondre aux emails, Écrire un rapport, Programmation...",
    de: "z.B. E-Mails beantworten, Bericht schreiben, Programmieren...",
    es: "ej. Responder correos, Escribir informe, Programar...",
  },
  "focus.start_session": {
    nl: "Start Focus Sessie",
    en: "Start Focus Session",
    fr: "Démarrer la session",
    de: "Fokus-Sitzung starten",
    es: "Iniciar sesión",
  },
  "focus.custom_time": {
    nl: "🎯 Custom (eigen tijd)",
    en: "🎯 Custom (your time)",
    fr: "🎯 Personnalisé (votre temps)",
    de: "🎯 Benutzerdefiniert (Ihre Zeit)",
    es: "🎯 Personalizado (tu tiempo)",
  },
  "focus.minutes_label": {
    nl: "Aantal minuten (5-180):",
    en: "Number of minutes (5-180):",
    fr: "Nombre de minutes (5-180):",
    de: "Anzahl Minuten (5-180):",
    es: "Número de minutos (5-180):",
  },

  // Settings
  "settings.title": {
    nl: "Instellingen",
    en: "Settings",
    fr: "Paramètres",
    de: "Einstellungen",
    es: "Configuración",
  },
  "settings.language": {
    nl: "Taal",
    en: "Language",
    fr: "Langue",
    de: "Sprache",
    es: "Idioma",
  },
  "settings.theme": {
    nl: "Thema",
    en: "Theme",
    fr: "Thème",
    de: "Design",
    es: "Tema",
  },
  "settings.compact_mode": {
    nl: "Compacte Modus",
    en: "Compact Mode",
    fr: "Mode Compact",
    de: "Kompakt-Modus",
    es: "Modo Compacto",
  },
  "settings.compact_mode_desc": {
    nl: "Gebruik minder ruimte voor een dichtere interface",
    en: "Use less space for a denser interface",
    fr: "Utiliser moins d'espace pour une interface plus dense",
    de: "Weniger Platz für eine dichtere Oberfläche verwenden",
    es: "Usar menos espacio para una interfaz más densa",
  },

  // Theme options
  "theme.light": {
    nl: "🌞 Licht",
    en: "🌞 Light",
    fr: "🌞 Clair",
    de: "🌞 Hell",
    es: "🌞 Claro",
  },
  "theme.dark": {
    nl: "🌙 Donker",
    en: "🌙 Dark",
    fr: "🌙 Sombre",
    de: "🌙 Dunkel",
    es: "🌙 Oscuro",
  },
  "theme.auto": {
    nl: "🔄 Automatisch",
    en: "🔄 Automatic",
    fr: "🔄 Automatique",
    de: "🔄 Automatisch",
    es: "🔄 Automático",
  },

  // Language options
  "lang.nl": {
    nl: "🇳🇱 Nederlands",
    en: "🇳🇱 Dutch",
    fr: "🇳🇱 Néerlandais",
    de: "🇳🇱 Niederländisch",
    es: "🇳🇱 Holandés",
  },
  "lang.en": {
    nl: "🇺🇸 Engels",
    en: "🇺🇸 English",
    fr: "🇺🇸 Anglais",
    de: "🇺🇸 Englisch",
    es: "🇺🇸 Inglés",
  },
  "lang.fr": {
    nl: "🇫🇷 Frans",
    en: "🇫🇷 French",
    fr: "🇫🇷 Français",
    de: "🇫🇷 Französisch",
    es: "🇫🇷 Francés",
  },
  "lang.de": {
    nl: "🇩🇪 Duits",
    en: "🇩🇪 German",
    fr: "🇩🇪 Allemand",
    de: "🇩🇪 Deutsch",
    es: "🇩🇪 Alemán",
  },
  "lang.es": {
    nl: "🇪🇸 Spaans",
    en: "🇪🇸 Spanish",
    fr: "🇪🇸 Espagnol",
    de: "🇪🇸 Spanisch",
    es: "🇪🇸 Español",
  },

  // Common
  "common.save": {
    nl: "Opslaan",
    en: "Save",
    fr: "Enregistrer",
    de: "Speichern",
    es: "Guardar",
  },
  "common.cancel": {
    nl: "Annuleren",
    en: "Cancel",
    fr: "Annuler",
    de: "Abbrechen",
    es: "Cancelar",
  },
  "common.back": {
    nl: "Terug",
    en: "Back",
    fr: "Retour",
    de: "Zurück",
    es: "Volver",
  },

  // Welcome messages
  "welcome.title": {
    nl: "Welkom bij FocusFlow",
    en: "Welcome to FocusFlow",
    fr: "Bienvenue dans FocusFlow",
    de: "Willkommen bei FocusFlow",
    es: "Bienvenido a FocusFlow",
  },
  "welcome.subtitle": {
    nl: "Je productiviteitspartner voor diepere focus",
    en: "Your productivity partner for deeper focus",
    fr: "Votre partenaire de productivité pour une concentration plus profonde",
    de: "Ihr Produktivitätspartner für tiefere Konzentration",
    es: "Tu compañero de productividad para un enfoque más profundo",
  },

  // Terms of Service
  "terms.title": {
    nl: "Algemene Voorwaarden",
    en: "Terms of Service",
    fr: "Conditions d'utilisation",
    de: "Nutzungsbedingungen",
    es: "Términos de Servicio",
  },
  "terms.lastUpdated": {
    nl: "Laatst bijgewerkt",
    en: "Last updated",
    fr: "Dernière mise à jour",
    de: "Zuletzt aktualisiert",
    es: "Última actualización",
  },
  "terms.acceptance.title": {
    nl: "Acceptatie van Voorwaarden",
    en: "Acceptance of Terms",
    fr: "Acceptation des Conditions",
    de: "Annahme der Bedingungen",
    es: "Aceptación de Términos",
  },
  "terms.acceptance.content": {
    nl: "Door toegang te krijgen tot en gebruik te maken van FocusFlow, gaat u akkoord met deze algemene voorwaarden. Als u niet akkoord gaat met een van deze voorwaarden, mag u onze service niet gebruiken.",
    en: "By accessing and using FocusFlow, you agree to be bound by these Terms of Service. If you do not agree to any of these terms, you may not use our service.",
    fr: "En accédant et en utilisant FocusFlow, vous acceptez d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas l'une de ces conditions, vous ne pouvez pas utiliser notre service.",
    de: "Durch den Zugriff auf und die Nutzung von FocusFlow stimmen Sie zu, an diese Nutzungsbedingungen gebunden zu sein. Wenn Sie mit einer dieser Bedingungen nicht einverstanden sind, dürfen Sie unseren Service nicht nutzen.",
    es: "Al acceder y usar FocusFlow, acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no puede usar nuestro servicio.",
  },

  // PRIVACY POLICY - Toegevoegd in jouw platte stijl
  "privacyPolicy.title": {
    nl: "Privacybeleid voor FocusFlow",
    en: "Privacy Policy for FocusFlow",
    fr: "Politique de confidentialité pour FocusFlow",
    de: "Datenschutz-Bestimmungen für FocusFlow",
    es: "Política de privacidad para FocusFlow",
  },
  "privacyPolicy.lastUpdated": {
    nl: "Laatst bijgewerkt op {{date}}",
    en: "Last updated on {{date}}",
    fr: "Dernière mise à jour le {{date}}",
    de: "Zuletzt aktualisiert am {{date}}",
    es: "Última actualización el {{date}}",
  },
  "privacyPolicy.introduction.title": {
    nl: "1. Introductie",
    en: "1. Introduction",
    fr: "1. Introduction",
    de: "1. Einführung",
    es: "1. Introducción",
  },
  "privacyPolicy.introduction.content": {
    nl: "Welkom bij FocusFlow. Uw privacy is van groot belang voor ons. Dit privacybeleid legt uit welke persoonlijke gegevens we verzamelen, hoe we deze gebruiken en beschermen, en welke rechten u heeft met betrekking tot uw gegevens wanneer u onze applicatie en diensten ('Service') gebruikt.",
    en: "Welcome to FocusFlow. Your privacy is critically important to us. This privacy policy explains what personal data we collect, how we use and protect it, and what rights you have regarding your data when you use our application and services ('Service').",
    fr: "Bienvenue chez FocusFlow. Votre vie privée est d'une importance cruciale pour nous. Cette politique de confidentialité explique quelles données personnelles nous collectons, comment nous les utilisons et les protégeons, et quels droits vous avez concernant vos données lors de l'utilisation de notre application et services ('Service').",
    de: "Willkommen bei FocusFlow. Ihre Privatsphäre ist für uns von größter Bedeutung. Diese Datenschutzrichtlinie erklärt, welche persönlichen Daten wir sammeln, wie wir sie verwenden und schützen, und welche Rechte Sie bezüglich Ihrer Daten haben, wenn Sie unsere Anwendung und Dienste ('Service') nutzen.",
    es: "Bienvenido a FocusFlow. Su privacidad es de suma importancia para nosotros. Esta política de privacidad explica qué datos personales recopilamos, cómo los usamos y protegemos, y qué derechos tiene con respecto a sus datos cuando usa nuestra aplicación y servicios ('Servicio').",
  },
  "privacyPolicy.dataController.title": {
    nl: "2. Verwerkingsverantwoordelijke",
    en: "2. Data Controller",
    fr: "2. Responsable du traitement",
    de: "2. Datenverantwortlicher",
    es: "2. Controlador de datos",
  },
  "privacyPolicy.dataController.content": {
    nl: "FocusFlow, gevestigd te [Jouw Vestigingsplaats, Land], is de verwerkingsverantwoordelijke voor de persoonsgegevens die via deze Service worden verzameld.",
    en: "FocusFlow, located at [Your Location, Country], is the data controller for the personal data collected through this Service.",
    fr: "FocusFlow, situé à [Votre emplacement, Pays], est le responsable du traitement des données personnelles collectées via ce Service.",
    de: "FocusFlow, ansässig in [Ihr Standort, Land], ist der Datenverantwortliche für die über diesen Service gesammelten personenbezogenen Daten.",
    es: "FocusFlow, ubicado en [Su ubicación, País], es el controlador de datos para los datos personales recopilados a través de este Servicio.",
  },
  "privacyPolicy.informationCollection.title": {
    nl: "3. Welke informatie verzamelen we?",
    en: "3. What Information Do We Collect?",
    fr: "3. Quelles informations collectons-nous?",
    de: "3. Welche Informationen sammeln wir?",
    es: "3. ¿Qué información recopilamos?",
  },
  "privacyPolicy.informationCollection.content": {
    nl: "Om onze Service te leveren en te verbeteren, verzamelen we de volgende soorten informatie:",
    en: "To provide and improve our Service, we collect the following types of information:",
    fr: "Pour fournir et améliorer notre Service, nous collectons les types d'informations suivants:",
    de: "Um unseren Service bereitzustellen und zu verbessern, sammeln wir folgende Arten von Informationen:",
    es: "Para proporcionar y mejorar nuestro Servicio, recopilamos los siguientes tipos de información:",
  },
  "privacyPolicy.informationCollection.list": {
    nl: [
      "Persoonlijke identificeerbare informatie (naam, e-mailadres)",
      "Wachtwoorden (versleuteld opgeslagen)",
      "Gebruiksgegevens (focussessies, productiviteitsscores)",
      "Google Calendar en Gmail gegevens (alleen met uw toestemming)",
      "Apparaat- en browserinformatie"
    ],
    en: [
      "Personal identifiable information (name, email address)",
      "Passwords (stored encrypted)",
      "Usage data (focus sessions, productivity scores)",
      "Google Calendar and Gmail data (only with your consent)",
      "Device and browser information"
    ],
    fr: [
      "Informations personnelles identifiables (nom, adresse e-mail)",
      "Mots de passe (stockés cryptés)",
      "Données d'utilisation (sessions de concentration, scores de productivité)",
      "Données Google Calendar et Gmail (seulement avec votre consentement)",
      "Informations sur l'appareil et le navigateur"
    ],
    de: [
      "Persönlich identifizierbare Informationen (Name, E-Mail-Adresse)",
      "Passwörter (verschlüsselt gespeichert)",
      "Nutzungsdaten (Fokussitzungen, Produktivitätswerte)",
      "Google Calendar und Gmail Daten (nur mit Ihrer Zustimmung)",
      "Geräte- und Browserinformationen"
    ],
    es: [
      "Información personal identificable (nombre, dirección de correo electrónico)",
      "Contraseñas (almacenadas encriptadas)",
      "Datos de uso (sesiones de enfoque, puntuaciones de productividad)",
      "Datos de Google Calendar y Gmail (solo con su consentimiento)",
      "Información del dispositivo y navegador"
    ]
  },
  "privacyPolicy.useOfInformation.title": {
    nl: "4. Hoe gebruiken we uw informatie?",
    en: "4. How Do We Use Your Information?",
    fr: "4. Comment utilisons-nous vos informations?",
    de: "4. Wie verwenden wir Ihre Informationen?",
    es: "4. ¿Cómo usamos su información?",
  },
  "privacyPolicy.useOfInformation.content": {
    nl: "We gebruiken de verzamelde gegevens voor de volgende doeleinden:",
    en: "We use the collected data for the following purposes:",
    fr: "Nous utilisons les données collectées aux fins suivantes:",
    de: "Wir verwenden die gesammelten Daten für folgende Zwecke:",
    es: "Utilizamos los datos recopilados para los siguientes propósitos:",
  },
  "privacyPolicy.useOfInformation.list": {
    nl: [
      "Om de FocusFlow Service te leveren, onderhouden en personaliseren",
      "Om Google Calendar en Gmail integraties mogelijk te maken",
      "Om u productiviteitsinzichten en -statistieken te bieden",
      "Om met u te communiceren over uw account en service-updates",
      "Om onze Service te analyseren en te verbeteren",
      "Om technische problemen op te sporen, te voorkomen en aan te pakken"
    ],
    en: [
      "To provide, maintain, and personalize the FocusFlow Service",
      "To enable Google Calendar and Gmail integrations",
      "To provide you with productivity insights and statistics",
      "To communicate with you about your account and service updates",
      "To analyze and improve our Service",
      "To detect, prevent, and address technical issues"
    ],
    fr: [
      "Pour fournir, maintenir et personnaliser le Service FocusFlow",
      "Pour permettre les intégrations Google Calendar et Gmail",
      "Pour vous fournir des informations et statistiques de productivité",
      "Pour communiquer avec vous au sujet de votre compte et des mises à jour du service",
      "Pour analyser et améliorer notre Service",
      "Pour détecter, prévenir et résoudre les problèmes techniques"
    ],
    de: [
      "Um den FocusFlow Service bereitzustellen, zu warten und zu personalisieren",
      "Um Google Calendar und Gmail Integrationen zu ermöglichen",
      "Um Ihnen Produktivitätseinblicke und -statistiken zu bieten",
      "Um mit Ihnen über Ihr Konto und Service-Updates zu kommunizieren",
      "Um unseren Service zu analysieren und zu verbessern",
      "Um technische Probleme zu erkennen, zu verhindern und zu beheben"
    ],
    es: [
      "Para proporcionar, mantener y personalizar el Servicio FocusFlow",
      "Para habilitar las integraciones de Google Calendar y Gmail",
      "Para proporcionarle información y estadísticas de productividad",
      "Para comunicarnos con usted sobre su cuenta y actualizaciones del servicio",
      "Para analizar y mejorar nuestro Servicio",
      "Para detectar, prevenir y abordar problemas técnicos"
    ]
  },
  "privacyPolicy.dataSharing.title": {
    nl: "5. Delen en openbaarmaking van gegevens",
    en: "5. Data Sharing and Disclosure",
    fr: "5. Partage et divulgation des données",
    de: "5. Datenweitergabe und -offenlegung",
    es: "5. Compartir y divulgación de datos",
  },
  "privacyPolicy.dataSharing.content": {
    nl: "Wij verkopen, verhandelen of verhuren uw persoonlijke gegevens niet aan derden. We kunnen uw gegevens alleen delen in de volgende beperkte omstandigheden:",
    en: "We do not sell, trade, or rent your personal data to third parties. We may share your data only in the following limited circumstances:",
    fr: "Nous ne vendons, n'échangeons ou ne louons pas vos données personnelles à des tiers. Nous ne pouvons partager vos données que dans les circonstances limitées suivantes:",
    de: "Wir verkaufen, handeln oder vermieten Ihre persönlichen Daten nicht an Dritte. Wir können Ihre Daten nur unter folgenden begrenzten Umständen weitergeben:",
    es: "No vendemos, intercambiamos o alquilamos sus datos personales a terceros. Solo podemos compartir sus datos en las siguientes circunstancias limitadas:",
  },
  "privacyPolicy.dataSharing.list": {
    nl: [
      "Met serviceproviders: Supabase (database), OpenRouter (AI Coach) die contractueel verplicht zijn uw gegevens te beschermen",
      "Voor wettelijke verplichtingen: Wanneer dit wettelijk vereist is",
      "Met uw toestemming: Voor andere doeleinden met uw expliciete toestemming"
    ],
    en: [
      "With service providers: Supabase (database), OpenRouter (AI Coach) who are contractually obligated to protect your data",
      "For legal obligations: When required by law",
      "With your consent: For other purposes with your explicit consent"
    ],
    fr: [
      "Avec les fournisseurs de services: Supabase (base de données), OpenRouter (AI Coach) qui sont contractuellement obligés de protéger vos données",
      "Pour les obligations légales: Lorsque requis par la loi",
      "Avec votre consentement: Pour d'autres fins avec votre consentement explicite"
    ],
    de: [
      "Mit Dienstanbietern: Supabase (Datenbank), OpenRouter (AI Coach), die vertraglich verpflichtet sind, Ihre Daten zu schützen",
      "Für rechtliche Verpflichtungen: Wenn gesetzlich vorgeschrieben",
      "Mit Ihrer Zustimmung: Für andere Zwecke mit Ihrer ausdrücklichen Zustimmung"
    ],
    es: [
      "Con proveedores de servicios: Supabase (base de datos), OpenRouter (AI Coach) que están contractualmente obligados a proteger sus datos",
      "Para obligaciones legales: Cuando sea requerido por ley",
      "Con su consentimiento: Para otros propósitos con su consentimiento explícito"
    ]
  },
  "privacyPolicy.dataSecurity.title": {
    nl: "6. Gegevensbeveiliging",
    en: "6. Data Security",
    fr: "6. Sécurité des données",
    de: "6. Datensicherheit",
    es: "6. Seguridad de datos",
  },
  "privacyPolicy.dataSecurity.content": {
    nl: "We nemen de beveiliging van uw gegevens zeer serieus en implementeren technische en organisatorische maatregelen om deze te beschermen. Dit omvat versleuteling van gegevens in rust en tijdens overdracht, en het gebruik van Row Level Security (RLS) in onze database. Desondanks is geen enkele methode van overdracht via internet 100% veilig.",
    en: "We take the security of your data very seriously and implement technical and organizational measures to protect it. This includes data encryption at rest and in transit, and the use of Row Level Security (RLS) in our database. Nevertheless, no method of transmission over the internet is 100% secure.",
    fr: "Nous prenons la sécurité de vos données très au sérieux et mettons en œuvre des mesures techniques et organisationnelles pour les protéger. Cela inclut le chiffrement des données au repos et en transit, et l'utilisation de la sécurité au niveau des lignes (RLS) dans notre base de données. Néanmoins, aucune méthode de transmission sur internet n'est sécurisée à 100%.",
    de: "Wir nehmen die Sicherheit Ihrer Daten sehr ernst und implementieren technische und organisatorische Maßnahmen zu deren Schutz. Dies umfasst Datenverschlüsselung im Ruhezustand und während der Übertragung sowie die Verwendung von Row Level Security (RLS) in unserer Datenbank. Dennoch ist keine Übertragungsmethode über das Internet 100% sicher.",
    es: "Tomamos muy en serio la seguridad de sus datos e implementamos medidas técnicas y organizacionales para protegerlos. Esto incluye cifrado de datos en reposo y en tránsito, y el uso de Seguridad a Nivel de Fila (RLS) en nuestra base de datos. Sin embargo, ningún método de transmisión por internet es 100% seguro.",
  },
  "privacyPolicy.userRights.title": {
    nl: "7. Uw Rechten (GDPR)",
    en: "7. Your Rights (GDPR)",
    fr: "7. Vos droits (RGPD)",
    de: "7. Ihre Rechte (DSGVO)",
    es: "7. Sus derechos (GDPR)",
  },
  "privacyPolicy.userRights.content": {
    nl: "U heeft de volgende rechten met betrekking tot uw persoonsgegevens:",
    en: "You have the following rights regarding your personal data:",
    fr: "Vous avez les droits suivants concernant vos données personnelles:",
    de: "Sie haben folgende Rechte bezüglich Ihrer persönlichen Daten:",
    es: "Tiene los siguientes derechos con respecto a sus datos personales:",
  },
  "privacyPolicy.userRights.list": {
    nl: [
      "Recht op inzage: U kunt een kopie opvragen van de gegevens die we over u hebben",
      "Recht op rectificatie: U kunt onjuiste of onvolledige gegevens laten corrigeren",
      "Recht op wissing ('recht om vergeten te worden'): U kunt ons vragen uw gegevens te verwijderen",
      "Recht op beperking van de verwerking: U kunt ons vragen de verwerking van uw gegevens te beperken",
      "Recht op overdraagbaarheid van gegevens: U kunt uw gegevens opvragen in een gestructureerd formaat",
      "Recht van bezwaar: U kunt bezwaar maken tegen de verwerking van uw gegevens"
    ],
    en: [
      "Right to access: You can request a copy of the data we hold about you",
      "Right to rectification: You can have incorrect or incomplete data corrected",
      "Right to erasure ('right to be forgotten'): You can ask us to delete your data",
      "Right to restrict processing: You can ask us to limit the processing of your data",
      "Right to data portability: You can request your data in a structured format",
      "Right to object: You can object to the processing of your data"
    ],
    fr: [
      "Droit d'accès: Vous pouvez demander une copie des données que nous détenons sur vous",
      "Droit de rectification: Vous pouvez faire corriger des données incorrectes ou incomplètes",
      "Droit à l'effacement ('droit à l'oubli'): Vous pouvez nous demander de supprimer vos données",
      "Droit de limitation du traitement: Vous pouvez nous demander de limiter le traitement de vos données",
      "Droit à la portabilité des données: Vous pouvez demander vos données dans un format structuré",
      "Droit d'opposition: Vous pouvez vous opposer au traitement de vos données"
    ],
    de: [
      "Recht auf Zugang: Sie können eine Kopie der Daten anfordern, die wir über Sie haben",
      "Recht auf Berichtigung: Sie können falsche oder unvollständige Daten korrigieren lassen",
      "Recht auf Löschung ('Recht auf Vergessenwerden'): Sie können uns bitten, Ihre Daten zu löschen",
      "Recht auf Einschränkung der Verarbeitung: Sie können uns bitten, die Verarbeitung Ihrer Daten zu beschränken",
      "Recht auf Datenübertragbarkeit: Sie können Ihre Daten in einem strukturierten Format anfordern",
      "Widerspruchsrecht: Sie können der Verarbeitung Ihrer Daten widersprechen"
    ],
    es: [
      "Derecho de acceso: Puede solicitar una copia de los datos que tenemos sobre usted",
      "Derecho de rectificación: Puede hacer corregir datos incorrectos o incompletos",
      "Derecho de supresión ('derecho al olvido'): Puede pedirnos que eliminemos sus datos",
      "Derecho a la limitación del tratamiento: Puede pedirnos que limitemos el procesamiento de sus datos",
      "Derecho a la portabilidad de datos: Puede solicitar sus datos en un formato estructurado",
      "Derecho de oposición: Puede oponerse al procesamiento de sus datos"
    ]
  },
  "privacyPolicy.userRights.content2": {
    nl: "Om deze rechten uit te oefenen, kunt u contact met ons opnemen via de onderstaande contactgegevens.",
    en: "To exercise these rights, please contact us via the contact details below.",
    fr: "Pour exercer ces droits, veuillez nous contacter via les coordonnées ci-dessous.",
    de: "Um diese Rechte auszuüben, kontaktieren Sie uns bitte über die unten stehenden Kontaktdaten.",
    es: "Para ejercer estos derechos, contáctenos a través de los datos de contacto a continuación.",
  },
  "privacyPolicy.changes.title": {
    nl: "8. Wijzigingen in dit Privacybeleid",
    en: "8. Changes to This Privacy Policy",
    fr: "8. Modifications de cette politique de confidentialité",
    de: "8. Änderungen an dieser Datenschutzrichtlinie",
    es: "8. Cambios a esta política de privacidad",
  },
  "privacyPolicy.changes.content": {
    nl: "We kunnen ons privacybeleid van tijd tot tijd bijwerken. We zullen u op de hoogte stellen van eventuele wijzigingen door het nieuwe privacybeleid op deze pagina te publiceren en de 'laatst bijgewerkt' datum aan te passen. We raden u aan om dit privacybeleid periodiek te controleren op eventuele wijzigingen.",
    en: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'last updated' date. You are advised to review this Privacy Policy periodically for any changes.",
    fr: "Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page et en mettant à jour la date de 'dernière mise à jour'. Il vous est conseillé de consulter périodiquement cette politique de confidentialité pour tout changement.",
    de: "Wir können unsere Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Datenschutzrichtlinie auf dieser Seite veröffentlichen und das Datum der 'letzten Aktualisierung' ändern. Es wird empfohlen, diese Datenschutzrichtlinie regelmäßig auf Änderungen zu überprüfen.",
    es: "Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de 'última actualización'. Se le aconseja revisar periódicamente esta Política de Privacidad para cualquier cambio.",
  },
  "privacyPolicy.contact.title": {
    nl: "9. Contact opnemen",
    en: "9. Contact Us",
    fr: "9. Nous contacter",
    de: "9. Kontaktieren Sie uns",
    es: "9. Contáctanos",
  },
  "privacyPolicy.contact.content": {
    nl: "Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via: focusflow@alwaysdata.net",
    en: "If you have any questions about this Privacy Policy, please contact us at: focusflow@alwaysdata.net",
    fr: "Si vous avez des questions sur cette politique de confidentialité, veuillez nous contacter à: focusflow@alwaysdata.net",
    de: "Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter: focusflow@alwaysdata.net",
    es: "Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en: focusflow@alwaysdata.net",
  },

  // ... al je andere bestaande vertalingen blijven hetzelfde ...

  // AI Coach translations
  "aiCoach.title": {
    nl: "AI Productiviteitscoach",
    en: "AI Productivity Coach",
    fr: "Coach de Productivité IA",
    de: "KI-Produktivitätscoach",
    es: "Entrenador de Productividad IA",
  },
  "aiCoach.welcome": {
    nl: "Hallo! Ik ben je persoonlijke AI productiviteitscoach. Ik help je om gefocust te blijven en je doelen te bereiken. Hoe kan ik je vandaag helpen?",
    en: "Hello! I'm your personal AI productivity coach. I help you stay focused and achieve your goals. How can I help you today?",
    fr: "Bonjour ! Je suis votre coach personnel de productivité IA. Je vous aide à rester concentré et à atteindre vos objectifs. Comment puis-je vous aider aujourd'hui ?",
    de: "Hallo! Ich bin Ihr persönlicher KI-Produktivitätscoach. Ich helfe Ihnen, fokussiert zu bleiben und Ihre Ziele zu erreichen. Wie kann ich Ihnen heute helfen?",
    es: "¡Hola! Soy tu entrenador personal de productividad IA. Te ayudo a mantenerte enfocado y lograr tus objetivos. ¿Cómo puedo ayudarte hoy?",
  },
  "aiCoach.inputPlaceholder": {
    nl: "Vraag me iets over productiviteit...",
    en: "Ask me something about productivity...",
    fr: "Demandez-moi quelque chose sur la productivité...",
    de: "Fragen Sie mich etwas über Produktivität...",
    es: "Pregúntame algo sobre productividad...",
  },
  "aiCoach.error": {
    nl: "Er ging iets mis bij het genereren van een antwoord.",
    en: "Something went wrong generating a response.",
    fr: "Quelque chose s'est mal passé lors de la génération d'une réponse.",
    de: "Beim Generieren einer Antwort ist etwas schief gelaufen.",
    es: "Algo salió mal al generar una respuesta.",
  },

  // Calendar Integration
  "calendar.integration": {
    nl: "Agenda Integratie",
    en: "Calendar Integration",
    fr: "Intégration du Calendrier",
    de: "Kalender-Integration",
    es: "Integración de Calendario",
  },
  "calendar.connectGoogle": {
    nl: "Verbinden met Google Agenda",
    en: "Connect to Google Calendar",
    fr: "Connecter à Google Agenda",
    de: "Mit Google Kalender verbinden",
    es: "Conectar con Google Calendar",
  },
  "calendar.importEvents": {
    nl: "Afspraken Importeren",
    en: "Import Events",
    fr: "Importer des Événements",
    de: "Termine Importieren",
    es: "Importar Eventos",
  },
  "calendar.connected": {
    nl: "Verbonden met Google Agenda",
    en: "Connected to Google Calendar",
    fr: "Connecté à Google Agenda",
    de: "Mit Google Kalender verbunden",
    es: "Conectado con Google Calendar",
  },

  // Team Collaboration - Disabled messages
  "team.disabled": {
    nl: "Team functionaliteit is momenteel uitgeschakeld.",
    en: "Team functionality is currently disabled.",
    fr: "La fonctionnalité d'équipe est actuellement désactivée.",
    de: "Team-Funktionalität ist derzeit deaktiviert.",
    es: "La funcionalidad de equipo está actualmente deshabilitada.",
  },
  "team.focusIndividual": {
    nl: "Focus op individuele productiviteit voor nu.",
    en: "Focus on individual productivity for now.",
    fr: "Concentrez-vous sur la productivité individuelle pour l'instant.",
    de: "Konzentrieren Sie sich vorerst auf individuelle Produktivität.",
    es: "Concéntrate en la productividad individual por ahora.",
  },

  // Dashboard translations
  "dashboard.title": {
    nl: "Dashboard",
    en: "Dashboard",
    fr: "Tableau de bord",
    de: "Dashboard",
    es: "Panel de control",
  },
  "dashboard.welcome": {
    nl: "Welkom terug",
    en: "Welcome back",
    fr: "Bon retour",
    de: "Willkommen zurück",
    es: "Bienvenido de vuelta",
  },
  "dashboard.focusScore": {
    nl: "Dagscore Focus",
    en: "Daily Focus Score",
    fr: "Score de concentration quotidien",
    de: "Täglicher Fokus-Score",
    es: "Puntuación diaria de enfoque",
  },
  "dashboard.focusBlocksCompleted": {
    nl: "Focusblokken voltooid",
    en: "Focus blocks completed",
    fr: "Blocs de concentration terminés",
    de: "Fokusblöcke abgeschlossen",
    es: "Bloques de enfoque completados",
  },
  "dashboard.workTimeToday": {
    nl: "Werktijd vandaag",
    en: "Work time today",
    fr: "Temps de travail aujourd'hui",
    de: "Arbeitszeit heute",
    es: "Tiempo de trabajo hoy",
  },
  "dashboard.distractionNotifications": {
    nl: "Afleidingsmeldingen",
    en: "Distraction notifications",
    fr: "Notifications de distraction",
    de: "Ablenkungsbenachrichtigungen",
    es: "Notificaciones de distracción",
  },
  "dashboard.integrations": {
    nl: "Integraties",
    en: "Integrations",
    fr: "Intégrations",
    de: "Integrationen",
    es: "Integraciones",
  },
  "dashboard.currentSession": {
    nl: "Huidige Sessie",
    en: "Current Session",
    fr: "Session actuelle",
    de: "Aktuelle Sitzung",
    es: "Sesión actual",
  },
  "dashboard.dailyPlanning": {
    nl: "Dagplanning",
    en: "Daily Planning",
    fr: "Planification quotidienne",
    de: "Tagesplanung",
    es: "Planificación diaria",
  },
  "dashboard.startSession": {
    nl: "Start Sessie",
    en: "Start Session",
    fr: "Démarrer la session",
    de: "Sitzung starten",
    es: "Iniciar sesión",
  },
  "dashboard.allTasksCompleted": {
    nl: "Alle taken voltooid! 🎉",
    en: "All tasks completed! 🎉",
    fr: "Toutes les tâches terminées ! 🎉",
    de: "Alle Aufgaben erledigt! 🎉",
    es: "¡Todas las tareas completadas! 🎉",
  },
  "dashboard.planNewTasks": {
    nl: "Nieuwe taken plannen",
    en: "Plan new tasks",
    fr: "Planifier de nouvelles tâches",
    de: "Neue Aufgaben planen",
    es: "Planificar nuevas tareas",
  },

  // Statistics translations
  "stats.title": {
    nl: "Statistieken",
    en: "Statistics",
    fr: "Statistiques",
    de: "Statistiken",
    es: "Estadísticas",
  },
  "stats.todayFocus": {
    nl: "Vandaag Focus",
    en: "Today's Focus",
    fr: "Concentration d'aujourd'hui",
    de: "Heutiger Fokus",
    es: "Enfoque de hoy",
  },
  "stats.weeklyOverview": {
    nl: "Weekoverzicht",
    en: "Weekly Overview",
    fr: "Aperçu hebdomadaire",
    de: "Wochenübersicht",
    es: "Resumen semanal",
  },
  "stats.productivity": {
    nl: "Productiviteit",
    en: "Productivity",
    fr: "Productivité",
    de: "Produktivität",
    es: "Productividad",
  },

  // Landing Page translations
  "landing.features": {
    nl: "Functies",
    en: "Features",
    fr: "Fonctionnalités",
    de: "Funktionen",
    es: "Características",
  },
  "landing.pricing": {
    nl: "Prijzen",
    en: "Pricing",
    fr: "Tarifs",
    de: "Preise",
    es: "Precios",
  },
  "landing.about": {
    nl: "Over ons",
    en: "About",
    fr: "À propos",
    de: "Über uns",
    es: "Acerca de",
  },
  "landing.contact": {
    nl: "Contact",
    en: "Contact",
    fr: "Contact",
    de: "Kontakt",
    es: "Contacto",
  },
  "landing.signIn": {
    nl: "Inloggen",
    en: "Sign In",
    fr: "Se connecter",
    de: "Anmelden",
    es: "Iniciar sesión",
  },
  "landing.getStartedFree": {
    nl: "Gratis beginnen",
    en: "Get Started Free",
    fr: "Commencer gratuitement",
    de: "Kostenlos starten",
    es: "Comenzar gratis",
  },
  "landing.topApp2024": {
    nl: "#1 Productiviteitsapp van 2024 🏆",
    en: "#1 Productivity App of 2024 🏆",
    fr: "App de productivité #1 de 2024 🏆",
    de: "#1 Produktivitäts-App von 2024 🏆",
    es: "App de productividad #1 de 2024 🏆",
  },
  "landing.heroTitle": {
    nl: "Transformeer Je",
    en: "Transform Your",
    fr: "Transformez Votre",
    de: "Verwandeln Sie Ihre",
    es: "Transforma Tu",
  },
  "landing.heroTitleSpan": {
    nl: "Productiviteit Voor Altijd",
    en: "Productivity Forever",
    fr: "Productivité Pour Toujours",
    de: "Produktivität Für Immer",
    es: "Productividad Para Siempre",
  },
  "landing.heroDescription": {
    nl: "Beheers diepe focus met AI-gestuurde coaching, slimme afleidingsblokkering en naadloze teamcollaboratie. Sluit je aan bij",
    en: "Master deep focus with AI-powered coaching, smart distraction blocking, and seamless team collaboration. Join",
    fr: "Maîtrisez la concentration profonde avec un coaching alimenté par l'IA, un blocage intelligent des distractions et une collaboration d'équipe fluide. Rejoignez",
    de: "Meistern Sie tiefen Fokus mit KI-gestütztem Coaching, intelligenter Ablenkungsblockierung und nahtloser Teamzusammenarbeit. Schließen Sie sich",
    es: "Domina la concentración profunda con coaching impulsado por IA, bloqueo inteligente de distracciones y colaboración en equipo perfecta. Únete a",
  },
  "landing.heroDescriptionEnd": {
    nl: "+ professionals die dagelijks hun productiviteit verhogen.",
    en: "+ professionals boosting their productivity daily.",
    fr: "+ professionnels qui augmentent leur productivité quotidiennement.",
    de: "+ Profis an, die täglich ihre Produktivität steigern.",
    es: "+ profesionales que aumentan su productividad diariamente.",
  },
  "landing.startFreeTrial": {
    nl: "Start Je Gratis Proefperiode",
    en: "Start Your Free Trial",
    fr: "Commencez Votre Essai Gratuit",
    de: "Starten Sie Ihre Kostenlose Testversion",
    es: "Comienza Tu Prueba Gratuita",
  },
  "landing.watchDemo": {
    nl: "Bekijk 2-Min Demo",
    en: "Watch 2-Min Demo",
    fr: "Regarder Démo 2-Min",
    de: "2-Min Demo ansehen",
    es: "Ver Demo de 2-Min",
  },
  "landing.joinUsers": {
    nl: "Sluit je aan bij",
    en: "Join",
    fr: "Rejoignez",
    de: "Schließen Sie sich",
    es: "Únete a",
  },
  "landing.joinUsersEnd": {
    nl: "+ gebruikers",
    en: "+ users",
    fr: "+ utilisateurs",
    de: "+ Benutzern an",
    es: "+ usuarios",
  },
  "landing.rating": {
    nl: "4.9/5 van 2.847+ reviews",
    en: "4.9/5 from 2,847+ reviews",
    fr: "4.9/5 sur 2 847+ avis",
    de: "4.9/5 von 2.847+ Bewertungen",
    es: "4.9/5 de 2,847+ reseñas",
  },
  "landing.featuresTitle": {
    nl: "Alles Wat Je Nodig Hebt Om Gefocust Te Blijven",
    en: "Everything You Need to Stay Focused",
    fr: "Tout Ce Dont Vous Avez Besoin Pour Rester Concentré",
    de: "Alles Was Sie Brauchen, Um Fokussiert Zu Bleiben",
    es: "Todo Lo Que Necesitas Para Mantenerte Enfocado",
  },
  "landing.featuresSubtitle": {
    nl: "Krachtige tools ontworpen om afleidingen te elimineren en je productiviteit te maximaliseren",
    en: "Powerful tools designed to eliminate distractions and maximize your productivity",
    fr: "Des outils puissants conçus pour éliminer les distractions et maximiser votre productivité",
    de: "Leistungsstarke Tools, die entwickelt wurden, um Ablenkungen zu eliminieren und Ihre Produktivität zu maximieren",
    es: "Herramientas poderosas diseñadas para eliminar distracciones y maximizar tu productividad",
  },
  "landing.aiCoach": {
    nl: "AI Productiviteitscoach",
    en: "AI Productivity Coach",
    fr: "Coach de Productivité IA",
    de: "KI-Produktivitätscoach",
    es: "Entrenador de Productividad IA",
  },
  "landing.aiCoachDesc": {
    nl: "Krijg gepersonaliseerde inzichten en aanbevelingen om je focussessies te optimaliseren",
    en: "Get personalized insights and recommendations to optimize your focus sessions",
    fr: "Obtenez des informations personnalisées et des recommandations pour optimiser vos sessions de concentration",
    de: "Erhalten Sie personalisierte Einblicke und Empfehlungen, um Ihre Fokussitzungen zu optimieren",
    es: "Obtén insights personalizados y recomendaciones para optimizar tus sesiones de enfoque",
  },
  "landing.smartBlocking": {
    nl: "Slimme Afleidingsblokkering",
    en: "Smart Distraction Blocking",
    fr: "Blocage Intelligent des Distractions",
    de: "Intelligente Ablenkungsblockierung",
    es: "Bloqueo Inteligente de Distracciones",
  },
  "landing.smartBlockingDesc": {
    nl: "Detecteer en blokkeer automatisch afleidende websites en meldingen",
    en: "Automatically detect and block distracting websites and notifications",
    fr: "Détectez et bloquez automatiquement les sites web et notifications distrayants",
    de: "Erkennen und blockieren Sie automatisch ablenkende Websites und Benachrichtigungen",
    es: "Detecta y bloquea automáticamente sitios web y notificaciones que distraen",
  },
  "landing.teamCollaboration": {
    nl: "Teamcollaboratie",
    en: "Team Collaboration",
    fr: "Collaboration d'Équipe",
    de: "Teamzusammenarbeit",
    es: "Colaboración en Equipo",
  },
  "landing.teamCollaborationDesc": {
    nl: "Synchroniseer focussessies met je team en volg collectieve productiviteit",
    en: "Sync focus sessions with your team and track collective productivity",
    fr: "Synchronisez les sessions de concentration avec votre équipe et suivez la productivité collective",
    de: "Synchronisieren Sie Fokussitzungen mit Ihrem Team und verfolgen Sie die kollektive Produktivität",
    es: "Sincroniza sesiones de enfoque con tu equipo y rastrea la productividad colectiva",
  },
  "landing.advancedAnalytics": {
    nl: "Geavanceerde Analytics",
    en: "Advanced Analytics",
    fr: "Analyses Avancées",
    de: "Erweiterte Analytics",
    es: "Análisis Avanzados",
  },
  "landing.advancedAnalyticsDesc": {
    nl: "Gedetailleerde inzichten in je productiviteitspatronen en verbetergebieden",
    en: "Detailed insights into your productivity patterns and improvement areas",
    fr: "Informations détaillées sur vos modèles de productivité et les domaines d'amélioration",
    de: "Detaillierte Einblicke in Ihre Produktivitätsmuster und Verbesserungsbereiche",
    es: "Insights detallados sobre tus patrones de productividad y áreas de mejora",
  },
  "landing.pomodoroTimer": {
    nl: "Pomodoro Timer",
    en: "Pomodoro Timer",
    fr: "Minuteur Pomodoro",
    de: "Pomodoro-Timer",
    es: "Temporizador Pomodoro",
  },
  "landing.pomodoroTimerDesc": {
    nl: "Aanpasbare focussessies met automatische pauzeherinneringen",
    en: "Customizable focus sessions with automatic break reminders",
    fr: "Sessions de concentration personnalisables avec des rappels de pause automatiques",
    de: "Anpassbare Fokussitzungen mit automatischen Pausenerinnerungen",
    es: "Sesiones de enfoque personalizables con recordatorios automáticos de descanso",
  },
  "landing.goalTracking": {
    nl: "Doelvolging",
    en: "Goal Tracking",
    fr: "Suivi des Objectifs",
    de: "Zielverfolgung",
    es: "Seguimiento de Objetivos",
  },
  "landing.goalTrackingDesc": {
    nl: "Stel dagelijkse, wekelijkse en maandelijkse productiviteitsdoelen in en volg ze",
    en: "Set and track daily, weekly, and monthly productivity goals",
    fr: "Définissez et suivez des objectifs de productivité quotidiens, hebdomadaires et mensuels",
    de: "Setzen und verfolgen Sie tägliche, wöchentliche und monatliche Produktivitätsziele",
    es: "Establece y rastrea objetivos de productividad diarios, semanales y mensuales",
  },
  "landing.testimonialsTitle": {
    nl: "Geliefd Door Professionals Wereldwijd",
    en: "Loved by Professionals Worldwide",
    fr: "Aimé par les Professionnels du Monde Entier",
    de: "Geliebt von Profis Weltweit",
    es: "Amado por Profesionales en Todo el Mundo",
  },
  "landing.testimonialsSubtitle": {
    nl: "Zie hoe FocusFlow de productiviteit transformeert voor teams overal",
    en: "See how FocusFlow is transforming productivity for teams everywhere",
    fr: "Voyez comment FocusFlow transforme la productivité des équipes partout",
    de: "Sehen Sie, wie FocusFlow die Produktivität für Teams überall transformiert",
    es: "Ve cómo FocusFlow está transformando la productividad para equipos en todas partes",
  },
  "landing.pricingTitle": {
    nl: "Eenvoudige, Transparante Prijzen",
    en: "Simple, Transparent Pricing",
    fr: "Tarification Simple et Transparente",
    de: "Einfache, Transparente Preise",
    es: "Precios Simples y Transparentes",
  },
  "landing.pricingSubtitle": {
    nl: "Kies het plan dat past bij je productiviteitsbehoeften",
    en: "Choose the plan that fits your productivity needs",
    fr: "Choisissez le plan qui correspond à vos besoins de productivité",
    de: "Wählen Sie den Plan, der zu Ihren Produktivitätsbedürfnissen passt",
    es: "Elige el plan que se adapte a tus necesidades de productividad",
  },
  "landing.free": {
    nl: "Gratis",
    en: "Free",
    fr: "Gratuit",
    de: "Kostenlos",
    es: "Gratis",
  },
  "landing.freeForever": {
    nl: "voor altijd",
    en: "forever",
    fr: "pour toujours",
    de: "für immer",
    es: "para siempre",
  },
  "landing.freeDesc": {
    nl: "Perfect om mee te beginnen",
    en: "Perfect for getting started",
    fr: "Parfait pour commencer",
    de: "Perfekt für den Einstieg",
    es: "Perfecto para empezar",
  },
  "landing.pro": {
    nl: "Pro",
    en: "Pro",
    fr: "Pro",
    de: "Pro",
    es: "Pro",
  },
  "landing.proPrice": {
    nl: "per maand",
    en: "per month",
    fr: "par mois",
    de: "pro Monat",
    es: "por mes",
  },
  "landing.proDesc": {
    nl: "Voor serieuze professionals",
    en: "For serious professionals",
    fr: "Pour les professionnels sérieux",
    de: "Für ernsthafte Profis",
    es: "Para profesionales serios",
  },
  "landing.team": {
    nl: "Team",
    en: "Team",
    fr: "Équipe",
    de: "Team",
    es: "Equipo",
  },
  "landing.teamDesc": {
    nl: "Voor hoogpresterende teams",
    en: "For high-performing teams",
    fr: "Pour les équipes performantes",
    de: "Für leistungsstarke Teams",
    es: "Para equipos de alto rendimiento",
  },
  "landing.mostPopular": {
    nl: "Meest Populair",
    en: "Most Popular",
    fr: "Le Plus Populaire",
    de: "Am Beliebtesten",
    es: "Más Popular",
  },
  "landing.premium": {
    nl: "Premium",
    en: "Premium",
    fr: "Premium",
    de: "Premium",
    es: "Premium",
  },
  "landing.popular": {
    nl: "Populair",
    en: "Popular",
    fr: "Populaire",
    de: "Beliebt",
    es: "Popular",
  },
  "landing.new": {
    nl: "Nieuw",
    en: "New",
    fr: "Nouveau",
    de: "Neu",
    es: "Nuevo",
  },
  "landing.contactSales": {
    nl: "Contact Verkoop",
    en: "Contact Sales",
    fr: "Contacter les Ventes",
    de: "Verkauf Kontaktieren",
    es: "Contactar Ventas",
  },
  "landing.ctaTitle": {
    nl: "Klaar Om Je Productiviteit Te Transformeren?",
    en: "Ready to Transform Your Productivity?",
    fr: "Prêt à Transformer Votre Productivité?",
    de: "Bereit, Ihre Produktivität Zu Transformieren?",
    es: "¿Listo Para Transformar Tu Productividad?",
  },
  "landing.ctaSubtitle": {
    nl: "Sluit je aan bij duizenden professionals die de kracht van gefocust werk al hebben ontdekt",
    en: "Join thousands of professionals who have already discovered the power of focused work",
    fr: "Rejoignez des milliers de professionnels qui ont déjà découvert le pouvoir du travail concentré",
    de: "Schließen Sie sich Tausenden von Profis an, die bereits die Kraft konzentrierter Arbeit entdeckt haben",
    es: "Únete a miles de profesionales que ya han descubierto el poder del trabajo enfocado",
  },
  "landing.footerDescription": {
    nl: "Transformeer je productiviteit met AI-gestuurde focussessies, slimme afleidingsblokkering en naadloze teamcollaboratie.",
    en: "Transform your productivity with AI-powered focus sessions, smart distraction blocking, and seamless team collaboration.",
    fr: "Transformez votre productivité avec des sessions de concentration alimentées par l'IA, un blocage intelligent des distractions et une collaboration d'équipe fluide.",
    de: "Verwandeln Sie Ihre Produktivität mit KI-gestützten Fokussitzungen, intelligenter Ablenkungsblockierung und nahtloser Teamzusammenarbeit.",
    es: "Transforma tu productividad con sesiones de enfoque impulsadas por IA, bloqueo inteligente de distracciones y colaboración en equipo perfecta.",
  },
  "landing.securePrivate": {
    nl: "100% Veilig & Privé •",
    en: "100% Secure & Private •",
    fr: "100% Sécurisé et Privé •",
    de: "100% Sicher & Privat •",
    es: "100% Seguro y Privado •",
  },
  "landing.sessionsCompleted": {
    nl: "+ Sessies Voltooid",
    en: "+ Sessions Completed",
    fr: "+ Sessions Terminées",
    de: "+ Sitzungen Abgeschlossen",
    es: "+ Sesiones Completadas",
  },
  "landing.product": {
    nl: "Product",
    en: "Product",
    fr: "Produit",
    de: "Produkt",
    es: "Producto",
  },
  "landing.demo": {
    nl: "Demo",
    en: "Demo",
    fr: "Démo",
    de: "Demo",
    es: "Demo",
  },
  "landing.roadmap": {
    nl: "Roadmap",
    en: "Roadmap",
    fr: "Feuille de Route",
    de: "Roadmap",
    es: "Hoja de Ruta",
  },
  "landing.company": {
    nl: "Bedrijf",
    en: "Company",
    fr: "Entreprise",
    de: "Unternehmen",
    es: "Empresa",
  },
  "landing.help": {
    nl: "Hulp",
    en: "Help",
    fr: "Aide",
    de: "Hilfe",
    es: "Ayuda",
  },
  "landing.community": {
    nl: "Community",
    en: "Community",
    fr: "Communauté",
    de: "Community",
    es: "Comunidad",
  },
  "landing.termsOfConditions": {
    nl: "Algemene Voorwaarden",
    en: "Terms of Conditions",
    fr: "Conditions Générales",
    de: "Allgemeine Geschäftsbedingungen",
    es: "Términos y Condiciones",
  },
  "landing.copyright": {
    nl: "© 2025 FocusFlow. Alle rechten voorbehouden.",
    en: "© 2025 FocusFlow. All rights reserved.",
    fr: "© 2025 FocusFlow. Tous droits réservés.",
    de: "© 2025 FocusFlow. Alle Rechte vorbehalten.",
    es: "© 2025 FocusFlow. Todos los derechos reservados.",
  },

  // Auth Page translations
  "auth.backToHome": {
    nl: "Terug naar home",
    en: "Back to home",
    fr: "Retour à l'accueil",
    de: "Zurück zur Startseite",
    es: "Volver al inicio",
  },
  "auth.welcomeBack": {
    nl: "Welkom terug",
    en: "Welcome back",
    fr: "Bon retour",
    de: "Willkommen zurück",
    es: "Bienvenido de vuelta",
  },
  "auth.createAccount": {
    nl: "Account aanmaken",
    en: "Create account",
    fr: "Créer un compte",
    de: "Konto erstellen",
    es: "Crear cuenta",
  },
  "auth.loginToAccount": {
    nl: "Log in op je FocusFlow account",
    en: "Log in to your FocusFlow account",
    fr: "Connectez-vous à votre compte FocusFlow",
    de: "Melden Sie sich bei Ihrem FocusFlow-Konto an",
    es: "Inicia sesión en tu cuenta de FocusFlow",
  },
  "auth.createFreeAccount": {
    nl: "Maak je gratis FocusFlow account aan",
    en: "Create your free FocusFlow account",
    fr: "Créez votre compte FocusFlow gratuit",
    de: "Erstellen Sie Ihr kostenloses FocusFlow-Konto",
    es: "Crea tu cuenta gratuita de FocusFlow",
  },
  "auth.fullName": {
    nl: "Volledige naam",
    en: "Full name",
    fr: "Nom complet",
    de: "Vollständiger Name",
    es: "Nombre completo",
  },
  "auth.fullNamePlaceholder": {
    nl: "Je volledige naam",
    en: "Your full name",
    fr: "Votre nom complet",
    de: "Ihr vollständiger Name",
    es: "Tu nombre completo",
  },
  "auth.emailAddress": {
    nl: "E-mailadres",
    en: "Email address",
    fr: "Adresse e-mail",
    de: "E-Mail-Adresse",
    es: "Dirección de correo electrónico",
  },
  "auth.emailPlaceholder": {
    nl: "focusflow@alwaysdata.net",
    en: "focusflow@alwaysdata.net",
    fr: "focusflow@alwaysdata.net",
    de: "focusflow@alwaysdata.net",
    es: "focusflow@alwaysdata.net",
  },
  "auth.password": {
    nl: "Wachtwoord",
    en: "Password",
    fr: "Mot de passe",
    de: "Passwort",
    es: "Contraseña",
  },
  "auth.passwordPlaceholder": {
    nl: "Je wachtwoord",
    en: "Your password",
    fr: "Votre mot de passe",
    de: "Ihr Passwort",
    es: "Tu contraseña",
  },
  "auth.confirmPassword": {
    nl: "Bevestig wachtwoord",
    en: "Confirm password",
    fr: "Confirmer le mot de passe",
    de: "Passwort bestätigen",
    es: "Confirmar contraseña",
  },
  "auth.confirmPasswordPlaceholder": {
    nl: "Bevestig je wachtwoord",
    en: "Confirm your password",
    fr: "Confirmez votre mot de passe",
    de: "Bestätigen Sie Ihr Passwort",
    es: "Confirma tu contraseña",
  },
  "auth.login": {
    nl: "Inloggen",
    en: "Log in",
    fr: "Se connecter",
    de: "Anmelden",
    es: "Iniciar sesión",
  },
  "auth.loggingIn": {
    nl: "Inloggen...",
    en: "Logging in...",
    fr: "Connexion...",
    de: "Anmelden...",
    es: "Iniciando sesión...",
  },
  "auth.creatingAccount": {
    nl: "Account aanmaken...",
    en: "Creating account...",
    fr: "Création du compte...",
    de: "Konto erstellen...",
    es: "Creando cuenta...",
  },
  "auth.or": {
    nl: "Of",
    en: "Or",
    fr: "Ou",
    de: "Oder",
    es: "O",
  },
  "auth.loginWithMicrosoft": {
    nl: "Inloggen met Microsoft",
    en: "Log in with Microsoft",
    fr: "Se connecter avec Microsoft",
    de: "Mit Microsoft anmelden",
    es: "Iniciar sesión con Microsoft",
  },
  "auth.loginWithGitHub": {
    nl: "Inloggen met GitHub",
    en: "Log in with GitHub",
    fr: "Se connecter avec GitHub",
    de: "Mit GitHub anmelden",
    es: "Iniciar sesión con GitHub",
  },
  "auth.noAccount": {
    nl: "Nog geen account? Registreren",
    en: "Don't have an account? Sign up",
    fr: "Pas de compte ? S'inscrire",
    de: "Noch kein Konto? Registrieren",
    es: "¿No tienes cuenta? Regístrate",
  },
  "auth.hasAccount": {
    nl: "Al een account? Inloggen",
    en: "Already have an account? Log in",
    fr: "Déjà un compte ? Se connecter",
    de: "Bereits ein Konto? Anmelden",
    es: "¿Ya tienes cuenta? Iniciar sesión",
  },
  "auth.loading": {
    nl: "Laden...",
    en: "Loading...",
    fr: "Chargement...",
    de: "Laden...",
    es: "Cargando...",
  },
  "auth.passwordMismatch": {
    nl: "Wachtwoorden komen niet overeen",
    en: "Passwords do not match",
    fr: "Les mots de passe ne correspondent pas",
    de: "Passwörter stimmen nicht überein",
    es: "Las contraseñas no coinciden",
  },
  "auth.passwordTooShort": {
    nl: "Wachtwoord moet minimaal 6 karakters lang zijn",
    en: "Password must be at least 6 characters long",
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    de: "Passwort muss mindestens 6 Zeichen lang sein",
    es: "La contraseña debe tener al menos 6 caracteres",
  },
  "auth.somethingWentWrong": {
    nl: "Er is iets misgegaan",
    en: "Something went wrong",
    fr: "Quelque chose s'est mal passé",
    de: "Etwas ist schief gelaufen",
    es: "Algo salió mal",
  },
  "settings.languageChanged": {
  nl: "Taal gewijzigd naar {{language}}! 🌍",
  en: "Language changed to {{language}}! 🌍",
  fr: "Langue changée vers {{language}}! 🌍",
  de: "Sprache geändert zu {{language}}! 🌍",
  es: "¡Idioma cambiado a {{language}}! 🌍",
},

"settings.subtitle": {
  nl: "Pas FocusFlow aan naar jouw voorkeuren",
  en: "Customize FocusFlow to your preferences",
  fr: "Personnalisez FocusFlow selon vos préférences",
  de: "Passen Sie FocusFlow an Ihre Vorlieben an",
  es: "Personaliza FocusFlow según tus preferencias",
},
"settings.defaultUserName": {
  nl: "Gebruiker",
  en: "User",
  fr: "Utilisateur",
  de: "Benutzer", 
  es: "Usuario",
},
"settings.exportData": {
  nl: "Export Data",
  en: "Export Data",
  fr: "Exporter les données",
  de: "Daten exportieren",
  es: "Exportar datos",
},
"settings.saveSuccess": {
  nl: "{{section}} instellingen opgeslagen! ✅",
  en: "{{section}} settings saved! ✅",
  fr: "Paramètres {{section}} sauvegardés! ✅",
  de: "{{section}} Einstellungen gespeichert! ✅",
  es: "¡Configuración de {{section}} guardada! ✅",
},
"settings.exportSuccess": {
  nl: "Data geëxporteerd! 📁",
  en: "Data exported! 📁",
  fr: "Données exportées! 📁",
  de: "Daten exportiert! 📁",
  es: "¡Datos exportados! 📁",
},
"settings.exportFailed": {
  nl: "Export mislukt",
  en: "Export failed",
  fr: "Échec de l'exportation",
  de: "Export fehlgeschlagen",
  es: "Error al exportar",
},
"settings.deleteAccountConfirm": {
  nl: "Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.",
  en: "Are you sure you want to delete your account? This action cannot be undone.",
  fr: "Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée.",
  de: "Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  es: "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
},
"settings.accountDeleted": {
  nl: "Account verwijderd",
  en: "Account deleted",
  fr: "Compte supprimé",
  de: "Konto gelöscht",
  es: "Cuenta eliminada",
},
"settings.resetConfirm": {
  nl: "Weet je zeker dat je alle instellingen wilt resetten?",
  en: "Are you sure you want to reset all settings?",
  fr: "Êtes-vous sûr de vouloir réinitialiser tous les paramètres?",
  de: "Sind Sie sicher, dass Sie alle Einstellungen zurücksetzen möchten?",
  es: "¿Estás seguro de que quieres restablecer todas las configuraciones?",
},
"settings.resetSuccess": {
  nl: "Standaardinstellingen hersteld! 🔄",
  en: "Default settings restored! 🔄",
  fr: "Paramètres par défaut restaurés! 🔄",
  de: "Standardeinstellungen wiederhergestellt! 🔄",
  es: "¡Configuraciones predeterminadas restauradas! 🔄",
},
"settings.testNotificationTitle": {
  nl: "Test Notificatie",
  en: "Test Notification",
  fr: "Notification de test",
  de: "Test-Benachrichtigung",
  es: "Notificación de prueba",
},
"settings.testNotificationMessage": {
  nl: "Dit is een test om te controleren of notificaties werken!",
  en: "This is a test to check if notifications work!",
  fr: "Ceci est un test pour vérifier si les notifications fonctionnent!",
  de: "Dies ist ein Test, um zu überprüfen, ob Benachrichtigungen funktionieren!",
  es: "¡Esta es una prueba para verificar si las notificaciones funcionan!",
},

// Tab titles
"settings.tabs.focus": {
  nl: "Focus",
  en: "Focus",
  fr: "Focus",
  de: "Fokus",
  es: "Enfoque",
},
"settings.tabs.aiCoach": {
  nl: "AI Coach",
  en: "AI Coach",
  fr: "Coach IA",
  de: "KI-Coach",
  es: "Entrenador IA",
},
"settings.tabs.distraction": {
  nl: "Afleiding",
  en: "Distraction",
  fr: "Distraction",
  de: "Ablenkung",
  es: "Distracción",
},
"settings.tabs.notifications": {
  nl: "Notificaties",
  en: "Notifications",
  fr: "Notifications",
  de: "Benachrichtigungen",
  es: "Notificaciones",
},
"settings.tabs.appearance": {
  nl: "Uiterlijk",
  en: "Appearance",
  fr: "Apparence",
  de: "Aussehen",
  es: "Apariencia",
},
"settings.tabs.integrations": {
  nl: "Integraties",
  en: "Integrations",
  fr: "Intégrations",
  de: "Integrationen",
  es: "Integraciones",
},

// Focus settings
"settings.focus.title": {
  nl: "Focus Instellingen",
  en: "Focus Settings",
  fr: "Paramètres de concentration",
  de: "Fokus-Einstellungen",
  es: "Configuración de enfoque",
},
"settings.focus.description": {
  nl: "Configureer je ideale focus- en pauzetijden",
  en: "Configure your ideal focus and break times",
  fr: "Configurez vos temps de concentration et de pause idéaux",
  de: "Konfigurieren Sie Ihre idealen Fokus- und Pausenzeiten",
  es: "Configura tus tiempos ideales de enfoque y descanso",
},
"settings.focus.defaultFocusTime": {
  nl: "Standaard Focus Tijd",
  en: "Default Focus Time",
  fr: "Temps de concentration par défaut",
  de: "Standard-Fokuszeit",
  es: "Tiempo de enfoque predeterminado",
},
"settings.focus.shortBreak": {
  nl: "Korte Pauze",
  en: "Short Break",
  fr: "Pause courte",
  de: "Kurze Pause",
  es: "Descanso corto",
},
"settings.focus.longBreak": {
  nl: "Lange Pauze",
  en: "Long Break",
  fr: "Pause longue",
  de: "Lange Pause",
  es: "Descanso largo",
},
"settings.focus.minutes": {
  nl: "{{count}} minuten",
  en: "{{count}} minutes",
  fr: "{{count}} minutes",
  de: "{{count}} Minuten",
  es: "{{count}} minutos",
},
"settings.focus.autoStartBreaks.title": {
  nl: "Auto-start pauzes",
  en: "Auto-start breaks",
  fr: "Démarrage automatique des pauses",
  de: "Auto-Start Pausen",
  es: "Inicio automático de descansos",
},
"settings.focus.autoStartBreaks.description": {
  nl: "Start automatisch pauzes na een focus sessie",
  en: "Automatically start breaks after a focus session",
  fr: "Démarrer automatiquement les pauses après une session de concentration",
  de: "Pausen nach einer Fokussitzung automatisch starten",
  es: "Iniciar automáticamente los descansos después de una sesión de enfoque",
},
"settings.focus.autoStartFocus.title": {
  nl: "Auto-start focus",
  en: "Auto-start focus",
  fr: "Démarrage automatique du focus",
  de: "Auto-Start Fokus",
  es: "Inicio automático de enfoque",
},
"settings.focus.autoStartFocus.description": {
  nl: "Start automatisch focus sessies na een pauze",
  en: "Automatically start focus sessions after a break",
  fr: "Démarrer automatiquement les sessions de concentration après une pause",
  de: "Fokussitzungen nach einer Pause automatisch starten",
  es: "Iniciar automáticamente sesiones de enfoque después de un descanso",
},
"settings.focus.playSounds.title": {
  nl: "Geluidsmeldingen",
  en: "Sound notifications",
  fr: "Notifications sonores",
  de: "Tonbenachrichtigungen",
  es: "Notificaciones de sonido",
},
"settings.focus.playSounds.description": {
  nl: "Speel geluiden af bij start/einde van sessies",
  en: "Play sounds at start/end of sessions",
  fr: "Jouer des sons au début/fin des sessions",
  de: "Töne am Anfang/Ende von Sitzungen abspielen",
  es: "Reproducir sonidos al inicio/final de las sesiones",
},
"settings.focus.soundVolume": {
  nl: "Geluidsvolume",
  en: "Sound volume",
  fr: "Volume sonore",
  de: "Lautstärke",
  es: "Volumen de sonido",
},
"settings.focus.save": {
  nl: "Focus Instellingen Opslaan",
  en: "Save Focus Settings",
  fr: "Sauvegarder les paramètres de concentration",
  de: "Fokus-Einstellungen speichern",
  es: "Guardar configuración de enfoque",
},

// AI Coach settings
"settings.aiCoach.title": {
  nl: "AI Productiviteitscoach",
  en: "AI Productivity Coach",
  fr: "Coach de productivité IA",
  de: "KI-Produktivitätscoach",
  es: "Entrenador de productividad IA",
},
"settings.aiCoach.premium": {
  nl: "Premium",
  en: "Premium",
  fr: "Premium",
  de: "Premium",
  es: "Premium",
},
"settings.aiCoach.description": {
  nl: "Configureer je persoonlijke AI coach voor optimale productiviteit",
  en: "Configure your personal AI coach for optimal productivity",
  fr: "Configurez votre coach IA personnel pour une productivité optimale",
  de: "Konfigurieren Sie Ihren persönlichen KI-Coach für optimale Produktivität",
  es: "Configura tu entrenador personal de IA para una productividad óptima",
},
"settings.aiCoach.enable.title": {
  nl: "AI Coach Inschakelen",
  en: "Enable AI Coach",
  fr: "Activer le coach IA",
  de: "KI-Coach aktivieren",
  es: "Habilitar entrenador IA",
},
"settings.aiCoach.enable.description": {
  nl: "Ontvang persoonlijke coaching en inzichten",
  en: "Receive personalized coaching and insights",
  fr: "Recevez un coaching personnalisé et des informations",
  de: "Erhalten Sie personalisiertes Coaching und Einblicke",
  es: "Recibe coaching personalizado e insights",
},
"settings.aiCoach.personality.title": {
  nl: "Coach Persoonlijkheid",
  en: "Coach Personality",
  fr: "Personnalité du coach",
  de: "Coach-Persönlichkeit",
  es: "Personalidad del entrenador",
},
"settings.aiCoach.personality.motivating": {
  nl: "🔥 Motiverend en Energiek",
  en: "🔥 Motivating and Energetic",
  fr: "🔥 Motivant et énergique",
  de: "🔥 Motivierend und energisch",
  es: "🔥 Motivador y enérgico",
},
"settings.aiCoach.personality.calm": {
  nl: "🧘 Kalm en Ondersteunend",
  en: "🧘 Calm and Supportive",
  fr: "🧘 Calme et bienveillant",
  de: "🧘 Ruhig und unterstützend",
  es: "🧘 Calmado y solidario",
},
"settings.aiCoach.personality.professional": {
  nl: "💼 Professioneel en Direct",
  en: "💼 Professional and Direct",
  fr: "💼 Professionnel et direct",
  de: "💼 Professionell und direkt",
  es: "💼 Profesional y directo",
},
"settings.aiCoach.insightFrequency.title": {
  nl: "Inzicht Frequentie",
  en: "Insight Frequency",
  fr: "Fréquence des insights",
  de: "Einblick-Häufigkeit",
  es: "Frecuencia de insights",
},
"settings.aiCoach.insightFrequency.low": {
  nl: "Laag (1-2 per dag)",
  en: "Low (1-2 per day)",
  fr: "Faible (1-2 par jour)",
  de: "Niedrig (1-2 pro Tag)",
  es: "Bajo (1-2 por día)",
},
"settings.aiCoach.insightFrequency.medium": {
  nl: "Gemiddeld (3-5 per dag)",
  en: "Medium (3-5 per day)",
  fr: "Moyen (3-5 par jour)",
  de: "Mittel (3-5 pro Tag)",
  es: "Medio (3-5 por día)",
},
"settings.aiCoach.insightFrequency.high": {
  nl: "Hoog (5+ per dag)",
  en: "High (5+ per day)",
  fr: "Élevé (5+ par jour)",
  de: "Hoch (5+ pro Tag)",
  es: "Alto (5+ por día)",
},
"settings.aiCoach.learningFromPatterns.title": {
  nl: "Leren van Patronen",
  en: "Learning from Patterns",
  fr: "Apprentissage des motifs",
  de: "Lernen aus Mustern",
  es: "Aprender de patrones",
},
"settings.aiCoach.learningFromPatterns.description": {
  nl: "AI analyseert je werkpatronen voor betere suggesties",
  en: "AI analyzes your work patterns for better suggestions",
  fr: "L'IA analyse vos modèles de travail pour de meilleures suggestions",
  de: "KI analysiert Ihre Arbeitsmuster für bessere Vorschläge",
  es: "La IA analiza tus patrones de trabajo para mejores sugerencias",
},
"settings.aiCoach.personalizedTips.title": {
  nl: "Persoonlijke Tips",
  en: "Personalized Tips",
  fr: "Conseils personnalisés",
  de: "Personalisierte Tipps",
  es: "Consejos personalizados",
},
"settings.aiCoach.personalizedTips.description": {
  nl: "Ontvang op maat gemaakte productiviteitstips",
  en: "Receive customized productivity tips",
  fr: "Recevez des conseils de productivité personnalisés",
  de: "Erhalten Sie maßgeschneiderte Produktivitätstipps",
  es: "Recibe consejos de productividad personalizados",
},
"settings.aiCoach.productivityGoals.title": {
  nl: "Productiviteitsdoelen",
  en: "Productivity Goals",
  fr: "Objectifs de productivité",
  de: "Produktivitätsziele",
  es: "Objetivos de productividad",
},
"settings.aiCoach.productivityGoals.description": {
  nl: "AI helpt je realistische doelen te stellen",
  en: "AI helps you set realistic goals",
  fr: "L'IA vous aide à fixer des objectifs réalistes",
  de: "KI hilft Ihnen, realistische Ziele zu setzen",
  es: "La IA te ayuda a establecer objetivos realistas",
},
"settings.aiCoach.privacyNotice": {
  nl: "De AI coach gebruikt alleen je productiviteitsdata om inzichten te genereren. Je persoonlijke bestanden en gevoelige informatie worden nooit geanalyseerd.",
  en: "The AI coach only uses your productivity data to generate insights. Your personal files and sensitive information are never analyzed.",
  fr: "Le coach IA n'utilise que vos données de productivité pour générer des insights. Vos fichiers personnels et informations sensibles ne sont jamais analysés.",
  de: "Der KI-Coach verwendet nur Ihre Produktivitätsdaten, um Einblicke zu generieren. Ihre persönlichen Dateien und sensiblen Informationen werden niemals analysiert.",
  es: "El entrenador IA solo usa tus datos de productividad para generar insights. Tus archivos personales e información sensible nunca son analizados.",
},
"settings.aiCoach.save": {
  nl: "AI Instellingen Opslaan",
  en: "Save AI Settings",
  fr: "Sauvegarder les paramètres IA",
  de: "KI-Einstellungen speichern",
  es: "Guardar configuración de IA",
},

// Distraction settings
"settings.distraction.title": {
  nl: "Afleidingsdetectie",
  en: "Distraction Detection",
  fr: "Détection de distraction",
  de: "Ablenkungserkennung",
  es: "Detección de distracciones",
},
"settings.distraction.description": {
  nl: "Configureer hoe FocusFlow afleidingen detecteert en blokkeert",
  en: "Configure how FocusFlow detects and blocks distractions",
  fr: "Configurez comment FocusFlow détecte et bloque les distractions",
  de: "Konfigurieren Sie, wie FocusFlow Ablenkungen erkennt und blockiert",
  es: "Configura cómo FocusFlow detecta y bloquea las distracciones",
},
"settings.distraction.enableDetection.title": {
  nl: "Afleidingsdetectie Inschakelen",
  en: "Enable Distraction Detection",
  fr: "Activer la détection de distraction",
  de: "Ablenkungserkennung aktivieren",
  es: "Habilitar detección de distracciones",
},
"settings.distraction.enableDetection.description": {
  nl: "Monitor activiteit en waarschuw bij afleidingen",
  en: "Monitor activity and warn about distractions",
  fr: "Surveiller l'activité et avertir des distractions",
  de: "Aktivität überwachen und vor Ablenkungen warnen",
  es: "Monitorear actividad y advertir sobre distracciones",
},
"settings.distraction.tabSwitchAlerts.title": {
  nl: "Tab Switch Melding",
  en: "Tab Switch Alert",
  fr: "Alerte de changement d'onglet",
  de: "Tab-Wechsel-Warnung",
  es: "Alerta de cambio de pestaña",
},
"settings.distraction.tabSwitchAlerts.description": {
  nl: "Toon melding bij tabblad wisselen",
  en: "Show alert when switching tabs",
  fr: "Afficher une alerte lors du changement d'onglet",
  de: "Warnung beim Wechseln von Tabs anzeigen",
  es: "Mostrar alerta al cambiar de pestaña",
},
"settings.distraction.tabSwitchAllowlist.title": {
  nl: "Toegestane Domeinen (allowlist)",
  en: "Allowed Domains (allowlist)",
  fr: "Domaines autorisés (liste blanche)",
  de: "Erlaubte Domains (Whitelist)",
  es: "Dominios permitidos (lista blanca)",
},
"settings.distraction.tabSwitchAllowlist.description": {
  nl: "Domeinen gescheiden door komma waarvoor tab switch is toegestaan (bijv. teams.microsoft.com, outlook.com)",
  en: "Comma-separated domains where tab switching is allowed (e.g. teams.microsoft.com, outlook.com)",
  fr: "Domaines séparés par des virgules où le changement d'onglet est autorisé (ex. teams.microsoft.com, outlook.com)",
  de: "Kommagetrennte Domains, bei denen Tab-Wechsel erlaubt ist (z.B. teams.microsoft.com, outlook.com)",
  es: "Dominios separados por comas donde se permite el cambio de pestañas (ej. teams.microsoft.com, outlook.com)",
},
"settings.distraction.tabSwitchAllowlist.placeholder": {
  nl: "teams.microsoft.com, outlook.com",
  en: "teams.microsoft.com, outlook.com",
  fr: "teams.microsoft.com, outlook.com",
  de: "teams.microsoft.com, outlook.com",
  es: "teams.microsoft.com, outlook.com",
},
"settings.distraction.urlBlocking.title": {
  nl: "URL Blokkering",
  en: "URL Blocking",
  fr: "Blocage d'URL",
  de: "URL-Blockierung",
  es: "Bloqueo de URLs",
},
"settings.distraction.urlBlocking.description": {
  nl: "Blokkeer afleidende websites tijdens focus sessies",
  en: "Block distracting websites during focus sessions",
  fr: "Bloquer les sites web distrayants pendant les sessions de concentration",
  de: "Ablenkende Websites während Fokussitzungen blockieren",
  es: "Bloquear sitios web que distraen durante sesiones de enfoque",
},
"settings.distraction.strictMode.title": {
  nl: "Strikte Modus",
  en: "Strict Mode",
  fr: "Mode strict",
  de: "Strenger Modus",
  es: "Modo estricto",
},
"settings.distraction.strictMode.description": {
  nl: "Forceer focus door sterke beperkingen",
  en: "Enforce focus through strong restrictions",
  fr: "Imposer la concentration par des restrictions strictes",
  de: "Fokus durch strenge Beschränkungen durchsetzen",
  es: "Forzar el enfoque a través de restricciones estrictas",
},
"settings.distraction.customBlockedSites.title": {
  nl: "Geblokkeerde Sites",
  en: "Blocked Sites",
  fr: "Sites bloqués",
  de: "Blockierte Seiten",
  es: "Sitios bloqueados",
},
"settings.distraction.customBlockedSites.description": {
  nl: "Komma-gescheiden lijst van domeinen om te blokkeren",
  en: "Comma-separated list of domains to block",
  fr: "Liste de domaines à bloquer séparés par des virgules",
  de: "Kommagetrennte Liste der zu blockierenden Domains",
  es: "Lista separada por comas de dominios a bloquear",
},
"settings.distraction.customBlockedSites.placeholder": {
  nl: "facebook.com, twitter.com, instagram.com",
  en: "facebook.com, twitter.com, instagram.com",
  fr: "facebook.com, twitter.com, instagram.com",
  de: "facebook.com, twitter.com, instagram.com",
  es: "facebook.com, twitter.com, instagram.com",
},
"settings.distraction.allowList.title": {
  nl: "Toegestane Sites",
  en: "Allowed Sites",
  fr: "Sites autorisés",
  de: "Erlaubte Seiten",
  es: "Sitios permitidos",
},
"settings.distraction.allowList.description": {
  nl: "Sites die altijd toegankelijk blijven",
  en: "Sites that remain always accessible",
  fr: "Sites qui restent toujours accessibles",
  de: "Seiten, die immer zugänglich bleiben",
  es: "Sitios que permanecen siempre accesibles",
},
"settings.distraction.allowList.placeholder": {
  nl: "github.com, stackoverflow.com, docs.google.com",
  en: "github.com, stackoverflow.com, docs.google.com",
  fr: "github.com, stackoverflow.com, docs.google.com",
  de: "github.com, stackoverflow.com, docs.google.com",
  es: "github.com, stackoverflow.com, docs.google.com",
},
"settings.distraction.save": {
  nl: "Afleidingsinstellingen Opslaan",
  en: "Save Distraction Settings",
  fr: "Sauvegarder les paramètres de distraction",
  de: "Ablenkungseinstellungen speichern",
  es: "Guardar configuración de distracciones",
},

// Notifications
"settings.notifications.title": {
  nl: "Notificaties",
  en: "Notifications",
  fr: "Notifications",
  de: "Benachrichtigungen",
  es: "Notificaciones",
},
"settings.notifications.description": {
  nl: "Beheer wanneer en hoe je notificaties wilt ontvangen",
  en: "Manage when and how you want to receive notifications",
  fr: "Gérez quand et comment vous souhaitez recevoir des notifications",
  de: "Verwalten Sie, wann und wie Sie Benachrichtigungen erhalten möchten",
  es: "Gestiona cuándo y cómo quieres recibir notificaciones",
},
"settings.notifications.focusReminders.title": {
  nl: "Focus Herinneringen",
  en: "Focus Reminders",
  fr: "Rappels de concentration",
  de: "Fokus-Erinnerungen",
  es: "Recordatorios de enfoque",
},
"settings.notifications.focusReminders.description": {
  nl: "Krijg herinneringen om focus sessies te starten",
  en: "Get reminders to start focus sessions",
  fr: "Recevez des rappels pour commencer les sessions de concentration",
  de: "Erhalten Sie Erinnerungen zum Starten von Fokussitzungen",
  es: "Recibe recordatorios para iniciar sesiones de enfoque",
},
"settings.notifications.breakReminders.title": {
  nl: "Pauze Herinneringen",
  en: "Break Reminders",
  fr: "Rappels de pause",
  de: "Pausen-Erinnerungen",
  es: "Recordatorios de descanso",
},
"settings.notifications.breakReminders.description": {
  nl: "Waarschuwingen wanneer het tijd is voor een pauze",
  en: "Alerts when it's time for a break",
  fr: "Alertes quand il est temps de faire une pause",
  de: "Warnungen, wenn es Zeit für eine Pause ist",
  es: "Alertas cuando es hora de tomar un descanso",
},
"settings.notifications.dailyReport.title": {
  nl: "Dagelijks Rapport",
  en: "Daily Report",
  fr: "Rapport quotidien",
  de: "Täglicher Bericht",
  es: "Informe diario",
},
"settings.notifications.dailyReport.description": {
  nl: "Ontvang een samenvatting van je dagelijkse productiviteit",
  en: "Receive a summary of your daily productivity",
  fr: "Recevez un résumé de votre productivité quotidienne",
  de: "Erhalten Sie eine Zusammenfassung Ihrer täglichen Produktivität",
  es: "Recibe un resumen de tu productividad diaria",
},
"settings.notifications.weeklyReport.title": {
  nl: "Wekelijks Rapport",
  en: "Weekly Report",
  fr: "Rapport hebdomadaire",
  de: "Wöchentlicher Bericht",
  es: "Informe semanal",
},
"settings.notifications.weeklyReport.description": {
  nl: "Krijg een wekelijkse analyse van je prestaties",
  en: "Get a weekly analysis of your performance",
  fr: "Obtenez une analyse hebdomadaire de vos performances",
  de: "Erhalten Sie eine wöchentliche Analyse Ihrer Leistung",
  es: "Obtén un análisis semanal de tu rendimiento",
},
"settings.notifications.distractionAlerts.title": {
  nl: "Afleiding Waarschuwingen",
  en: "Distraction Alerts",
  fr: "Alertes de distraction",
  de: "Ablenkungswarnungen",
  es: "Alertas de distracción",
},
"settings.notifications.distractionAlerts.description": {
  nl: "Meldingen bij gedetecteerde afleidingen",
  en: "Notifications when distractions are detected",
  fr: "Notifications lors de la détection de distractions",
  de: "Benachrichtigungen bei erkannten Ablenkungen",
  es: "Notificaciones cuando se detectan distracciones",
},
"settings.notifications.achievementNotifications.title": {
  nl: "Prestatie Meldingen",
  en: "Achievement Notifications",
  fr: "Notifications de réalisations",
  de: "Erfolgsbenachrichtigungen",
  es: "Notificaciones de logros",
},
"settings.notifications.achievementNotifications.description": {
  nl: "Vieringen van behaalde mijlpalen en doelen",
  en: "Celebrations of achieved milestones and goals",
  fr: "Célébrations des jalons et objectifs atteints",
  de: "Feiern von erreichten Meilensteinen und Zielen",
  es: "Celebraciones de hitos y objetivos logrados",
},
"settings.notifications.emailDigests.title": {
  nl: "Email Samenvattingen",
  en: "Email Digests",
  fr: "Résumés par e-mail",
  de: "E-Mail-Zusammenfassungen",
  es: "Resúmenes por correo",
},
"settings.notifications.emailDigests.description": {
  nl: "Ontvang periodieke emails met je statistieken",
  en: "Receive periodic emails with your statistics",
  fr: "Recevez des e-mails périodiques avec vos statistiques",
  de: "Erhalten Sie regelmäßige E-Mails mit Ihren Statistiken",
  es: "Recibe correos periódicos con tus estadísticas",
},
"settings.notifications.save": {
  nl: "Notificatie Instellingen Opslaan",
  en: "Save Notification Settings",
  fr: "Sauvegarder les paramètres de notification",
  de: "Benachrichtigungseinstellungen speichern",
  es: "Guardar configuración de notificaciones",
},
"settings.notifications.test": {
  nl: "Test Notificatie",
  en: "Test Notification",
  fr: "Tester la notification",
  de: "Benachrichtigung testen",
  es: "Probar notificación",
},

// Appearance
"settings.appearance.title": {
  nl: "Uiterlijk & Thema",
  en: "Appearance & Theme",
  fr: "Apparence et thème",
  de: "Aussehen & Design",
  es: "Apariencia y tema",
},
"settings.appearance.description": {
  nl: "Personaliseer hoe FocusFlow eruitziet en aanvoelt",
  en: "Personalize how FocusFlow looks and feels",
  fr: "Personnalisez l'apparence et la sensation de FocusFlow",
  de: "Personalisieren Sie, wie FocusFlow aussieht und sich anfühlt",
  es: "Personaliza cómo se ve y se siente FocusFlow",
},
"settings.appearance.language": {
  nl: "Taal / Language",
  en: "Language / Taal",
  fr: "Langue / Language",
  de: "Sprache / Language",
  es: "Idioma / Language",
},
"settings.appearance.theme.title": {
  nl: "Thema",
  en: "Theme",
  fr: "Thème",
  de: "Design",
  es: "Tema",
},
"settings.appearance.accentColor.title": {
  nl: "Accent Kleur",
  en: "Accent Color",
  fr: "Couleur d'accent",
  de: "Akzentfarbe",
  es: "Color de acento",
},
"settings.appearance.accentColor.blue": {
  nl: "🔵 Blauw",
  en: "🔵 Blue",
  fr: "🔵 Bleu",
  de: "🔵 Blau",
  es: "🔵 Azul",
},
"settings.appearance.accentColor.purple": {
  nl: "🟣 Paars",
  en: "🟣 Purple",
  fr: "🟣 Violet",
  de: "🟣 Lila",
  es: "🟣 Morado",
},
"settings.appearance.accentColor.green": {
  nl: "🟢 Groen",
  en: "🟢 Green",
  fr: "🟢 Vert",
  de: "🟢 Grün",
  es: "🟢 Verde",
},
"settings.appearance.accentColor.orange": {
  nl: "🟠 Oranje",
  en: "🟠 Orange",
  fr: "🟠 Orange",
  de: "🟠 Orange",
  es: "🟠 Naranja",
},
"settings.appearance.showStatistics.title": {
  nl: "Toon Statistieken",
  en: "Show Statistics",
  fr: "Afficher les statistiques",
  de: "Statistiken anzeigen",
  es: "Mostrar estadísticas",
},
"settings.appearance.showStatistics.description": {
  nl: "Toon productiviteitsstatistieken in de sidebar",
  en: "Show productivity statistics in the sidebar",
  fr: "Afficher les statistiques de productivité dans la barre latérale",
  de: "Produktivitätsstatistiken in der Seitenleiste anzeigen",
  es: "Mostrar estadísticas de productividad en la barra lateral",
},
"settings.appearance.animations.title": {
  nl: "Animaties",
  en: "Animations",
  fr: "Animations",
  de: "Animationen",
  es: "Animaciones",
},
"settings.appearance.animations.description": {
  nl: "Schakel visuele animaties en transities in",
  en: "Enable visual animations and transitions",
  fr: "Activer les animations visuelles et les transitions",
  de: "Visuelle Animationen und Übergänge aktivieren",
  es: "Habilitar animaciones visuales y transiciones",
},
"settings.appearance.save": {
  nl: "Uiterlijk Instellingen Opslaan",
  en: "Save Appearance Settings",
  fr: "Sauvegarder les paramètres d'apparence",
  de: "Darstellungseinstellungen speichern",
  es: "Guardar configuración de apariencia",
},

// Integrations
"settings.integrations.title": {
  nl: "Integraties",
  en: "Integrations",
  fr: "Intégrations",
  de: "Integrationen",
  es: "Integraciones",
},
"settings.integrations.description": {
  nl: "Verbind je externe diensten voor een naadloze ervaring",
  en: "Connect your external services for a seamless experience",
  fr: "Connectez vos services externes pour une expérience transparente",
  de: "Verbinden Sie Ihre externen Dienste für eine nahtlose Erfahrung",
  es: "Conecta tus servicios externos para una experiencia perfecta",
},
"settings.integrations.configure": {
  nl: "Configureren",
  en: "Configure",
  fr: "Configurer",
  de: "Konfigurieren",
  es: "Configurar",
},
"settings.integrations.googleCalendar.status": {
  nl: "Configureer Google Calendar integratie",
  en: "Configure Google Calendar integration",
  fr: "Configurer l'intégration Google Calendar",
  de: "Google Calendar-Integration konfigurieren",
  es: "Configurar integración de Google Calendar",
},
"settings.integrations.emailReports.title": {
  nl: "Email Rapporten",
  en: "Email Reports",
  fr: "Rapports par e-mail",
  de: "E-Mail-Berichte",
  es: "Informes por correo",
},
"settings.integrations.emailReports.enabled": {
  nl: "Ingeschakeld",
  en: "Enabled",
  fr: "Activé",
  de: "Aktiviert",
  es: "Habilitado",
},
"settings.integrations.emailReports.disabled": {
  nl: "Uitgeschakeld",
  en: "Disabled",
  fr: "Désactivé",
  de: "Deaktiviert",
  es: "Deshabilitado",
},
"settings.integrations.active": {
  nl: "Actief",
  en: "Active",
  fr: "Actif",
  de: "Aktiv",
  es: "Activo",
},
"settings.integrations.save": {
  nl: "Integratie Instellingen Opslaan",
  en: "Save Integration Settings",
  fr: "Sauvegarder les paramètres d'intégration",
  de: "Integrationseinstellungen speichern",
  es: "Guardar configuración de integraciones",
},

// Danger Zone
"settings.dangerZone.title": {
  nl: "Gevaarlijke Zone",
  en: "Danger Zone",
  fr: "Zone dangereuse",
  de: "Gefahrenzone",
  es: "Zona peligrosa",
},
"settings.dangerZone.description": {
  nl: "Deze acties kunnen niet ongedaan gemaakt worden",
  en: "These actions cannot be undone",
  fr: "Ces actions ne peuvent pas être annulées",
  de: "Diese Aktionen können nicht rückgängig gemacht werden",
  es: "Estas acciones no se pueden deshacer",
},
"settings.dangerZone.resetSettings.title": {
  nl: "Alle Instellingen Resetten",
  en: "Reset All Settings",
  fr: "Réinitialiser tous les paramètres",
  de: "Alle Einstellungen zurücksetzen",
  es: "Restablecer todas las configuraciones",
},
"settings.dangerZone.resetSettings.description": {
  nl: "Zet alle instellingen terug naar standaardwaarden",
  en: "Reset all settings to default values",
  fr: "Remettre tous les paramètres aux valeurs par défaut",
  de: "Alle Einstellungen auf Standardwerte zurücksetzen",
  es: "Restablecer todas las configuraciones a valores predeterminados",
},
"settings.dangerZone.resetSettings.action": {
  nl: "Reset Alles",
  en: "Reset All",
  fr: "Tout réinitialiser",
  de: "Alles zurücksetzen",
  es: "Restablecer todo",
},
"settings.dangerZone.deleteAccount.title": {
  nl: "Account Verwijderen",
  en: "Delete Account",
  fr: "Supprimer le compte",
  de: "Konto löschen",
  es: "Eliminar cuenta",
},
"settings.dangerZone.deleteAccount.description": {
  nl: "Permanent verwijder je account en alle data",
  en: "Permanently delete your account and all data",
  fr: "Supprimer définitivement votre compte et toutes les données",
  de: "Ihr Konto und alle Daten dauerhaft löschen",
  es: "Eliminar permanentemente tu cuenta y todos los datos",
},
"settings.dangerZone.deleteAccount.action": {
  nl: "Verwijderen",
  en: "Delete",
  fr: "Supprimer",
  de: "Löschen",
  es: "Eliminar",
},

};

// Verwijder het losse privacyPolicy object - alles staat nu in translations

class I18nService {
  private currentLanguage: Language = "nl";

  constructor() {
    // Load saved language or detect from browser
    const saved = localStorage.getItem("focusflow_language") as Language;
    if (saved && this.isValidLanguage(saved)) {
      this.currentLanguage = saved;
    } else {
      this.currentLanguage = this.detectBrowserLanguage();
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(lang: Language): void {
    if (this.isValidLanguage(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem("focusflow_language", lang);

      // Update document language
      document.documentElement.lang = lang;

      // Trigger event for components to re-render
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: lang }),
      );
    }
  }

  // VERBETERDE translate functie die interpolatie en returnObjects ondersteunt
  translate(key: string, options?: { returnObjects?: boolean; [key: string]: any }): any {
    const translation = translations[key];

    if (translation && translation[this.currentLanguage]) {
      let result = translation[this.currentLanguage];
      
      // Als we objecten/arrays willen teruggeven (voor lists)
      if (options?.returnObjects) {
        return result;
      }
      
      // Als we een string hebben en interpolatie parameters
      if (typeof result === 'string' && options) {
        for (const [paramKey, paramValue] of Object.entries(options)) {
          if (paramKey !== 'returnObjects') {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          }
        }
      }
      
      return result;
    }

    // Fallback to English if available
    if (translation && translation.en) {
      let result = translation.en;
      
      if (options?.returnObjects) {
        return result;
      }
      
      if (typeof result === 'string' && options) {
        for (const [paramKey, paramValue] of Object.entries(options)) {
          if (paramKey !== 'returnObjects') {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          }
        }
      }
      
      return result;
    }

    // Return key if no translation found
    return key;
  }

  // Alias for shorter usage
  t(key: string, options?: { returnObjects?: boolean; [key: string]: any }): any {
    return this.translate(key, options);
  }

  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: "nl", name: this.t("lang.nl") },
      { code: "en", name: this.t("lang.en") },
      { code: "fr", name: this.t("lang.fr") },
      { code: "de", name: this.t("lang.de") },
      { code: "es", name: this.t("lang.es") },
    ];
  }

  private isValidLanguage(lang: string): lang is Language {
    return ["nl", "en", "fr", "de", "es"].includes(lang);
  }

  private detectBrowserLanguage(): Language {
    const browserLang = navigator.language.split("-")[0];
    return this.isValidLanguage(browserLang) ? browserLang : "nl";
  }
}

export const i18n = new I18nService();

// React hook for easy usage in components
export const useTranslation = () => {
  const [language, setLanguageState] = React.useState(
    i18n.getCurrentLanguage(),
  );

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguageState(event.detail);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
  };

  return {
    language,
    setLanguage,
    t: i18n.t.bind(i18n),
    translate: i18n.translate.bind(i18n),
  };
};

// Add React import for the hook
import React from "react";
