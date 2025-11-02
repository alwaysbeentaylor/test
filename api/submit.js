// Vercel Serverless Function - Submit Lead
const AIRTABLE_API_KEY = 'pate6aMDOqGm8Cks2.5700b6cfb406f4aa8d34a662533b79d978b10c8b73d211f7d511991ba29d9311';
const AIRTABLE_BASE_ID = 'appmDILb3KWz1obrm';
const AIRTABLE_TABLE_NAME = 'Projects';

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
        
        // Save to Airtable
        const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
        
        const airtableResponse = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    'Naam': formData.name,
                    'Email': formData.email,
                    'Telefoon': formData.phone,
                    'Postcode': formData.postcode,
                    'Project Type': formData.project_type,
                    'Budget': formData.budget,
                    'Timing': formData.timing,
                    'Score': formData.score,
                    'Lead Value': leadValue
                }
            })
        });
        
        if (!airtableResponse.ok) {
            const error = await airtableResponse.text();
            console.error('Airtable error:', error);
            throw new Error(`Airtable error: ${error}`);
        }
        
        const result = await airtableResponse.json();
        
        return res.status(200).json({
            success: true,
            message: 'Lead saved successfully',
            leadId: result.id,
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
