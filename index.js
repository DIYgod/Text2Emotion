var express = require('express');
var logger = require('./tools/logger');
require('./tools/mongodb');

logger.info(`🍻 Text2Emotion start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/', require('./routes/get'));
app.get('/wenzhi', require('./routes/wenzhi'));
app.listen(1210);