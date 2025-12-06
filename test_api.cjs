const https = require('http');

// Login first
const loginData = JSON.stringify({
  username: 'test@example.com',
  password: 'password'
});

const loginOptions = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = https.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const loginResponse = JSON.parse(data);
      const token = loginResponse.token;
      
      console.log('Login successful, token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      
      // Now fetch lookups
      const lookupsOptions = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/lookups',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const lookupsReq = https.request(lookupsOptions, (res2) => {
        let lookupsData = '';
        
        res2.on('data', (chunk) => {
          lookupsData += chunk;
        });
        
        res2.on('end', () => {
          const lookupsResponse = JSON.parse(lookupsData);
          console.log('\n=== SERVICES ===');
          console.log('First service:', JSON.stringify(lookupsResponse.services[0], null, 2));
          console.log('\n=== PRODUCTS ===');
          console.log('First product:', JSON.stringify(lookupsResponse.products[0], null, 2));
        });
      });
      
      lookupsReq.on('error', (e) => {
        console.error('Lookups request error:', e);
      });
      
      lookupsReq.end();
      
    } catch (e) {
      console.error('Login response parse error:', e);
      console.log('Raw response:', data);
    }
  });
});

loginReq.on('error', (e) => {
  console.error('Login request error:', e);
});

loginReq.write(loginData);
loginReq.end();
