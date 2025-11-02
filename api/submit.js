// Vercel Serverless Function - Submit Lead to Telegram
const TELEGRAM_BOT_TOKEN = '8577513954:AAG3HpLwUl4t0cxqy5YOdxXwF6sbvEabbsM';
const TELEGRAM_CHAT_ID = '1471110442';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const formData = req.body;
        
        // Calculate lead score
        let score = 0;
        if (formData.budget === '75k+' || formData.budget === '50-75k') score += 5;
        else if (formData.budget === '25-50k') score += 4;
        else if (formData.budget === '10-25k') score += 3;
        else score += 1;
        
        if (formData.timing === 'deze-maand') score += 2;
        else if (formData.timing === '1-3-maanden') score += 1;
        
        formData.score = Math.min(score, 5);
        
        const leadValue = formData.score === 5 ? 150 : 
                         formData.score === 4 ? 100 : 
                         formData.score === 3 ? 50 : 30;
        
        // Create Telegram message
        const stars = '⭐'.repeat(formData.score);
        const urgentFlag = formData.timing === 'deze-maand' ? '🔥 URGENT - WIL DEZE MAAND STARTEN!\n\n' : '';
        
        const message = `
🎉 NIEUWE LEAD!

${urgentFlag}${stars} ${formData.score}-sterren lead
💰 Waarde: €${leadValue}

👤 Naam: ${formData.name}
📧 Email: ${formData.email}
📱 Telefoon: ${formData.phone}
📍 Postcode: ${formData.postcode}

🏠 Project: ${formData.project_type}
💵 Budget: ${formData.budget}
⏰ Timing: ${formData.timing}

🔥 BEL NU!
        `.trim();
        
        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (!telegramResponse.ok) {
            const error = await telegramResponse.text();
            console.error('Telegram error:', error);
            throw new Error(`Telegram error: ${error}`);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Lead verzonden naar Telegram',
            score: formData.score
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
