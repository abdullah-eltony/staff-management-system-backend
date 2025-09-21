const app = require("./src/index.js");
const config = require("./src/config/config.js");

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});