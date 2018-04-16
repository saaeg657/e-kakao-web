import React from 'react';
import { withRouter } from 'react-router-dom';
import image1 from './1.jpeg';
import image2 from './2.jpeg';
import image4 from './4.jpeg';
import image5 from './5.jpeg';
import image6 from './6.jpeg';
import image7 from './7.jpeg';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 30
  },
  container: {
    flex: 1,
    width: 1000
  },
  img: {
    margin: '30px 0px 0px 30px'
  }
}

class HowToComponent extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <h1>How To Use</h1>
        <div style={styles.container}>
          <h3>1. 크롬 시크릿 창을 실행한 후에 tv.kakao.com 접속</h3>
          <img alt=''style={styles.img} src={image1} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>2. 카카오 계정으로 로그인</h3>
          <img alt=''style={styles.img} src={image2} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>3. 메인으로 돌아오면 보고싶은 방송을 클릭</h3>
          <img alt=''style={styles.img} src={image1} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>4. 방송에 들어왔다면 F12를 눌러서 개발자 콘솔창을 연다</h3>
          <h3>5. 개발자 콘솔창에서 Network탭을 누르고, 아무 채팅이나 입력 후 전송한다.</h3>
          <img alt=''style={styles.img} src={image4} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>6. 채팅이 정상적으로 방에 전송되었다면, Network에 msg라는 뜨는 것이 보이고, 이것을 클릭한다. </h3>
          <h3>7. 클릭하면 Headers > Request Headers에 Cookie값이 보인다. 이 값을 복사해둔다.</h3>
          <img alt=''style={styles.img} src={image5} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>8. Request Headers 밑에 Form Data에 sessionid와 roomid가 보인다. 이 두 값도 복사해둔다.</h3>
          <h3>* 이모티콘 사용을 원하는 방송은 시크릿창, 다른 브라우저, 혹은 카카오 플레이어 등에서 로그인을 유지시켜 놓아야지만 이모티콘이 정상적으로 전송된다.</h3>
          <img alt=''style={styles.img} src={image6} width='100%' />
        </div>
        <div style={styles.container}>
          <h3>9. 이제 다시 본 사이트로 다시 돌아와서 roomid, sessionid, cookie 값을 입력하고 저장을 누른다.</h3>
          <h3>10. 시청하고 싶은 방송에 들어가서 마음껏 이모티콘을 즐긴다.</h3>
          <h3>* 다른 방에 들어가고 싶다면 위의 과정에서 roomid만 새로 가져오면 된다.</h3>
          <h3>* 본 사이트에서는 "비로그인"으로 남겨두어야지만 전송한 이모티콘이 보인다.</h3>
          <img alt=''style={styles.img} src={image7} width='100%' />
        </div>
      </div>
    )
  }
}

export default withRouter(HowToComponent);
