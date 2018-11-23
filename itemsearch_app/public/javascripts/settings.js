var express = require('express'),
    app = express(),
    http = require('https'),
    bodyParser = require('body-parser');
var router = express.Router(), resp_data = [], result_data = '', cache_status = '';
app.use(bodyParser.raw());
router.use(function (request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

router.post('/settings/env/:env_name', function (req, res) {
  //asyncSeriesCalls(res,req.params.env_name);
});

router.post('/settings/item_limit', function (req, res) {
  //asyncSeriesCalls(res,req.params.item_num);
});

router.post('/settings/item_offset', function (req, res) {
  //asyncSeriesCalls(res,req.params.item_num);
});

module.exports = router;
