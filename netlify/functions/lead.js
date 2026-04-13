exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    const note = `ICE COOLING QUOTE TOOL LEAD
━━━━━━━━━━━━━━━━━━━━━━━━
NAME: ${data.name}
PHONE: ${data.phone}
ZIP: ${data.zip || 'Not provided'}
SOURCE: ${data.referral || 'Not specified'}
━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM: ${data.system}
SEER: ${data.seer}
PRICE: ${data.price}
PAYMENT: ${data.payment}
FINANCE TERM: ${data.finance_term || 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━
UPSELLS: ${data.upsells}
PATH: ${data.path}
AC AGE: ${data.ac_age}
SCHEDULE: ${data.schedule_day} - ${data.schedule_time}
━━━━━━━━━━━━━━━━━━━━━━━━
SUBMITTED: ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`;

    const nameParts = (data.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pit-9b0c1a20-e9f5-4b26-9579-364dcb2d95a9',
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: data.phone,
        postalCode: data.zip || '',
        locationId: 'sz3hqMSQ0Gt6l2g6kJ31',
        source: 'ICE Quote Tool',
        tags: ['ice-quote-tool', 'quote-lead'],
        customFields: []
      })
    });

    const ghlData = await ghlResponse.json();
    console.log('GHL response status:', ghlResponse.status);
    console.log('GHL response body:', JSON.stringify(ghlData));

    const contactId = ghlData.contact && ghlData.contact.id;

    if (contactId) {
      const noteRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pit-9b0c1a20-e9f5-4b26-9579-364dcb2d95a9',
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({ body: note })
      });
      console.log('Note response status:', noteRes.status);
    } else {
      console.log('No contactId returned — contact creation likely failed.');
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, contactId: contactId || null, ghlStatus: ghlResponse.status })
    };

  } catch (err) {
    console.log('Function error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
