
const http = require('http');

http.get('http://gtasan.vn/mobile/launcher/distribution.json', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        console.log("Server appVersion: " + json.launcher.appVersion);
    } catch (e) {
        console.log("Error parsing JSON: " + e.message);
        console.log("Raw data: " + data.substring(0, 100));
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
