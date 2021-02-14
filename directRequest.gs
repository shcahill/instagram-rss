// const sampleUrl = "https://www.instagram.com/kozukazu/?__a=1";
function requestDirectProfileTest() {
  requestDirectProfile('eujoaoschmidt', '小塚和季')
}

/**
 * 
 * 
 * @userName  アカウント名
 * @displayNmae アプリ上表示名
 */
function requestDirectProfile(userName, displayName) {
  let url = 'https://www.instagram.com/' + userName + '/?__a=1';
  // リクエストヘッダー。cookieのsessionidが必要らしい。user-agentは偽装のため付与
  // ゲストモードでアクセスするとcookieなくてもいけた。確認が必要
  let headers = { 
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
    'cookie': 'sessionid=2036131629%3A9VBZzticaF6rXj%3A11'
  }
  let options = {
    'method': 'get',
    'headers': headers,
  }
  let response = UrlFetchApp.fetch(url, options);
  let json = JSON.parse(response.getContentText());
  let user = json['graphql']['user'];
  
  var list = [];

  let userNeme = user['username'];
  let timeline = user['edge_owner_to_timeline_media']['edges'];
  timeline.forEach(function(item){
    let timelineItem = getTimelineItem(item, userName, displayName);
    list.push(timelineItem);
  });

  return list;
}

function getTimelineItem(item, userName, displayName) {
  let node = item['node'];
  
  let comment = getCommentTextFromInstagram(node);
  let link = 'https://www.instagram.com/p/' + node['shortcode'] + '/';
  let date = convertDateToString(node['taken_at_timestamp']);
  
  var mediaUrl = node['thumbnail_src'];
  var mediaType = 'image/jpeg'
  let videoUrl = node['video_url'];
  if (videoUrl != null) {
    mediaUrl = videoUrl;
    mediaType = 'video/mp4';
  }
  
  return new Instagram(comment, link, date, mediaUrl, mediaType, userName, displayName)
}

function getCommentTextFromInstagram(node) {
  let edges = node['edge_media_to_caption']['edges'];
  if (edges.length == 0) {
    return '';
  }
  return edges[0]['node']['text']
}


/**
 * timestampを文字列に変換します
 */
function convertDateToString(timestamp) {
  // ミリ秒換算
  let date = new Date(timestamp * 1000);
  // Format
  return Utilities.formatDate(date, "JST", "yyyy/MM/dd HH:mm");
}
