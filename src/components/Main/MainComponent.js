import React from 'react';
import { TextField, FlatButton, SelectField, MenuItem } from 'material-ui';
import Alert from 'react-s-alert';
import firebase from 'firebase';
import { db } from '../../utils/firebase/firebase';

const endpoint = 'https://e-kakao-api.herokuapp.com';

const styles = {
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  player: {
    flex: 3,
    height: '100%'
  },
  controller: {
    display: 'flex',
    flexDirection: 'column',
    width: 600,
    heigth: '100%',
    padding: 20
  },
  login: {

  },
  playerId: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  message: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  emoticonController: {

  },
  selectedEmoticonSet: {
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflowY: 'scroll'
  },
  emoticonList: {
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    flexWrap: 'wrap'
  },
  favorites: {
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    flexWrap: 'wrap'
  }
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomid: '',
      message: '',
      emoticons: {},
      numEmoticons: 0,
      displyEmoticons: {},
      favorites: {},
      selectedEmoticonSet: {},
      itemid: 0,
      item_sub_type: 3,
      resourceid: 0,
      page: 0,
      limit: 500,
      startAt: '0',
      cookie: '',
      sessionid: '',
      emoticonCount: 0,
      iframeHeight: window.innerHeight - 470
    }
    this.onChangeTextField = this.onChangeTextField.bind(this);
    this.onAddFavorite = this.onAddFavorite.bind(this);
    this.onDeleteFavorite = this.onDeleteFavorite.bind(this);
    this.initEmoticons = this.initEmoticons.bind(this);
    this.initUser = this.initUser.bind(this);
    this.initFavorites = this.initFavorites.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.isUpdated = false;
    this.onSaveProfile = this.onSaveProfile.bind(this);
    this.onLoadProfile = this.onLoadProfile.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    this.initUser();
    this.initEmoticons();
    this.initFavorites();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    db.ref('favorites').off();
    db.ref('users').off();
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      iframeHeight: window.innerHeight - 470
    });
  }

  initUser() {
    db.ref(`/users/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
      if (snapshot.val()) {
        const { roomid, sessionid, cookie, emoticonCount, master } = snapshot.val();
        this.setState({
          roomid,
          sessionid,
          cookie,
          emoticonCount,
          master
        });
      }
    });
    db.ref(`/users/${firebase.auth().currentUser.uid}/emoticonCount`).on('value', (snapshot) => {
      this.setState({
        emoticonCount: snapshot.val()
      });
    })
  }

  initEmoticons() {
    db.ref('/emoticons').once('value').then((snapshot) => {
      this.setState({
        emoticons: snapshot.val(),
        numEmoticons: snapshot.numChildren(),
      });
    });
  }

  initFavorites() {
    db.ref(`/favorites/${firebase.auth().currentUser.uid}`).on('value', (snapshot) => {
      this.setState({
        favorites: snapshot.val()
      });
    });
  }

  onChangeTextField(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onChangeSelectField(name, v) {
    this.setState({
      [name]: v
    });
  }

  onAddFavorite() {
    if (this.state.itemid > 0 && this.state.selectedEmoticonSet.emoticons) {
      db.ref(`/favorites/${firebase.auth().currentUser.uid}/${this.state.itemid}`).set({
        ...this.state.selectedEmoticonSet
      });
    }
  }

  onDeleteFavorite() {
    if (this.state.itemid > 0 && this.state.selectedEmoticonSet.emoticons) {
      db.ref(`/favorites//${firebase.auth().currentUser.uid}/${this.state.itemid}`).remove();
    }
  }

  onSaveProfile() {
    db.ref(`/users/${firebase.auth().currentUser.uid}`).update({
      roomid: this.state.roomid,
      sessionid: this.state.sessionid,
      cookie: this.state.cookie
    })
      .then(() => {
        Alert.success('success');
      })
      .catch(() => {
        Alert.error('failed');
      })
  }

  onLoadProfile() {
    this.initUser();
  }

  onClickPrev() {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1
      });
    }
  }

  onClickNext() {
    if ((this.state.page + 1) * this.state.limit < this.state.numEmoticons) {
      this.setState({
        page: this.state.page + 1
      });
    }
  }

  sendMessage(isEmoticon) {
    if (!this.state.sessionid) {
      Alert.error('Set sessionid first!');
      return;
    }
    if (!this.state.cookie) {
      Alert.error('Set cookie first!');
      return;
    }
    if (!this.state.itemid > 0 && isEmoticon) {
      Alert.error('Set emoticon set first!');
      return;
    }
    if (!this.state.resourceid > 0 && isEmoticon) {
      Alert.error('Set resource first!');
      return;
    }
    const data = `sessionid=${this.state.sessionid}&roomid=${this.state.roomid}&msg=%7B%22msg%22%3A%22${this.state.message}%22%2C%22emoticon%22%3A%7B%22item_id%22%3A%22${this.state.itemid}%22%2C%22resource_id%22%3A%22${this.state.resourceid}%22%2C%22item_sub_type%22%3A4%2C%22item_version%22%3A1%7D%7D&type=EMOTICON`;
    // fetch('https://play.kakao.com/chat/service/api/msg', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Accept': '*/*',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'Accept-Language': 'ko-KR, ko; q=0.9, en-US; q=0.8, en; q=0.7',
    //     'Connection': 'keep-alive',
    //     'Content-Length': Buffer.byteLength(data, 'utf8'),
    //     'Content-type': 'application/x-www-form-urlencoded',
    //     'Cookie': this.state.cookie,
    //     'Host': 'play.kakao.com',
    //     'Origin': 'https://play.kakao.com',
    //     'Referer': `https://play.kakao.com/kakaotv/live/chat/user/${this.state.channelid}`,
    //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    //   },
    //   body: data
    // })
    //   .then((res) => Alert.success(res.json()))
    //   .catch(console.log);
    //{"status":200,"code":"OK","msg":"OK","enter":"fd84a9b1-4e0a-4f39-a547-415624a693c1","roomInfo":{"serverip":"203.133.177.139","port":"9002","channelid":"tvpot.301","version":57398,"roomid":"1732884","freeze":"0","mode":"1","reportcount":"0","expand":"0"},"additionalInfo":{"prohibit_version":"1519002433711"}}
    //TIARA=t6KKoBd3WK-O3V4BtIjIJXuAtD8g-L_OTvpS8Jr3mXdg3egHnJg4GMOgEZeDtqNsNCyHwAzLQaSjoifk3wp8LA00; webid=73de22799b7d4f26b0ff12c44a3fd95f; _kadu=5ihgD3HLQP8wpyj0_1522013107882; LWCS=iK2_HD7hbdN8SvcyXR8sQQ.Hb1BHAlDL74JkSKIsCyIJONW3o2sbos9sss8rAqfi9xUKpz9zAz4t-GuhAA6o7TE.1523250752617.300000.qaKbYCwMDlzb4WVWZ1Sji3ElkX1LfMj-0N1Ow_kttCQ; _kawlt=vlFlI2o3Wj6oeL6aTLNwKO1qVOOs8q1UbYfuKRTXCUYqD_Dti_cAPD6wOxMJnfA2h-FR4VkI70b--qkdSoFLyS0ugRV9DGWFSXDR0bEE23D9xFEgwk47tb1Kcmf5-P7I; _karmt=oD9tGgUtgOs-QLvOJsd7q5xj_Zjvts_-LGGmLcr-qxZoMlUMjC0xU38SmGkWBW7e; _kawltea=1523316081; _karmtea=1523326881; _klv=2973842:ee2757534063c7f7
    //2433010
    //1760871
    const sessionid = this.state.sessionid;
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const message = encodeURI(this.state.message);
    const itemid = isEmoticon ? this.state.itemid : '';
    const resourceid = isEmoticon ? this.state.resourceid : '';
    const item_sub_type = this.state.item_sub_type;

    let params = '';
    if (isEmoticon) params = `cookie=${cookie}&sessionid=${sessionid}&roomid=${roomid}&msg=${message}&itemid=${itemid}&resourceid=${resourceid}&item_sub_type=${item_sub_type}`;
    else params = `cookie=${cookie}&sessionid=${sessionid}&roomid=${roomid}&msg=${message}`;
    db.ref(`/users/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
      if ((!snapshot.val().emoticonCount || snapshot.val().emoticonCount <= 0) && !snapshot.val().master && isEmoticon) {
        return Alert.error('사용가능한 이모티콘 횟수가 0입니다.')
      }
      fetch(`${endpoint}/msg?${params}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Length': Buffer.byteLength(data, 'utf8'),
          'Content-type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        },
      })
        .then(res => res.json())
        .then(res => {
          if (isEmoticon) {
            db.ref(`/users/${firebase.auth().currentUser.uid}/emoticonCount`).transaction(currentCount => currentCount > 0 ? currentCount - 1 : 0);
          }
          Alert.success(JSON.stringify(res))
        })
        .catch(err => Alert.error(err.msg))
      this.setState({
        message: ''
      });
    });
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.container}>
          <div style={styles.player}>
            <iframe className='live_chat' title='live_chat' src={`https://tv.kakao.com/`} width='100%' height={this.state.iframeHeight} style={{ minHeight: 500 }} />
          </div>
          <div style={styles.controller}>
            {this.state.master ? <div>마스터계정</div> : <div>{String(this.state.emoticonCount ? this.state.emoticonCount : 0)}회 사용가능</div>}
            <div style={styles.playerId}>
              <TextField
                floatingLabelText='roomid'
                name='roomid'
                value={this.state.roomid}
                onChange={this.onChangeTextField}
                style={{ flex: 1 }}
              />
              <TextField
                floatingLabelText='sessionid'
                name='sessionid'
                value={this.state.sessionid}
                onChange={this.onChangeTextField}
                style={{ flex: 1, marginLeft: 10 }}
              />
              <TextField
                floatingLabelText='cookie'
                name='cookie'
                value={this.state.cookie}
                onChange={this.onChangeTextField}
                style={{ flex: 5, marginLeft: 10 }}
              />
              <FlatButton label='저장' style={{ marginTop: 30 }} onClick={this.onSaveProfile} />
              <FlatButton label='불러오기' style={{ marginTop: 30 }} onClick={this.onLoadProfile} />
            </div>
            <div style={styles.message}>
              <SelectField
                floatingLabelText='item_sub_type'
                name='item_sub_type'
                value={this.state.item_sub_type}
                onChange={(e, i, v) => this.onChangeSelectField('item_sub_type', v)}
                style={{ width: 100 }}
              >
                <MenuItem primaryText='일반' value={3} />
                <MenuItem primaryText='움짤' value={4} />
              </SelectField>
              <TextField
                floatingLabelText='메시지'
                name='message'
                value={this.state.message}
                onChange={this.onChangeTextField}
                style={{ flex: 5 }}
                fullWidth
              />
              <FlatButton
                label='이모티콘'
                style={{ width: 100, marginTop: 30 }}
                onClick={() => this.sendMessage(true)}
              />
              <FlatButton
                label='메시지만'
                style={{ width: 100, marginTop: 30 }}
                onClick={() => this.sendMessage(false)}
              />
            </div>
            <div style={{ margin: 10 }}>
              <div style={{ float: 'left' }}>이모티콘 선택({this.state.itemid}, {this.state.resourceid})</div>
              {this.state.favorites && this.state.favorites[this.state.itemid] ?
                (<div style={{ float: 'right', cursor: 'pointer' }} onClick={this.onDeleteFavorite}>즐겨찾기해제</div>) :
                (<div style={{ float: 'right', cursor: 'pointer' }} onClick={this.onAddFavorite}>즐겨찾기등록</div>)}
            </div>
            <div style={styles.selectedEmoticonSet}>
              {this.state.selectedEmoticonSet.emoticons && this.state.selectedEmoticonSet.emoticons.map((url, i) => {
                return (<img
                  alt=''
                  key={i}
                  style={{
                    height: 100,
                    width: 100,
                    backgroundColor: (i + 1) === this.state.resourceid ? '#d9d9d9' : 'white'
                  }}
                  src={url}
                  onClick={() => {
                    this.setState({
                      selectedEmoticon: this.state.selectedEmoticonSet,
                      resourceid: (i + 1)
                    });
                  }}
                />);
              })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: 3 }}>
            <div style={{ margin: 10 }}>이모티콘 리스트({this.state.numEmoticons})({this.state.page + 1}/{Math.floor(this.state.numEmoticons / this.state.limit) + 1})</div>
            <div style={styles.emoticonList}>
              {this.state.emoticons && Object.keys(this.state.emoticons).map((key, i) => {
                if (i >= this.state.limit * this.state.page && i < (this.state.page + 1) * this.state.limit) {
                  return (
                    <img
                      alt=''
                      key={i}
                      style={{
                        height: 100,
                        width: 100,
                        backgroundColor: key === this.state.itemid ? '#d9d9d9' : 'white'
                      }}
                      src={this.state.emoticons[key].titleImg}
                      onClick={() => {
                        this.setState({
                          selectedEmoticonSet: this.state.emoticons[key],
                          itemid: key,
                          resourceid: 0
                        });
                      }}
                    />
                  );
                }
                return (null);
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <FlatButton
                label='이전'
                style={{ flex: 1 }}
                onClick={this.onClickPrev}
              />
              <FlatButton
                label='다음'
                style={{ flex: 1 }}
                onClick={this.onClickNext}
              />
            </div>
          </div>
          <div style={{ width: 600 }}>
            <div style={{ margin: 10 }}>즐겨찾기</div>
            <div style={styles.favorites}>
              {this.state.favorites && Object.keys(this.state.favorites).map((key, i) => {
                return (
                  <img
                    alt=''
                    key={i}
                    style={{
                      height: 100,
                      width: 100,
                      backgroundColor: key === this.state.itemid ? '#d9d9d9' : 'white'
                    }}
                    src={this.state.favorites[key].titleImg}
                    onClick={() => {
                      this.setState({
                        selectedEmoticonSet: this.state.favorites[key],
                        itemid: key,
                        resourceid: 0
                      });
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
