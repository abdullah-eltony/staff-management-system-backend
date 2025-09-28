import app from "./src/index.js"
import config from "./src/config/config.js";


app.listen(config.serverPort, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${config.serverPort}`);
});