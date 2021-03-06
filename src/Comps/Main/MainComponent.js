import React from 'react';
import { TextField, FlatButton } from 'material-ui';
import Alert from 'react-s-alert';
import firebase from 'firebase';
import { db } from '../../utils/firebase/firebase';

const endpoint = 'https://e-kakao-api.herokuapp.com';
// const endpoint = 'http://localhost:3001';

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
    display: 'flex',
    flexDirection: 'row',
    height: 60
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    height: 60
  },
  emoticonController: {

  },
  selectedEmoticonSet: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  emoticonList: {
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    flexWrap: 'wrap'
  },
  favorites: {
    width: 600,
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    overflowX: 'hidden',
    flexWrap: 'wrap'
  }
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomid: '',
      message: '',
      itemSubType: '',
      groupid: '',
      emoticons: {},
      numEmoticons: 0,
      displyEmoticons: {},
      favorites: {},
      selectedEmoticonSet: {},
      itemid: 0,
      resourceid: 0,
      page: 0,
      limit: 500,
      startAt: '0',
      cookie: '',
      sessionid: '',
      emoticonCount: 0,
      iframeHeight: window.innerHeight - 520
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
    this.onClickFreezeAll = this.onClickFreezeAll.bind(this);
    this.onClickDeleteFreezeAll = this.onClickDeleteFreezeAll.bind(this);
    this.onClickKicking = this.onClickKicking.bind(this);
    this.onClickEom = this.onClickEom.bind(this);
  }

  componentWillMount() {
    this.initUser();
    // this.initEmoticons();
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
      iframeHeight: window.innerHeight - 520
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
    db.ref(`/emoticons_v2`).on('value', (snapshot) => {
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
      cookie: this.state.cookie,
      groupid: this.state.groupid,

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

    const sessionid = this.state.sessionid;
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const message = encodeURI(this.state.message);
    const itemid = isEmoticon ? this.state.itemid : '';
    const itemSubType = this.state.itemSubType;
    const resourceid = isEmoticon ? this.state.resourceid : '';
    const isAD = this.state.isAD;

    let params = '';
    if (isEmoticon) {
      params = `cookie=${cookie}&sessionid=${sessionid}&roomid=${roomid}&msg=${message}&itemid=${itemid}&resourceid=${resourceid}&itemSubType=${itemSubType}&isAD=${isAD}`;
      params += `&imageUrl=${this.state.selectedEmoticon.titleImg ? this.state.selectedEmoticon.titleImg : ''}`
    }
    else params = `cookie=${cookie}&sessionid=${sessionid}&roomid=${roomid}&msg=${message}&isAD=${isAD}`;

    db.ref(`/users/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
      if ((!snapshot.val().emoticonCount || snapshot.val().emoticonCount <= 0) && !snapshot.val().master && isEmoticon) {
        return Alert.error('사용가능한 이모티콘 횟수가 0입니다.')
      }
      fetch(`${endpoint}/msg?${params}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
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

  onClickKicking() {
    if (!this.state.targetid) {
      Alert.error('Set target first!');
      return;
    }
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const groupid = this.state.groupid;
    const targetid = this.state.targetid;
    const sessionid = this.state.sessionid;
    let params = `cookie=${cookie}&roomid=${roomid}&groupid=${groupid}&targetid=${targetid}&sessionid=${sessionid}&type=kick`;
    fetch(`${endpoint}/set?${params}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      },
    })
      .then(res => res.json())
      .then(res => {
        Alert.success(JSON.stringify(res))
      })
      .catch(err => Alert.error(err.msg))
  }

  onClickFreezeAll() {
    if (!this.state.groupid) {
      Alert.error('Set groupid first!');
      return;
    }
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const groupid = this.state.groupid;
    let params = `cookie=${cookie}&&roomid=${roomid}&groupid=${groupid}&type=freeze`;
    fetch(`${endpoint}/set?${params}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      },
    })
      .then(res => res.json())
      .then(res => {
        Alert.success(JSON.stringify(res))
      })
      .catch(err => Alert.error(err.msg))
  }

  onClickDeleteFreezeAll() {
    if (!this.state.groupid) {
      Alert.error('Set groupid first!');
      return;
    }
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const groupid = this.state.groupid;
    let params = `cookie=${cookie}&&roomid=${roomid}&method=delete&groupid=${groupid}&type=freeze`;
    fetch(`${endpoint}/set?${params}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      },
    })
      .then(res => res.json())
      .then(res => {
        Alert.success(JSON.stringify(res))
      })
      .catch(err => Alert.error(err.msg))
  }

  onClickEom() {
    if (!this.state.sessionid) {
      Alert.error('Set sessionid first!');
      return;
    }
    if (!this.state.cookie) {
      Alert.error('Set cookie first!');
      return;
    }

    const sessionid = this.state.sessionid;
    const cookie = encodeURI(this.state.cookie);
    const roomid = this.state.roomid;
    const isAD = this.state.isAD;

    let params = '';
    params = `cookie=${cookie}&sessionid=${sessionid}&roomid=${roomid}&isAD=${isAD}`;

    fetch(`${endpoint}/eom?${params}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      },
    })
      .then(res => res.json())
      .then(res => {
        Alert.success(JSON.stringify(res))
      })
      .catch(err => Alert.error(err.msg));
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.container}>
          <div style={styles.player}>
            <iframe className='live_chat' title='live_chat' src={`https://tv.kakao.com/`} width='100%' height={this.state.iframeHeight} />
          </div>
          <div style={{ ...styles.controller, height: this.state.iframeHeight }}>
            <div style={{ height: 30 }}>{this.state.master ? <div>마스터계정</div> : <div>{String(this.state.emoticonCount ? this.state.emoticonCount : 0)}회 사용가능</div>}</div>
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
              <TextField
                floatingLabelText='itemSubType'
                name='itemSubType'
                value={this.state.itemSubType}
                onChange={this.onChangeTextField}
                style={{ flex: 1, marginLeft: 10 }}
              />
              <FlatButton label='저장' style={{ marginTop: 30 }} onClick={this.onSaveProfile} />
              <FlatButton label='불러오기' style={{ marginTop: 30 }} onClick={this.onLoadProfile} />
            </div>
            <div style={styles.message}>
              <TextField
                floatingLabelText='AD'
                name='isAD'
                value={this.state.isAD}
                onChange={this.onChangeTextField}
                style={{ flex: 1 }}
                fullWidth
              />
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
            <div style={styles.playerId}>
              <TextField
                floatingLabelText='groupid'
                name='groupid'
                value={this.state.groupid}
                onChange={this.onChangeTextField}
                style={{ flex: 1 }}
                fullWidth
              />
              <FlatButton label='모두채금' style={{ flex: 2, marginTop: 30 }} onClick={this.onClickFreezeAll} />
              <FlatButton label='채금해제' style={{ flex: 2, marginTop: 30 }} onClick={this.onClickDeleteFreezeAll} />
            </div>
            {/* <div style={styles.playerId}>
              <TextField
                floatingLabelText='타겟'
                name='targetid'
                value={this.state.targetid}
                onChange={this.onChangeTextField}
                style={{ flex: 1 }}
                fullWidth
              />
              <FlatButton label='퇴장' style={{ flex: 2, marginTop: 30 }} onClick={this.onClickKicking} />
            </div> */}
            <div style={styles.playerId}>
              <FlatButton label='엄준식' style={{ flex: 1, marginTop: 30 }} onClick={this.onClickEom} />
            </div>
            <div style={{ height: 50, paddingTop: 30 }}>
              <div style={{ float: 'left' }}>이모티콘 선택({this.state.itemid}, {this.state.resourceid})</div>
              {this.state.favorites && this.state.favorites[this.state.itemid] ?
                (<div style={{ float: 'right', cursor: 'pointer' }} onClick={this.onDeleteFavorite}>즐겨찾기해제</div>) :
                (<div style={{ float: 'right', cursor: 'pointer' }} onClick={this.onAddFavorite}>즐겨찾기등록</div>)}
            </div>
            <div style={{ ...styles.selectedEmoticonSet, height: this.state.iframeHeight - 230 }}>
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
          <div style={{ flex: 3, padding: 20 }}>
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
          <div style={{ width: 600, padding: 20 }}>
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
