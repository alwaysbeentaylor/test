# 🚀 DEPLOYMENT GUIDE - Hope Connects

## ✅ JE HEBT AL:
- ✅ Airtable API Key
- ✅ Airtable Base ID
- ✅ Backend geconfigureerd
- ✅ Complete website

---

## 🎯 DEPLOY IN 10 MINUTEN

### **OPTIE 1: VERCEL (AANGERADEN - MAKKELIJKST)**

#### Stap 1: Account maken
1. Ga naar **vercel.com**
2. Klik **"Sign Up"**
3. Sign up met **GitHub** (makkelijkst)

#### Stap 2: Deployment
1. Download alle bestanden uit `/hope-connects-complete/`
2. Ga naar vercel.com/new
3. Klik **"Deploy"** of drag & drop je bestanden
4. Vercel detecteert automatisch je setup
5. Klik **"Deploy"**
6. **KLAAR!** Je krijgt een URL zoals: `hope-connects.vercel.app`

#### Stap 3: Test
1. Ga naar je URL
2. Vul het formulier in
3. Check Airtable → lead moet verschijnen
4. Check admin dashboard → lead moet zichtbaar zijn

---

### **OPTIE 2: NETLIFY (ALTERNATIEF)**

#### Stap 1: Account
1. Ga naar **netlify.com**
2. Sign up (gratis)

#### Stap 2: Deploy
1. Drag & drop je bestanden
2. Site wordt automatisch live
3. Je krijgt URL: `hope-connects.netlify.app`

#### Stap 3: Serverless Functions setup
1. Maak folder: `netlify/functions/`
2. Kopieer `server.js` naar `netlify/functions/api.js`
3. Hernoem exports naar Netlify format
4. Redeploy

---

### **OPTIE 3: RAILWAY (VOOR NODE.JS SERVER)**

#### Stap 1: Account
1. Ga naar **railway.app**
2. Sign up met GitHub

#### Stap 2: Deploy
1. Klik **"New Project"**
2. Klik **"Deploy from GitHub repo"**
3. Select je repo (of upload bestanden)
4. Railway detecteert `package.json`
5. Auto-deploy start
6. Je krijgt URL: `hope-connects.up.railway.app`

---

## 🔧 NA DEPLOYMENT

### 1. Update je website URLs

In `index-premium.html` (regel ~1300), vervang:

```javascript
const response = await fetch('https://JOUW-URL-HIER.vercel.app/api/submit', {
```

In `admin.html` (regel ~200), vervang:

```javascript
const response = await fetch('https://JOUW-URL-HIER.vercel.app/api/leads');
```

### 2. Custom Domain (optioneel)

**Vercel:**
1. Ga naar je project → Settings → Domains
2. Voeg toe: `hopeconnects.be`
3. Update DNS bij je registrar:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

**Netlify:**
1. Ga naar Domain Settings
2. Add custom domain
3. Update DNS

---

## 📧 EMAIL SETUP (OPTIONEEL - KAN LATER)

Je backend werkt nu zonder emails. Leads komen in Airtable.

**Als je wél emails wil:**

1. Ga naar **resend.com**
2. Maak gratis account
3. Haal API key
4. Update in `server.js`:
   ```javascript
   const EMAIL_API_KEY = 're_XXXXXXXXXX';
   ```
5. Redeploy

---

## ✅ CHECKLIST

- [ ] Vercel account gemaakt
- [ ] Bestanden geüpload
- [ ] Site deployed
- [ ] URL verkregen (bijv: hope-connects.vercel.app)
- [ ] URL toegevoegd in index-premium.html
- [ ] URL toegevoegd in admin.html
- [ ] Getest: formulier invullen
- [ ] Getest: lead verschijnt in Airtable
- [ ] Getest: admin dashboard toont lead

---

## 🚨 TROUBLESHOOTING

**"CORS error"**
- Server.js heeft al CORS ingebouwd
- Als het toch niet werkt, check Vercel logs

**"Failed to fetch"**
- Check of je URL correct is
- Check of `/api/submit` endpoint werkt
- Test: `https://jouw-url.vercel.app/health` → moet `{"status":"ok"}` geven

**"Airtable unauthorized"**
- Check of token correct is
- Check of Base ID klopt
- Check of table name "Projects" heet (of update in server.js)

**"Leads niet zichtbaar in admin"**
- Check console (F12)
- Verificeer API URL in admin.html
- Test direct: `https://jouw-url.vercel.app/api/leads`

---

## 📞 KLAAR OM TE TESTEN

Na deployment:

1. **Deel je URL met 3 mensen**
2. **Laat ze formulier invullen**
3. **Check Airtable** → leads moeten binnenkomen
4. **Open admin dashboard** → zie alle leads
5. **Markeer als "Verkocht"** → test functionaliteit

---

## 💰 KOSTEN

- Vercel: **GRATIS** (100GB bandwidth/maand)
- Netlify: **GRATIS** (100GB bandwidth/maand)
- Railway: **$5/maand** (500 uur server tijd)
- Airtable: **GRATIS** (1,000 records)

**→ Je kan beginnen zonder €1 uit te geven**

---

## 🎯 VOLGENDE STAP NA DEPLOYMENT

**Test met Facebook Ads:**
1. Budget: €10/dag (3 dagen = €30)
2. Target: Huiseigenaren Brugge, 30-60 jaar
3. Ad: "Droomverbouwing? Offerte binnen 24u"
4. Link: je Vercel URL
5. Verwacht: 15-30 leads
6. Verkoop: 3-5 leads à €75-150
7. **ROI: 5-10x**

---

## ✅ JE HEBT ALLES

Backend is klaar. Credentials zijn ingevuld. Alleen nog uploaden naar Vercel en je bent live.

**KLAAR OM TE DEPLOYEN?** 🚀
