// Simple Express server for Hope Connects backend
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Airtable configuration
const AIRTABLE_API_KEY = 'pate6aMDOqGm8Cks2.5700b6cfb406f4aa8d34a662533b79d978b10c8b73d211f7d511991ba29d9311';
const AIRTABLE_BASE_ID = 'appmDILb3KWz1obrm';
const AIRTABLE_TABLE_NAME = 'Projects';
const YOUR_EMAIL = 'lesleyhope@live.nl';

// Submit lead endpoint
app.post('/api/submit', async (req, res) => {
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
                    'Lead Value': leadValue,
                    'Status': 'Nieuw'
                }
            })
        });
        
        if (!airtableResponse.ok) {
            throw new Error('Failed to save to Airtable');
        }
        
        const result = await airtableResponse.json();
        
        res.json({
            success: true,
            message: 'Lead saved successfully',
            leadId: result.id,
            score: formData.score
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all leads endpoint
app.get('/api/leads', async (req, res) => {
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
        
        res.json({ leads });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Mark lead as sold endpoint
app.patch('/api/leads/:id/sold', async (req, res) => {
    try {
        const { id } = req.params;
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
        res.json({ success: true, lead: result });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
