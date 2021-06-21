require('dotenv').config();
require('./lib/client').connect();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`stared on ${PORT}`);
})