let app = require('../app');
let https = require('https');
let fs = require('fs');
let globalConfig = require('../configuration');

const options = {
  cert: fs.readFileSync(globalConfig.caCertPath),
  key: fs.readFileSync(globalConfig.caKeyPath)
};

const port = 443;

https.createServer(options, app).listen(port);

console.log(`server is running at https://localhost:${port}`);