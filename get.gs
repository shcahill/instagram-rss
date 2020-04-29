// アプリからのRSS取得API(json)
// dev url
// https://script.google.com/macros/s/AKfycbzoAvnkBEJHEUK3W0MCTJFChQ7BZjB60iVwLB86MoY/dev?type=
// type = [player,fw,staff]
// limit = ??
var spreadSheetId = '1hIAo44vIHXLxNXM5n8ntfm1-_Cghxh7LF43AoCWjMDo';

function doGet(e) {
  if (e == null) {
    return getRss(e)
  }
  
  var path = e.parameter.path
  if (path == 'accounts') {
    return getAccountsJson()
  } else {
    return getRss(e)
  }    
}

// path = rss
function getRss(e) {
  // スプレッドシート取得
  var sheetName = 'player'
  if (e != null && e.parameter != null && e.parameter.type != null) {
    var sheetName = e.parameter.type
  }
    
  var spreadSheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
 
  // 20x5セルのデータを一度に取得しておく
  var limit = 10
  if (e != null && e.parameter != null && e.parameter.limit != null) {
    limit = e.parameter.limit
  }
  var range = spreadSheet.getRange(1, 1, limit, 6);
 
  // JSON
  var jsonArray = [];
  for(var i=0; i<limit; i++) {
    var line = range.getValues()[i];
    var json = new Object();
    json['link'] = line[1];
    json['text'] = line[0];
    json['pubDate'] = line[2]
    json['picture'] = line[3]
    json['author'] = line[5]
    jsonArray.push(json);
  }

  var ret = {}
  ret['items'] = jsonArray
  return ContentService.createTextOutput(JSON.stringify(ret, null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}

// path = accounts
function getAccountsJson() {
    // JSON
  var jsonArray = [];
  
//  var players = getPlayerAccounts()
//  for (var i = 0; i < players.length; i++) {
//    var json = new Object();
//    json['name'] = players[i].name
//    json['topic'] = players[i].topic
//    jsonArray.push(json);
//  }
 
  return ContentService.createTextOutput(JSON.stringify(jsonArray, null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}