# OAuth Setup Instructies

Voor echte Google Calendar en Microsoft Outlook integratie moet je OAuth applicaties configureren.

## Google OAuth Setup

### 1. Google Cloud Console

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Maak een nieuw project aan of selecteer een bestaand project
3. Navigeer naar "APIs & Services" > "Credentials"

### 2. OAuth 2.0 Client ID aanmaken

1. Klik op "Create Credentials" > "OAuth 2.0 Client ID"
2. Kies "Web application" als application type
3. Voeg authorized redirect URIs toe:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### 3. APIs inschakelen

Ga naar "APIs & Services" > "Library" en schakel deze APIs in:

- Google Calendar API
- Gmail API
- Google+ API (voor user profile)

### 4. Environment variabelen

Kopieer je Client ID en Client Secret naar `.env`:

```
VITE_GOOGLE_CLIENT_ID=123456789-xxxxxxxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

## Microsoft OAuth Setup

### 1. Azure App Registration

1. Ga naar [Azure Portal](https://portal.azure.com/)
2. Navigeer naar "Azure Active Directory" > "App registrations"
3. Klik "New registration"

### 2. App configureren

1. Geef je app een naam (bijv. "FocusFlow Calendar Integration")
2. Kies "Accounts in any organizational directory and personal Microsoft accounts"
3. Voeg redirect URI toe:
   - Platform: "Web"
   - URI: `http://localhost:3000/auth/microsoft/callback`

### 3. API Permissions instellen

Ga naar "API permissions" en voeg toe:

- Microsoft Graph:
  - `Calendars.Read`
  - `Mail.Read`
  - `User.Read`
  - `offline_access`

### 4. Client Secret aanmaken

1. Ga naar "Certificates & secrets"
2. Klik "New client secret"
3. Kopieer de secret waarde (deze verdwijnt!)

### 5. Environment variabelen

Voeg toe aan `.env`:

```
VITE_MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789012
VITE_MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxx
```

## Productie Deployment

### HTTPS Vereist

OAuth providers vereisen HTTPS voor productie. Zorg ervoor dat:

1. Je app draait op HTTPS
2. Redirect URIs gebruiken HTTPS
3. Je domein is geverifieerd bij de OAuth providers

### Redirect URIs updaten

Update de redirect URIs in beide providers:

- Google: `https://yourdomain.com/auth/google/callback`
- Microsoft: `https://yourdomain.com/auth/microsoft/callback`

### Environment variabelen productie

```
VITE_GOOGLE_CLIENT_ID=production-google-client-id
VITE_GOOGLE_CLIENT_SECRET=production-google-secret
VITE_MICROSOFT_CLIENT_ID=production-microsoft-client-id
VITE_MICROSOFT_CLIENT_SECRET=production-microsoft-secret
VITE_ENV=production
```

## Testen

### Test Google integratie:

1. Klik "Koppel Google Calendar"
2. Log in met je Google account
3. Geef permissions voor Calendar en Gmail
4. Controleer of calendars worden geladen

### Test Microsoft integratie:

1. Klik "Koppel Microsoft Outlook"
2. Log in met je Microsoft account
3. Geef permissions voor Calendar en Mail
4. Controleer of calendars worden geladen

## Troubleshooting

### Common Issues:

**"Popup blocked"**

- Zorg ervoor dat popups zijn toegestaan voor je domein

**"Invalid redirect URI"**

- Controleer dat de redirect URI exact overeenkomt
- Let op trailing slashes en http vs https

**"Insufficient permissions"**

- Controleer dat alle benodigde scopes zijn toegevoegd
- Voor Microsoft: grant admin consent indien nodig

**"Token refresh failed"**

- Controleer dat `offline_access` scope is toegevoegd
- Voor Google: zorg dat `access_type=offline` wordt gebruikt

### Debug Mode

Zet `VITE_ENV=development` om debug logs te zien in de browser console.

## Security Considerations

1. **Client Secrets**: Gebruik nooit client secrets in frontend code voor productie
2. **PKCE**: Overweeg PKCE flow voor extra beveiliging
3. **Token Storage**: Tokens worden in localStorage opgeslagen - overweeg veiligere opslag
4. **CORS**: Configureer juiste CORS instellingen voor je API endpoints
5. **Rate Limiting**: Implementeer rate limiting voor API calls

Voor productie-ready implementatie, overweeg een backend service voor token management en API calls.
