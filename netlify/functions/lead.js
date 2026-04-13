exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    const emailBody = `
<h2>🧊 ICE COOLING QUOTE TOOL LEAD</h2>
<hr>
<p><strong>NAME:</strong> ${data.name}</p>
<p><strong>PHONE:</strong> ${data.phone}</p>
<p><strong>ZIP:</strong> ${data.zip || 'Not provided'}</p>
<p><strong>SOURCE:</strong> ${data.referral || 'Not specified'}</p>
<hr>
<p><strong>SYSTEM:</strong> ${data.system}</p>
<p><strong>SEER:</strong> ${data.seer}</p>
<p><strong>PRICE:</strong> ${data.price}</p>
<p><strong>PAYMENT:</strong> ${data.payment}</p>
<p><strong>FINANCE TERM:</strong> ${data.finance_term || 'N/A'}</p>
<hr>
<p><strong>UPSELLS:</strong> ${data.upsells}</p>
<p><strong>PATH:</strong> ${data.path}</p>
<p><strong>AC AGE:</strong> ${data.ac_age}</p>
<p><strong>MOBILE HOME:</strong> ${data.mobile_home || 'Not selected'}</p>
<p><strong>SCHEDULE:</strong> ${data.schedule_day} - ${data.schedule_time}</p>
<hr>
<p><strong>SUBMITTED:</strong> ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}</p>
    `;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_FWc7rnvx_CaM2WGExB4N2Q4vrLtYpbwR4',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ICE Quote Tool <onboarding@resend.dev>',
        to: ['robert.icecooling@gmail.com'],
        subject: `🧊 New Quote Lead: ${data.name} — ${data.price}`,
        html: emailBody
      })
    });

    const emailData = await emailRes.json();
    console.log('Resend response status:', emailRes.status);
    console.log('Resend response body:', JSON.stringify(emailData));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, emailStatus: emailRes.status })
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
