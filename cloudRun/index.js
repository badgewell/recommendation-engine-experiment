const express = require("express");
const bodyParser = require("body-parser");

import * as processed from './controller/processed';
import * as dataExtraction from './controller/readData';
import * as pipeline from './controller/pipeline';

const app = express();
app.use(bodyParser.json());

app.get('/readData',dataExtraction.extractData, pipeline.launchPipeline);

app.post('/',processed.readGCS,processed.writeES);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
