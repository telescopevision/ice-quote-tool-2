exports.handler = async function(event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Build note with all quote details
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

    // Split name
    const nameParts = (data.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create contact in GHL
    const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pit-f2e85033-d287-4df3-a15e-6ae820ddf330',
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
