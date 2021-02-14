// https://feed.eugenemolotov.ru/?action=display&bridge=Instagram&context=Username&u=abe_hiroyuki_official&media_type=all&format=Json
var domain = 'rssbridge.co.uk';
var subdomain = 'rss-bridge.cheredeprince.net';

// atomならいけそう。ドットが取得できない
// var domain = 'feed.eugenemolotov.ru';

function request(url, name, usingDomain) {
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());

  // エラーの場合はスルー
  if (json['title'] == usingDomain) {
    sendErrorMail('[Instagram]Error', url, name);
    return [];
  }
  var items = json['items'];
  
  var list = [];
  
  var row = 1;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var id = item['id'];
    var comment = getComment(item['content_html']);
    var link = item['url'];

    var updated = item['date_modified'];
    var date = Utilities.formatDate(new Date(updated), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')
    var media = getMedia(item['attachments']); 
    var mediaUrl = '';
    var mediaType = '';
    if (media != null) {
      mediaUrl = media['url'];
      mediaType = media['mime_type'];
    }
    var author = item['author']['name'];
    
    list.push(new Instagram(comment, link, date, mediaUrl, mediaType, author, name));
  }
  return list;
}

function getComment(html) {
  // 改行の削除
  html = html.replace(/<br\s*\/>/g, '').replace(/<br\s*>/g, '');
  // aタグの削除
  html = html.replace(/<a.*<\/a\s*>/g, '');
  
  // video controlsタグの削除
  html = html.replace(/<video.*<\/video\s*>/g, '');
  return html;
}

function getMedia(list) {
  // 馬渡和彰選手で取れないitemがある
  if(list == null) {
    return null;
  }
  var first = list.find(function(value, index, array) {
    var type = value['mime_type'];
    if (type.indexOf('image') == 0) {
      return true;
    } else {
      return false;
    }
  });

  if (first == null) {
    first = list[0];
  }
  if (first['mime_type'].indexOf('application') == 0) {
    return null;
  }
  return first;
}

function sendErrorMail(title, message, name) {
  var address = 'shcahill2013@gmail.com'
  //メール送信
  MailApp.sendEmail(address, title, message + '\n' + name);
}
