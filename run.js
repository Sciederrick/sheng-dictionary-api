const app = require('./app.js');
const db = require('./mongo/db');
const port = process.env.PORT || 3005;
const result = require('dotenv').config();
if (result.error) {
   console.log(result.error)
}



//  Start the database
db.init(() => {
   // Start the server
   // @ts-ignore
   app.listen(port, "0.0.0.0", () => {
      console.log('\x1b[35m%s\x1b[0m',`Server listening on: http://localhost:${port}`);
   });
});




