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

Array.prototype.findByValueOfObject = function(key, value) {
  return this.filter(function(item) {
    return (item[key] === value);
  });
}

function findInsertCache(cacheKey, cacheData, findOnly){
  //var CACHE_HOST = "https://apaas.us6.oraclecloud.com/";//var CACHE_HOST = process.env.CACHING_INTERNAL_CACHE_URL;
  var Cache = require('accs-cache-handler'), //objCache = new Cache("ItemSearchCache");
      MockCache = Cache.MockCache, objCache = new MockCache('ItemSearchMockCache');
  result_data = '';
  if (findOnly) {
    if (cacheKey != null) {
      objCache.get(cacheKey, 'string', function(err, result){
        if(err){
          console.log(new Date(Date.now()).toLocaleString()+":: "+err);
        }
        result_data = result;
      });
    }
  }else {
    objCache.get(cacheKey, 'string', function(err, result){
      if(err){
        console.log(new Date(Date.now()).toLocaleString()+":: "+err);
      }else {
        console.log(new Date(Date.now()).toLocaleString()+":: "+"Key already present: "+cacheKey);
        return;
      }
    });
    objCache.putIfAbsent(cacheKey, cacheData, function(err){
      if(err){
        console.log(new Date(Date.now()).toLocaleString()+":: "+err);
      }
    });
  }
}

function syncCache(){
  for(x in resp_data){
    if (!(resp_data[x].ItemNumber == undefined)) {
      findInsertCache(resp_data[x].ItemNumber, JSON.stringify(resp_data[x]), false);
    }
  }
}

function writeHeader(res) {
  var res_head = {'Content-Type' : 'application/json'
                ,'Access-Control-Allow-Origin' : '*'};
  res.writeHead(200, res_head);
}

function asyncSeriesCalls(res,itemNum,env,limit,offset){
  async = require("async");
  var host_name="edrx-dev1.scm.us2.oraclecloud.com";
  switch(env) { case "DEV": host_name="edrx-dev1.scm.us2.oraclecloud.com"; break; case "TEST": host_name="edrx-test.scm.us2.oraclecloud.com"; }
  cache_status = '';
  async.series([
    function(callback){
      if (itemNum != null) {
        resp_data = [];
        findInsertCache(itemNum,null,true);
        if (result_data == null) {
          console.log(new Date(Date.now()).toLocaleString()+":: "+"Cache hit missed for ItemNumber: "+itemNum);
          cache_status = 'miss';
          callback(null);
        }else {
          console.log(new Date(Date.now()).toLocaleString()+":: "+"Cache hit success for ItemNumber: "+itemNum);
          cache_status = 'hit';
          resp_data.push(JSON.parse(result_data));
          callback(null);
        }
      }else {
        cache_status = 'miss';
        callback(null);
      }
    },
    function(callback){
      if (cache_status == 'miss') {
        var uname = 'ARUNAVA.SAHA@IN.IBM.COM', pwd = 'Oracle123', qstring="OrganizationCode=IBMMFG";
        var options = {
          host: host_name,
          port: 443,
          path: '/productManagementCommonApi/resources/11.12.1.0/items'+'?'+
          'fields=ItemId,ItemNumber,ItemDescription,AssetCategorySIN,ListPrice&onlyData=true'+'&'+
          'totalResults=true'+'&'+
          'limit='+limit+'&'+
          'offset='+offset+'&'+
          'onlyData=true',
          method: 'GET',
          headers: {
             'Authorization': 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64')
          }
        };
        var request = require('request'), resp_raw = ''; //, callback_flag = null;
        console.log(new Date(Date.now()).toLocaleString()+":: "+JSON.stringify(options,0,4));
        http.request(options, function(res){
          res.on('data', function(chunk) {
             resp_raw += chunk;
          });
          res.on('end', function() {
            //console.log("raw data: "+resp_raw);
            resp_data = JSON.parse(resp_raw).items;
            callback(null);
          });
          res.on('error', function(e) {
              console.log(new Date(Date.now()).toLocaleString()+":: "+"Got error: " + e.message);
              callback(new Error("Failed in get Item details REST call :: "+e.message));
              return;
          });
        }).end();
      }else {
        console.log(new Date(Date.now()).toLocaleString()+":: "+"Skipped get Item details REST call...");
        callback(null);
      }
    },
    function(callback){
      writeHeader(res);
      if(!(itemNum == null)) {
        if (cache_status == 'miss') {
          res.end(JSON.stringify(resp_data.findByValueOfObject("ItemNumber",itemNum)));
        }else {
          res.end(JSON.stringify(resp_data));
        }
      }else {
        res.end(JSON.stringify(resp_data));
      }
      callback(null);
    },
    function(callback){
      if (cache_status == 'miss') {
        syncCache();
        callback(null);
      }
    }],
    function(err, results){
      console.log(new Date(Date.now()).toLocaleString()+":: "+"Entire series completed...");
    }
  );
}

router.post('/find/:env/:limit/:offset', function (req, res) {
  asyncSeriesCalls(res,null,req.params.env,req.params.limit,req.params.offset);
});

router.post('/find/:env/:limit/:offset/:item_num', function (req, res) {
  asyncSeriesCalls(res,req.params.item_num,req.params.env,req.params.limit,req.params.offset);
});

function find_item(res,itemNum,OrgCode){
	var uname = 'SCM IMPU', pwd = 'Oracle123';
    var host_name="edrx-dev1.fa.us2.oraclecloud.com";
	var item_str=(itemNum?"&q=ItemNumber='" + itemNum + "'":null);
	console.log(new Date(Date.now()).toLocaleString()+":: "+"Item string = "+item_str);
	var options = {
	  host: host_name,
	  port: 443,
	  path: "/fscmRestApi/resources/11.13.18.05/items?fields=ItemId,ItemNumber,ItemDescription,AssetCategorySIN,ListPrice,OrganizationCode&onlyData=true"+
	  //OrganizationCode='" + OrgCode + "'" +
	  item_str,
	  method: 'GET',
	  headers: {
		 'Authorization': 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64')
	  }
	};
	var request = require('request'), resp_raw = '';
	console.log(new Date(Date.now()).toLocaleString()+":: "+JSON.stringify(options,0,4));
	http.request(options, function(resp){
	  resp.on('data', function(chunk) {
		 resp_raw += chunk;
	  });
	  resp.on('end', function() {
  		console.log(new Date(Date.now()).toLocaleString()+":: "+"raw data: "+resp_raw);
  		resp_data = JSON.parse(resp_raw).items;
  		res.writeHead(200, {"Content-Type": "application/json"});
  		var output = { data: resp_data };
  		res.end(JSON.stringify(output) + "\n");
  		return;
	  });
	  resp.on('error', function(e) {
		  console.log(new Date(Date.now()).toLocaleString()+":: "+"Got error: " + e.message);
		  res.writeHead(200, {"Content-Type": "application/json"});
		  var output = { error: "Failed in get On-hand details REST call", ItemNumber: itemNum };
		  res.end(JSON.stringify(output) + "\n");
		  return;
	  });
	}).end();
}

router.get('/find/:item_code', function(req, res) {
	find_item(res, req.params.item_code, req.params.orgcode);
});

module.exports = router;
