import app from "./src/index.js"
import config from "./src/config/config.js";


app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});