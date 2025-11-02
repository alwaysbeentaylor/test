// Vercel Serverless Function - Get Leads
const AIRTABLE_API_KEY = 'pate6aMDOqGm8Cks2.2c8853d332a3a5354ffcb059e659f8568274b309801df1642b1d61440939782c';
const AIRTABLE_BASE_ID = 'appEqYR1F9xWxa8OX';
const AIRTABLE_TABLE_NAME = 'Projects';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch leads');
        }
        
        const data = await response.json();
        
        const leads = data.records.map(record => ({
            id: record.id,
            name: record.fields['Naam'] || '',
            email: record.fields['Email'] || '',
            phone: record.fields['Telefoon'] || '',
            postcode: record.fields['Postcode'] || '',
            project_type: record.fields['Project Type'] || '',
            budget: record.fields['Budget'] || '',
            timing: record.fields['Timing'] || '',
            score: record.fields['Score'] || 0,
            leadValue: record.fields['Lead Value'] || 0,
            sold: record.fields['Verkocht'] || false,
            status: record.fields['Status'] || 'Nieuw',
            timestamp: record.fields['Timestamp'] || record.createdTime
        }));
        
        return res.status(200).json({ leads });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
