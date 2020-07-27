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
    return sheet.getRange(1, 1, lastRow, 5).getValues();
}

/**
 * main
 */
function updatePlayerForce() {
  update('player', true);
}
function updatePlayer() {
  update('player', false);
}
function updateStaffForce() {
  update('staff', true);
}
function updateStaff() {
  update('staff', false);
}
function updateRental() {
  update('rental', false);
}
function updatePast() {
  update('past', false);
}
function updateOther() {
  update('past', false);
}

function update(name, force) {
  var accounts = getAccounts(name + 'Account');
  var margeSheet = getSheet(name + 'WS');
  margeSheet.clear();
  for (var i = 1; i < accounts.length; i++) {
    var bkupSheet = getSheet(accounts[i][1]);
    if (!force && !isNeedRequest(accounts[i][4])) {
      getFromBackup(bkupSheet, margeSheet);
      continue;
    }
    
    var id = accounts[i][2];
    var useDomain = accounts[i][3];
    if (useDomain == null) {
      useDomain = domain;
    }
    
    // NG: https://sebsauvage.net/rss-bridge/
    // 未確認：https://rssbridge.pofilo.fr/?action=display&bridge=Instagram&context=Username&u=kouitakura&media_type=all&format=Json
    var url = 'https://' + useDomain + '/?action=display&bridge=Instagram&context=Username&u=' + id + '&media_type=all&format=Json'
    var list = request(url, accounts[i][0], useDomain);
    insert(margeSheet, list);

    if (list.length != 0) {
      // バックアップ
      bkupSheet.clear();
      insert(bkupSheet, list);
    } else {
      // 失敗した場合はバックアップからコピー
      getFromBackup(bkupSheet, margeSheet);
    }
  }
  margeSheet.sort(3, false);
  
  copySheet(margeSheet, name)
}

function isNeedRequest(times) {
  var list = String(times).split(",").map(function(element, index, array) {
    return parseInt(element);
  });

  var date = new Date();
  var hour = parseInt(Utilities.formatDate(date, 'Asia/Tokyo', 'H'));
  if (list.indexOf(hour) > -1) {
    return true;
  } else {
    return false;
  }
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

function getFromBackup(source, target) {
  var items = source.getDataRange().getValues();
  if (items[0][2] != null) {
    var row = target.getLastRow() + 1;
    target.getRange(row, 1, items.length, items[0].length).setValues(items);
  }
}
