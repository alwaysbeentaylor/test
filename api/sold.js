// Vercel Serverless Function - Mark Lead as Sold
const AIRTABLE_API_KEY = 'pate6aMDOqGm8Cks2.5700b6cfb406f4aa8d34a662533b79d978b10c8b73d211f7d511991ba29d9311';
const AIRTABLE_BASE_ID = 'appmDILb3KWz1obrm';
const AIRTABLE_TABLE_NAME = 'Projects';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'Lead ID required' });
        }
        
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${id}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    'Verkocht': true,
                    'Status': 'Verkocht'
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update lead');
        }
        
        const result = await response.json();
        return res.status(200).json({ success: true, lead: result });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
