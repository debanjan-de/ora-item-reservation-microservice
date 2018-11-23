var express = require('express'),
    router = express.Router();

router.get('/:name', function (req, res, next) {

    var options = {
      root: __dirname + '/../public/images/',
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      }
    });

  });

module.exports = router;
