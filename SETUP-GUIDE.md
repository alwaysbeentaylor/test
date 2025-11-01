# Hope Connects - Backend Setup Guide

## 🎯 Wat je gaat doen:
1. Airtable database opzetten (5 min)
2. Email service configureren (5 min)
3. Backend koppelen aan website (10 min)

---

## STAP 1: AIRTABLE SETUP

### 1.1 Account maken
1. Ga naar **airtable.com**
2. Klik **"Sign up for free"**
3. Maak account (email + wachtwoord)

### 1.2 Base maken
1. Klik **"Start from scratch"** of **"Create a base"**
2. Noem het: **"Hope Connects Leads"**
3. Hernoem de tabel naar: **"Leads"**

### 1.3 Kolommen toevoegen
Voeg deze velden toe (klik + icon rechtsboven):

| Veld Naam | Type | Opties |
|-----------|------|---------|
| Naam | Single line text | - |
| Email | Email | - |
| Telefoon | Phone number | - |
| Postcode | Single line text | - |
| Project Type | Single select | Opties: keuken, badkamer, aanbouw, renovatie |
| Budget | Single select | Opties: <10k, 10-25k, 25-50k, 50-75k, 75k+ |
| Timing | Single select | Opties: deze-maand, 1-3-maanden, 3+-maanden, flexibel |
| Score | Number | Format: Integer, Min: 1, Max: 5 |
| Lead Value | Currency | Format: Euro (€) |
| Verkocht | Checkbox | - |
| Status | Single select | Opties: Nieuw, Contacted, Verkocht |
| Timestamp | Date | Include time: Yes |

### 1.4 API Key krijgen
1. Klik je **avatar** rechtsboven
2. Ga naar **"Developer hub"**
3. Klik **"Personal access tokens"**
4. Klik **"Create new token"**
5. Naam: "Hope Connects Backend"
6. Scopes selecteren:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
7. Access selecteren:
   - Kies je "Hope Connects Leads" base
8. Klik **"Create token"**
9. **KOPIEER DE TOKEN** (je ziet hem maar 1x!)
   - Ziet eruit als: `patXXXXXXXXXXXXXX`

### 1.5 Base ID krijgen
1. Ga naar je base
2. Klik **"Help"** rechtsboven
3. Klik **"API documentation"**
4. Je ziet je Base ID bovenaan:
   - Ziet eruit als: `appXXXXXXXXXXXXXX`
5. **KOPIEER DEZE**

---

## STAP 2: EMAIL SERVICE SETUP

Je hebt 2 opties:

### Optie A: Resend (AANGERADEN - makkelijk)

1. Ga naar **resend.com**
2. Klik **"Sign up"**
3. Verificeer je email
4. Ga naar **"API Keys"**
5. Klik **"Create API Key"**
6. Naam: "Hope Connects"
7. Permission: Full Access
8. **KOPIEER DE KEY**
   - Ziet eruit als: `re_XXXXXXXXXXXXXXXX`

**Domain verificatie (belangrijk!):**
1. Ga naar **"Domains"**
2. Klik **"Add Domain"**
3. Vul in: `hopeconnects.be` (of je eigen domain)
4. Volg de DNS instructies
5. Wacht tot verified (kan 24 uur duren)

**Voor testen zonder eigen domain:**
- Gebruik `onboarding@resend.dev` als from-address
- Je kan alleen naar je eigen email sturen tijdens testing

### Optie B: SendGrid (alternatief)

1. Ga naar **sendgrid.com**
2. Maak gratis account (100 emails/dag gratis)
3. Ga naar **Settings → API Keys**
4. Create API Key
5. Kopieer de key

---

## STAP 3: BACKEND CONFIGUREREN

### 3.1 Vul je credentials in

Open `backend.js` en vervang:

