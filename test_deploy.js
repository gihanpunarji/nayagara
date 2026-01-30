const https = require('https');

async function testMethod(method) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'nayagara.vercel.app',
      path: '/api/products/10/status',
      method: method,
      headers: {
        'Content-Type': 'application/json'
        // No auth token provided, so we expect 401 Unauthorized if route exists
        // If route does NOT exist, we expect 404 Not Found (HTML or JSON)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`[${method}] Status: ${res.statusCode}`);
        // console.log(`[${method}] Body: ${data.substring(0, 100)}...`);
        resolve(res.statusCode);
      });
    });

    req.on('error', (e) => {
      console.error(`[${method}] Error: ${e.message}`);
      resolve('ERROR');
    });

    req.end();
  });
}

(async () => {
    console.log("Testing Production Endpoints...");
    await testMethod('GET'); // Should be 404 or 405 or fallthrough
    await testMethod('PATCH');
    await testMethod('PUT');
    await testMethod('POST');
})();
