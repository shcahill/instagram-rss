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

// TODO: 履歴をとっておきたい
/**
 * main
 */
function updatePlayer() {
  update('player');
}
function updateStaff() {
  update('staff');
}
function updateRental() {
  update('rental');
}
function updatePast() {
  update('past');
}
function updateOther() {
  update('past');
}

function update(name) {
  var accounts = getAccounts(name + 'Account');
  var margeSheet = getSheet(name);
  margeSheet.clear();
  for (var i = 1; i < accounts.length; i++) {
    var id = accounts[i][2];
    
    // NG: https://sebsauvage.net/rss-bridge/
    // 未確認：https://rssbridge.pofilo.fr/?action=display&bridge=Instagram&context=Username&u=kouitakura&media_type=all&format=Json
    var url = 'https://' + domain + '/?action=display&bridge=Instagram&context=Username&u=' + id + '&media_type=all&format=Json'
    var list = request(url, accounts[i][0]);
    insert(margeSheet, list);
  }
  margeSheet.sort(3, false);
}


function insert(sheet, list) {
  var row = sheet.getLastRow() + 1;
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    sheet.getRange(row + i, 1).setValue(item.comment);
    sheet.getRange(row + i, 2).setValue(item.link);
    sheet.getRange(row + i, 3).setValue(item.date);
    sheet.getRange(row + i, 4).setValue(item.media);
    sheet.getRange(row + i, 5).setValue(item.mediaType);
    sheet.getRange(row + i, 6).setValue(item.author);
    sheet.getRange(row + i, 7).setValue(item.displayName);
  };
}