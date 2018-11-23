/***************************************
   Common javascripts for item search
****************************************/
function addItemSection(item_num,item_desc,item_price,item_cat,currency,seq){
  var panel_bdy = document.createElement("div");
  panel_bdy.setAttribute("class","panel-body");
  panel_bdy.setAttribute("id","itemnumres_div"+seq);

  var body_txt = document.createElement("p");
  body_txt.appendChild(document.createTextNode("{{ item_desc_txt }}"+item_desc));
  panel_bdy.appendChild(body_txt);
  body_txt = document.createElement("p");
  body_txt.appendChild(document.createTextNode("{{ item_category_txt }}"+item_cat));
  panel_bdy.appendChild(body_txt);
  body_txt = document.createElement("p");
  body_txt.appendChild(document.createTextNode("{{ item_price_txt }}"+item_price+" "+currency));
  panel_bdy.appendChild(body_txt);

  var panel_hd = document.createElement("div");
  panel_hd.setAttribute("class","panel-heading");
  panel_hd_txt = document.createElement("h4");
  panel_hd_txt.appendChild(document.createTextNode("{{ itemnum_txt }}" + item_num));
  panel_hd.appendChild(panel_hd_txt);

  var panel = document.createElement("div");
  panel.setAttribute("class","panel panel-default");
  panel.appendChild(panel_hd);
  panel.appendChild(panel_bdy);

  var col = document.createElement("div");
  col.setAttribute("class","col-md-4");
  col.appendChild(panel);

  //var d = document.createDocumentFragment();
  //d.appendChild(col);
  document.getElementById("main_results").appendChild(col);
}

function drawHRLine(){
    document.getElementById("main_results").appendChild(document.createElement("hr"));
}

function page_reset(instr){
  //alert('page reset called');
  if (instr == "itemnum") {
    document.getElementById("itemnum").value = "";
    document.getElementById("itemnum_resp").innerHTML = "";
  } else if (instr == "itemimg") {
    $('#imgpreview').html("");
    $('#imghlink').html("");
    document.getElementById('itemimg').value = "";
  }
  document.getElementById("main_results").innerHTML = "<hr>";
}

function getItemDetailsTxt(itemnum){
  page_reset("itemnum");
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();//for Chrome, mozilla etc
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");//for IE only
  }
  var page_lang = document.getElementById("language_hidden").innerHTML,
      env_name = document.getElementById("env_hidden").innerHTML,
      item_limit = document.getElementById("item_limit_hidden").innerHTML,
      item_offset = document.getElementById("item_offset_hidden").innerHTML;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var jsonRespObj = JSON.parse(this.responseText);
        //var item_desc_tl='txt',item_price_tl='txt',item_category_tl='txt';
        //getTranslatedTxt(jsonRespObj,page_lang);
        for (x in jsonRespObj) {
          /*if (page_lang != "en"){
            getTranslatedTxt(jsonRespObj[x],page_lang);
            addItemSection(jsonRespObj[x].item_num,item_desc_tl,item_price_tl,item_category_tl,jsonRespObj[x].currency,x);
          }else*/
          addItemSection(jsonRespObj[x].ItemNumber,jsonRespObj[x].ItemDescription,jsonRespObj[x].ListPrice,"sample category",'USD',x);
          if ((x+1)%3 == 0) {
            drawHRLine();
          }
        }
        drawHRLine();
      }else{
        document.body.innerHTML = this.responseText;
      }
    }
  };
  xhttp.open("POST", "/item_num/find/" + env_name + "/" + item_limit + "/" + item_offset + "/" + itemnum, true);
  xhttp.send();
}

function getTranslatedTxt(src_data,lang){
  //alert("URI: "+"{{ langtrans_src }}trns/"+lang);
  var resp_val = {};
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      //alert("readystate = 4");
      if (this.status == 200) {
        //alert("status = 200");
        resp_val = JSON.parse(this.responseText);
        alert("returned value:"+this.responseText);
      }else{
        document.body.innerHTML = this.responseText;
      }
    }
    //return resp_val;
  };
  alert(JSON.stringify(src_data));
  xhttp.open("POST", "{{ langtrans_src }}trns/"+lang, true);
  xhttp.send(JSON.stringify(src_data));
}

function getLanguageList(){
  document.getElementById("langdropdown").classList.toggle("show");
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();//for Chrome, mozilla etc
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");//for IE only
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var langList = JSON.parse(this.responseText),
            htmlDrpDwnContent = "";
        for (x in langList) {
          if (langList[x].code == 'en') {
            htmlDrpDwnContent += '<a href="/itemsearch">' + langList[x].name + '</a>';
          }else {
            htmlDrpDwnContent += '<a href="/itemsearch/' + langList[x].code +'">' + langList[x].name + '</a>';
          }
        }
        //alert(htmlDrpDwnContent);
        document.getElementById("langdropdown").innerHTML = htmlDrpDwnContent;
      }else{
        document.body.innerHTML = this.responseText;
      }
    }else {
      console.log("readyState: "+this.readyState)
    }
  };
  xhttp.open("GET", "{{ langlist_url }}", true);
  xhttp.send();
}

function set_env_name(env_name){
  document.getElementById("env_hidden").innerHTML = env_name;
  alert("Environment value set: "+document.getElementById("env_hidden").innerHTML);
}
function set_item_limit(item_limit){
  document.getElementById("item_limit_hidden").innerHTML = item_limit;
}
function set_item_offset(item_offset){
  document.getElementById("item_offset_hidden").innerHTML = item_offset;
}
