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

// let itemCode = 4411711;
// let title = '러브라이브! 선샤인!!'
// let body2 = '';
// let req2 = https.request({
//   host: 'e.kakao.com',
//   path: `/detail/thumb_url?item_code=${itemCode}`,
//   method: 'GET',
//   headers: {
//     'Accept': '*/*',
//     'Accept-Encoding': 'gzip, deflate, br',
//     'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
//     'Connection': 'keep-alive',
//     'Cache-Control': 'max-age=0',
//     'Host': 'e.kakao.com',
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
//   }
// }, (res2) => {
//   res2.on('data', (chunk) => {
//     body2 += chunk;
//   });
//   res2.on('end', () => {
//     let list = JSON.parse(body2);
//     console.log(list);
//     // console.log(itemCode, titleImg, title, list.body.length);
//     db.ref(`/emoticons/${itemCode}`).set({
//       title,
//       itemCode,
//       titleImg,
//       emoticons: list.body
//     });
//   })
// })
// req2.end();

// let _itemCode = 2918467;
// setInterval(() => {
//   let body = '';
//   let itemCode = _itemCode;
//   let req = https.request({
//     host: 'e.kakao.com',
//     path: `/store/detail?item_code=${itemCode}&referer=sdk_live-tv.kakao.com_longtap`,
//     method: 'GET',
//     headers: {
//       'Accept': '*/*',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
//       'Connection': 'keep-alive',
//       'Cache-Control': 'max-age=0',
//       'Host': 'e.kakao.com',
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
//     }
//   }, (res) => {
//     res.on('data', (chunk) => {
//       body += chunk;
//     });
//     res.on('end', () => {
//       const $ = cheerio.load(body);
//       const titleImg = $('img.thumb_img').attr('src');
//       // const titleImg = body.split('"og:image" content="')[1].split(`"`)[0];
//       const title = $('.tit_product').text().trim();
//       // const title = body.split('"og:title" content="')[1].split(`"`)[0];
//       // const v = body.split('itemCode&quot;:&quot;')[1].split(`&`)[0];
//       // const itemCode = v[2] + v[9] + v[1] + v[8] + v[4] + v[6] + v[7];
//       // console.log(titleImg);
//       if (titleImg && body.match('이 이모티콘은 카카오의 다른 서비스에서도 쓸 수 있어요.')) {
//         let body2 = '';
//         let req2 = https.request({
//           host: 'e.kakao.com',
//           path: `/detail/thumb_url?item_code=${itemCode}`,
//           method: 'GET',
//           headers: {
//             'Accept': '*/*',
//             'Accept-Encoding': 'gzip, deflate, br',
//             'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
//             'Connection': 'keep-alive',
//             'Cache-Control': 'max-age=0',
//             'Host': 'e.kakao.com',
//             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
//           }
//         }, (res2) => {
//           res2.on('data', (chunk) => {
//             body2 += chunk;
//           });
//           res2.on('end', () => {
//             let list = JSON.parse(body2);
//             console.log(itemCode, titleImg, title, list.body.length);
//             // db.ref(`/emoticons_v2/${itemCode}`).set({
//             //   title,
//             //   itemCode,
//             //   titleImg,
//             //   emoticons: list.body
//             // });
//           })
//         })
//         req2.end();
//       } else {
//         console.log(itemCode, '없음');
//       }
//     });
//   });
//   // req.write();
//   req.end();
//   _itemCode += 1;
// }, 50);

// 22 12429 61 2 741292 2
// 44 07097 90 4 709977 4

