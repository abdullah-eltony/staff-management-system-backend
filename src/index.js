const express = require('express');
const config = require('./config/config');
const pool = require('./db');
const app = express();







// listen on the specified port
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
