// Hope Connects - Backend API Handler
// This handles form submissions, saves to Airtable, and sends emails

const AIRTABLE_API_KEY = 'pate6aMDOqGm8Cks2.5700b6cfb406f4aa8d34a662533b79d978b10c8b73d211f7d511991ba29d9311';
const AIRTABLE_BASE_ID = 'appmDILb3KWz1obrm';
const AIRTABLE_TABLE_NAME = 'Projects'; // Your table name

// Email configuration (using a service like SendGrid, Resend, or similar)
const EMAIL_API_KEY = 'YOUR_EMAIL_API_KEY_HERE'; // Add later when you setup Resend
const YOUR_EMAIL = 'lesleyhope@live.nl';

async function handleFormSubmission(formData) {
    try {
        // Calculate lead score
        let score = 0;
        
        // Budget scoring
        if (formData.budget === '75k+' || formData.budget === '50-75k') score += 5;
        else if (formData.budget === '25-50k') score += 4;
        else if (formData.budget === '10-25k') score += 3;
        else score += 1;
        
        // Timing scoring
        if (formData.timing === 'deze-maand') score += 2;
        else if (formData.timing === '1-3-maanden') score += 1;
        
        formData.score = Math.min(score, 5);
        formData.sold = false;
        formData.timestamp = new Date().toISOString();
        
        // Calculate estimated lead value
        const leadValue = formData.score === 5 ? 150 : 
                         formData.score === 4 ? 100 : 
                         formData.score === 3 ? 50 : 30;
        formData.leadValue = leadValue;
        
        // Save to Airtable
        const airtableResponse = await saveToAirtable(formData);
        
        // Send confirmation email to customer
        await sendCustomerEmail(formData);
        
        // Send notification email to you
        await sendNotificationEmail(formData);
        
        return {
            success: true,
            message: 'Lead saved successfully',
            leadId: airtableResponse.id,
            score: formData.score
        };
        
    } catch (error) {
        console.error('Error handling form submission:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function saveToAirtable(formData) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const response = await fetch(url, {
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
                'Lead Value': formData.leadValue,
                'Verkocht': false,
                'Timestamp': formData.timestamp,
                'Status': 'Nieuw'
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to save to Airtable');
    }
    
    return await response.json();
}

async function sendCustomerEmail(formData) {
    // Using Resend API (you can swap this for SendGrid, Mailgun, etc.)
    const url = 'https://api.resend.com/emails';
    
    const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #D4AF37 0%, #FF8C42 100%); padding: 30px; text-align: center; color: white; }
                .content { background: #f9f9f9; padding: 30px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .cta-button { display: inline-block; padding: 15px 30px; background: #D4AF37; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Bedankt voor je aanvraag!</h1>
                </div>
                <div class="content">
                    <h2>Hallo ${formData.name},</h2>
                    <p>We hebben je aanvraag voor een <strong>${formData.project_type}</strong> verbouwing ontvangen.</p>
                    
                    <h3>Wat gebeurt er nu?</h3>
                    <p>✓ We bellen je binnen 24 uur op <strong>${formData.phone}</strong></p>
                    <p>✓ We bespreken je wensen en budget</p>
                    <p>✓ Je krijgt een transparante offerte op maat</p>
                    
                    <p><strong>Je gegevens:</strong></p>
                    <ul>
                        <li>Project: ${formData.project_type}</li>
                        <li>Budget: ${formData.budget}</li>
                        <li>Timing: ${formData.timing}</li>
                        <li>Locatie: ${formData.postcode}</li>
                    </ul>
                    
                    <p>Heb je nog vragen? Bel ons op <strong>+32 50 123 456</strong></p>
                    
                    <p>Met vriendelijke groet,<br><strong>Hope Connects Team</strong></p>
                </div>
                <div class="footer">
                    <p>Hope Connects - Premium Verbouwingen Brugge</p>
                    <p>info@hopeconnects.be | +32 50 123 456</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${EMAIL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Hope Connects <noreply@hopeconnects.be>',
            to: formData.email,
            subject: '✓ Je verbouwingsaanvraag is ontvangen',
            html: emailHTML
        })
    });
    
    if (!response.ok) {
        console.error('Failed to send customer email');
    }
}

async function sendNotificationEmail(formData) {
    const stars = '⭐'.repeat(formData.score);
    
    const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #D4AF37; padding: 20px; text-align: center; color: white; }
                .content { background: #f9f9f9; padding: 30px; }
                .score { font-size: 48px; text-align: center; margin: 20px 0; }
                .urgent { background: #FF4500; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
                .info-table td:first-child { font-weight: bold; width: 40%; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Nieuwe Lead Binnengekomen!</h1>
                </div>
                <div class="content">
                    ${formData.timing === 'deze-maand' ? '<div class="urgent">⚠️ URGENT - Wil deze maand starten!</div>' : ''}
                    
                    <div class="score">${stars}</div>
                    <p style="text-align: center; font-size: 20px;"><strong>${formData.score}/5 sterren lead</strong></p>
                    <p style="text-align: center;">Geschatte waarde: <strong>€${formData.leadValue}</strong></p>
                    
                    <table class="info-table">
                        <tr><td>Naam</td><td>${formData.name}</td></tr>
                        <tr><td>Email</td><td>${formData.email}</td></tr>
                        <tr><td>Telefoon</td><td>${formData.phone}</td></tr>
                        <tr><td>Postcode</td><td>${formData.postcode}</td></tr>
                        <tr><td>Project</td><td>${formData.project_type}</td></tr>
                        <tr><td>Budget</td><td>${formData.budget}</td></tr>
                        <tr><td>Timing</td><td>${formData.timing}</td></tr>
                    </table>
                    
                    <p style="background: #D4AF37; color: white; padding: 15px; border-radius: 5px; text-align: center;">
                        <strong>👉 Bel ${formData.name} binnen 24 uur!</strong>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const url = 'https://api.resend.com/emails';
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${EMAIL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Hope Connects System <system@hopeconnects.be>',
            to: YOUR_EMAIL,
            subject: `${stars} Nieuwe ${formData.score}-sterren lead: ${formData.name}`,
            html: emailHTML
        })
    });
    
    if (!response.ok) {
        console.error('Failed to send notification email');
    }
}

// Fetch leads from Airtable (for admin dashboard)
async function fetchLeads() {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch leads from Airtable');
    }
    
    const data = await response.json();
    
    return data.records.map(record => ({
        id: record.id,
        name: record.fields['Naam'],
        email: record.fields['Email'],
        phone: record.fields['Telefoon'],
        postcode: record.fields['Postcode'],
        project_type: record.fields['Project Type'],
        budget: record.fields['Budget'],
        timing: record.fields['Timing'],
        score: record.fields['Score'],
        leadValue: record.fields['Lead Value'],
        sold: record.fields['Verkocht'],
        timestamp: record.fields['Timestamp'],
        status: record.fields['Status']
    }));
}

// Update lead as sold
async function markLeadAsSold(leadId) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${leadId}`;
    
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
    
    return await response.json();
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleFormSubmission,
        fetchLeads,
        markLeadAsSold
    };
}
