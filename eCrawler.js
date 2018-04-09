const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
const fetch = require('node-fetch');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ekakao-bafb8.firebaseio.com"
});

const db = admin.database();
const https = require('https');
const cheerio = require('cheerio');

// db.ref('/emoticons').once('value', (snapshot) => {
//   console.log(snapshot.numChildren());
// });

let _itemCode = 5500000;
setInterval(() => {
  let body = '';
  let itemCode = _itemCode;
  let req = https.request({
    host: 'e.kakao.com',
    path: `/store/detail?item_code=${itemCode}&referer=sdk_play.kakao.com_longtap`,
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Host': 'e.kakao.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    }
  }, (res) => {
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      const $ = cheerio.load(body);
      // console.log(body);
      const titleImg = $('img.title_img').attr('src');
      const title = $('.tit_product').text().trim();
      if (titleImg) {
        let body2 = '';
        let req2 = https.request({
          host: 'e.kakao.com',
          path: `/detail/thumb_url?item_code=${itemCode}`,
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Host': 'e.kakao.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
          }
        }, (res2) => {
          res2.on('data', (chunk) => {
            body2 += chunk;
          });
          res2.on('end', () => {
            let list = JSON.parse(body2);
            console.log(itemCode, titleImg, title, list.body.length);
            db.ref(`/emoticons/${itemCode}`).set({
              title,
              itemCode,
              titleImg,
              emoticons: list.body
            });
          })
        })
        req2.end();
      } else {
        console.log(itemCode);
      }
    });
  });
  // req.write();
  req.end();
  _itemCode += 1;
}, 10);