let urlList = [
  // 'https://e.kakao.com/t/the-girl-in-pajamas-ver-2',
  // 'https://e.kakao.com/t/the-girl-in-pajamas-ver-3',
  // 'https://e.kakao.com/t/blu-yello',
  // 'https://e.kakao.com/t/blu-yello-daily-life',
  // 'https://e.kakao.com/t/blu-yello-daily-life-2',
  // 'https://e.kakao.com/t/blu-yello-office-life',
  // 'https://e.kakao.com/t/blu-yello-love-story',
  // 'https://e.kakao.com/t/exactly-my-style-memilticon',
  // 'https://e.kakao.com/t/soooooo-lovely-memilticon',
  // 'https://e.kakao.com/t/tubes-lonely-day',
  // 'https://e.kakao.com/t/dont-worry-be-happy_2',
  // 'https://e.kakao.com/t/costume-play-plus',
  // 'https://e.kakao.com/t/play-with-friends',
  // 'https://e.kakao.com/t/bravo-ryan',
  // 'https://e.kakao.com/t/joyful-day',
  // 'https://e.kakao.com/t/true-love',
  // 'https://e.kakao.com/t/charming-apeach',
  // 'https://e.kakao.com/t/we-are-the-champions',
  // 'https://e.kakao.com/t/single-life',
  // 'https://e.kakao.com/t/friends-holiday',
  // 'https://e.kakao.com/t/dance-special',
  // 'https://e.kakao.com/t/muzi-and-con-special-edition',
  // 'https://e.kakao.com/t/tube-special-edition',
  // 'https://e.kakao.com/t/summer-story2',
  // 'https://e.kakao.com/t/summer-story',
  // 'https://e.kakao.com/t/muzi-apeach-jay-g-unit-theme',
  // 'https://e.kakao.com/t/love-live-sunshine',
  // 'https://e.kakao.com/t/the-idolmaster-cinderella-girls',
  // 'https://e.kakao.com/t/friday-night-ryan-edition',
  // 'https://e.kakao.com/t/everyday-pengsoo',
  // 'https://e.kakao.com/store/detail?item_code=4403033&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/store/detail?item_code=4420213&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/store/detail?item_code=1102495&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/t/detective-conan',
  // 'https://e.kakao.com/t/detective-conan-ver2',
  // 'https://e.kakao.com/t/detective-conan-ver3',
  // 'https://e.kakao.com/t/detective-conan-ver4',
  // 'https://e.kakao.com/store/detail?item_code=7143853734&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/store/detail?item_code=9121576022&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/t/the-gentle-girl-giant',
  // 'https://e.kakao.com/t/you-and-i-are-couple',
  // 'https://e.kakao.com/t/the-heiress-heiress',
  // 'https://e.kakao.com/t/cherry-blossom-girl-its-summer',
  // 'https://e.kakao.com/t/cute-and-lovely-girl-hepbi-',
  // 'https://e.kakao.com/t/happy-new-year_2',
  // 'https://e.kakao.com/t/pinkfong-hogi-cuter-together',
  // 'https://e.kakao.com/t/frozen-2',
  // 'https://e.kakao.com/store/detail?item_code=2121891622&referer=sdk_live-tv.kakao.com_longtap',
  // 'https://e.kakao.com/t/dooly-i-got-you',
  // 'https://e.kakao.com/t/breaking-news'
  // 'https://e.kakao.com/t/frodo-and-friends',
  'https://e.kakao.com/store/detail?item_code=6029000102'
];
let index = 0;
const loop = setInterval(() => {
  let url = urlList[index++];
  fetch(url)
    .then(res => res.text())
    .then((body) => {
      // console.log(body);
      const $ = cheerio.load(body);
      // const titleImg = $('img.thumb_img').attr('src');
      const titleImg = body.split('"og:image" content="')[1].split(`"`)[0];
      // const title = $('.tit_product').text().trim();
      const title = body.split('"og:title" content="')[1].split(`"`)[0];
      const v = body.split('itemCode&quot;:&quot;')[1].split(`&`)[0];
      const itemCode = v[2] + v[9] + v[1] + v[8] + v[4] + v[6] + v[7];
      console.log(itemCode);
      if (titleImg) {
        fetch(`https://e.kakao.com/detail/thumb_url?item_code=${itemCode}`)
          .then(res => res.json())
          .then((body2) => {
            // console.log(body2);
            let list = body2;
            console.log(itemCode, titleImg, title, list.body.length);
            db.ref(`/emoticons_v2/${itemCode}`).set({
              title,
              itemCode,
              titleImg,
              emoticons: list.body
            });
          })
      } else {
        console.log('fail');
      }
    });
    if (index === urlList.length) clearInterval(loop);
}, 2000);


