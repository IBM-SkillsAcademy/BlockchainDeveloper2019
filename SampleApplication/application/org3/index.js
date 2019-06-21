require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT;
const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

let swaggerDoc = require('./swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const apiV1 = require('./api/v1/routing');
app.use('/api/v1', apiV1);

app.listen(port, () => {
  console.log('Listening at port: ' + port);
});

module.exports = app;
