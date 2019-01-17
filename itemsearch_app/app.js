var express = require('express')
    app = express()
    path = require('path')
    bodyParser = require('body-parser')
    request = require("request");
var item_img = require('./public/javascripts/item_img'),
    item_num = require('./public/javascripts/item_num'),
    settings = require('./public/javascripts/settings');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*****************************************
Logging framework initialization again and again and again
*****************************************/
/*var logger = require('fluent-logger');
logger.configure('fluentd.test', {
  host: 'localhost ',
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000 // 10 minutes
});

/*
    swig = require('swig')
    swig = new swig.Swig();

    page_txt = {
      title : 'Search Item Here',
      description : 'You can key in the item number or the image to search items',
      page_title : 'Quick Item search',
      app_name : 'Quick Item Search',
      about : 'About',
      services : 'Services',
      contact : 'Contact',
      languages : 'Languages',
      itemnum_txt : 'Item Number: ',
      reset_txt : 'Reset',
      search_itemnum_txt : 'Search with Item Number',
      find_item_txt : 'Find Item',
      search_img_txt : 'Search with Item Image',
      item_img_txt : 'Item Image: ',
      item_created_on_txt : 'Item Created on: ',
      item_desc_txt : 'Item Description: ',
      home_txt : 'Home',
      item_price_txt : 'Item Price: ',
      item_category_txt : 'Item Category: ',
      settings: 'Settings',
      environment: 'Environment',
      item_limit: 'Set Item Limit',
      item_offset: 'Set Item Offset'
    };
    langtrans_source = ""; //"https://languagetranslator-a446679.apaas.us6.oraclecloud.com/translate/";
var page_lang = 'en';

function render_page(p_page_txt,resp){
  resp.render('index.html', {
    title:p_page_txt.title,
    description:p_page_txt.description,
    page_title:p_page_txt.page_title,
    app_name:p_page_txt.app_name,
    about:p_page_txt.about,
    services:p_page_txt.services,
    contact:p_page_txt.contact,
    languages:p_page_txt.languages,
    itemnum_txt:p_page_txt.itemnum_txt,
    search_itemnum_txt:p_page_txt.search_itemnum_txt,
    reset_txt:p_page_txt.reset_txt,
    find_item_txt:p_page_txt.find_item_txt,
    search_img_txt:p_page_txt.search_img_txt,
    item_img_txt:p_page_txt.item_img_txt,
    item_created_on_txt:p_page_txt.item_created_on_txt,
    item_desc_txt:p_page_txt.item_desc_txt,
    langlist_url:langtrans_source+"langlist",
    langtrans_src:langtrans_source,
    language:page_lang,
    home_txt:p_page_txt.home_txt,
    item_price_txt:p_page_txt.item_price_txt,
    item_category_txt:p_page_txt.item_category_txt,
    settings:p_page_txt.settings,
    environment: p_page_txt.environment,
    item_limit: p_page_txt.item_limit,
    item_offset: p_page_txt.item_offset
  });
}

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.get('/itemsearch', function(req, res) {
  render_page(page_txt,res);
});

app.use('/item_img', item_img);*/
app.use('/item_num', item_num);
app.use('/settings', settings);

app.use('/', express.Router());
app.listen(8091,function(){
  console.log(new Date(Date.now()).toLocaleString()+":: "+"  ///// Live at Port " + 8091);
});
/*app.listen(process.env.PORT || 8091,function(){
  console.log("Live at Port " + process.env.PORT || 8091);
});*/
