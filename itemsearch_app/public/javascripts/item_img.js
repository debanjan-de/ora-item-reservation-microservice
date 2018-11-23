var express = require('express'),
    router = express.Router();
/*var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

router.use(express.static(path.join(__dirname, 'public')));
router.get('/:file_name', function(req, res){
  res.sendFile(path.join(__dirname, '../uploads/'+req.params.file_name));
});

router.post('/upload', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiples = false;
  form.uploadDir = path.join(__dirname, '../uploads');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
});*/

module.exports = router;
