// データ元
// https://fetchrss.com/account

var SHEET_ID = '1hIAo44vIHXLxNXM5n8ntfm1-_Cghxh7LF43AoCWjMDo';
var mainSheet = SpreadsheetApp.openById(SHEET_ID);

function getSheet(name) {
  return mainSheet.getSheetByName(name);
}

/**
 * アカウント一覧の取得
 */
function getAccounts(name) {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
    var lastRow = sheet.getLastRow();
    return sheet.getRange(1, 1, lastRow, 3).getValues();
}

function updatePlayer() {
  var accounts = getAccounts('player');
  for (var i = 1; i < accounts.length; i++) {
    var id = accounts[i][2];
    var sheet = getSheet(accounts[i][1]);
    sheet.clear();
    
    // FIXME: media_typeはpictureしか取得できない
    var url = 'https://sebsauvage.net/rss-bridge/?action=display&bridge=Instagram&context=Username&u=' + id + '&media_type=picture&format=Json'
    var list = request(url);
    insert(sheet, list);
    
    var url = 'https://sebsauvage.net/rss-bridge/?action=display&bridge=Instagram&context=Username&u=' + id + '&media_type=multiple&format=Json'
    var list = request(url);
    insert(sheet, list);
    
    sheet.sort(3, false);
  }
}


function insert(sheet, list) {
  var row = sheet.getLastRow() + 1;
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    sheet.getRange(row + i, 1).setValue(item.comment);
    sheet.getRange(row + i, 2).setValue(item.link);
    sheet.getRange(row + i, 3).setValue(item.date);
    sheet.getRange(row + i, 4).setValue(item.img);
    sheet.getRange(row + i, 5).setValue(item.author);
  };
}