```javascript
const AIRTABLE_API_KEY = 'patXXXXXXXXXXXXXX'; // Jouw Airtable token
const AIRTABLE_BASE_ID = 'appXXXXXXXXXXXXXX';  // Jouw Base ID
const EMAIL_API_KEY = 're_XXXXXXXXXXXXXXXX';    // Jouw Resend/SendGrid key
const YOUR_EMAIL = 'jouw@email.com';            // Waar je notificaties wil ontvangen
```

### 3.2 Deploy backend

Je hebt 3 opties:

#### Optie A: Vercel (MAKKELIJKST)
1. Ga naar **vercel.com**
2. Sign up met GitHub
3. Klik **"Add New → Project"**
4. Import je GitHub repo (of upload bestanden)
5. Deploy
6. Kopieer je deployment URL

#### Optie B: Netlify Functions
1. Ga naar **netlify.com**
2. Sign up
3. Drag & drop je bestanden
4. Deploy

#### Optie C: Cloudflare Workers (gratis, unlimited)
1. Ga naar **workers.cloudflare.com**
2. Maak account
3. Create new worker
4. Kopieer backend.js code
5. Deploy

### 3.3 Update website

In `index-premium.html`, vervang:

```javascript
// Form submission (regel ~1150)
const response = await fetch('https://JOUW-BACKEND-URL/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

In `admin.html`, vervang:

```javascript
// Fetch leads (regel ~50)
const response = await fetch('https://JOUW-BACKEND-URL/api/leads');
const data = await response.json();
leads = data.leads;
```

---

## STAP 4: TESTEN

### 4.1 Test het formulier
1. Open je website
2. Vul het formulier in
3. Check of lead in Airtable verschijnt
4. Check je email (klant + jouw notificatie)

### 4.2 Test admin dashboard
1. Open admin.html
2. Check of leads laden
3. Test "Mark as Sold" functie

---

## ⚡ QUICK START (zonder eigen domain)

Als je gewoon wil testen zonder domain setup:

1. Gebruik Airtable (stap 1)
2. **SKIP email service** voorlopig
3. Leads komen in Airtable
4. Je checkt ze handmatig in dashboard
5. Voeg emails later toe als je een domain hebt

---

## 🚨 TROUBLESHOOTING

**"CORS error"**
- Je backend moet CORS headers sturen
- Voeg toe aan je API response:
```javascript
headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}
```

**"401 Unauthorized" bij Airtable**
- Check of je token correct is
- Check of token de juiste scopes heeft
- Check of Base ID klopt

**"Email niet ontvangen"**
- Check spam folder
- Verificeer je domain in Resend
- Check of API key correct is
- Voor testing: gebruik `onboarding@resend.dev`

**"Leads niet zichtbaar in dashboard"**
- Check console voor errors (F12)
- Verificeer API endpoint URL
- Check of Airtable token read permission heeft

---

## 📊 KOSTEN OVERZICHT

| Service | Gratis Tier | Wat je krijgt |
|---------|-------------|---------------|
| **Airtable** | Ja | 1,000 records/base, unlimited bases |
| **Resend** | Ja | 100 emails/dag, 1 domain |
| **Vercel** | Ja | Unlimited websites, 100GB bandwidth |
| **Netlify** | Ja | 100GB bandwidth, 300 build minutes |

**→ Alles blijft gratis tot je >100 leads/dag hebt**

---

## 🎯 VOLGENDE STAPPEN

Na setup:
1. ✅ Test alles grondig
2. ✅ Voeg je eigen domain toe
3. ✅ Pas email templates aan (kleuren, logo)
4. ✅ Voeg Google Analytics toe (optioneel)
5. ✅ Test met echte ads (€50-100 budget)

---

## ❓ HULP NODIG?

Als je vastloopt:
1. Check console errors (F12 in browser)
2. Check Airtable API logs
3. Check email service logs
4. Stuur me error messages

**Common fix: Als NIETS werkt**
- Gebruik Airtable formulier direct (quick fix)
- Embed Airtable form in je site
- Niet zo mooi maar werkt 100%
