import React from 'react';
import { withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import { db } from '../../utils/firebase/firebase';
import { FlatButton, TextField } from 'material-ui';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 30
  },
  container: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
}

class AdminComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationCodeList: {},
      userList: {},
      emoticonCountChangeAmout: 10
    };
    this.initInvitationCode = this.initInvitationCode.bind(this);
    this.initUsers = this.initUsers.bind(this);
    this.onGenerateInvitationCode = this.onGenerateInvitationCode.bind(this);
    this.onChangeTextField = this.onChangeTextField.bind(this);
  }

  componentWillMount() {
    this.initInvitationCode();
    this.initUsers();
  }

  initUsers() {
    db.ref(`/users`).on('value', (snapshot) => {
      this.setState({
        userList: snapshot.val() ? snapshot.val() : {}
      });
    });
  }

  initInvitationCode() {
    db.ref(`/invitationCode`).on('value', (snapshot) => {
      this.setState({
        invitationCodeList: snapshot.val() ? snapshot.val() : {}
      });
    });
  }

  onGenerateInvitationCode(num) {
    const code = Array(12).fill(null).map(() => String.fromCharCode(Math.floor(Math.random() * 25 + 65))).join('');
    db.ref(`/invitationCode/${code}`).set(true)
      .then(() => {
        Alert.success('success');
      })
      .catch();
  }

  onDeleteInvitationCode(key) {
    db.ref(`/invitationCode/${key}`).remove()
      .then(() => {
        Alert.success('success');
      })
      .catch();
  }

  onDeleteUser(key) {
    /* eslint-disable */
    if (confirm('추방하시겠습니까?')) {
      firebase.auth().
        db.ref(`/users/${key}`).remove()
        .then(() => {
          Alert.success('success');
        })
        .catch();
    }
  }

  onIncreaseEmoticonCount(key) {
    db.ref(`/users/${key}/emoticonCount`).transaction(count => count + this.state.emoticonCountChangeAmout)
      .then(() => {
        Alert.success('success');
      })
      .catch();
  }

  onDecreaseEmoticonCount(key) {
    db.ref(`/users/${key}/emoticonCount`).transaction(count => count > this.state.emoticonCountChangeAmout ? count - this.state.emoticonCountChangeAmout : 0)
      .then(() => {
        Alert.success('success');
      })
      .catch();
  }

  onChangeTextField(e) {
    if (!(Number(e.traget.value) >= 0)) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={{ height: 80 }}><h1>어드민페이지</h1></div>
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, width: '80%' }}>
          <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>초대코드생성</h2>
            <FlatButton label='코드생성' onClick={() => this.onGenerateInvitationCode(12)} fullWidth />
            {Object.keys(this.state.invitationCodeList).length > 0 && Object.keys(this.state.invitationCodeList).map((code, i) => {
              return (
                <div key={i} style={{ margin: '5px 0px 5px 0px' }}>
                  <span>{code}</span>
                  <FlatButton label='삭제' onClick={() => this.onDeleteInvitationCode(code)} />
                </div>
              );
            })}
          </div>
          <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>유저관리</h2>
            <TextField
              style={{ float: 'left', width: 150 }}
              name='emoticonCountInput'
              hintText='증감단위'
              value={this.state.emoticonCountChangeAmout}
              onChange={this.onChangeTextField}
            />
            {Object.keys(this.state.userList).length > 0 && Object.keys(this.state.userList).map((key, i) => {
              return (
                <div key={i} style={{ margin: '5px 0px 5px 0px' }}>
                  <div style={{ float: 'left', width: 200, marginTop: 8 }}>{this.state.userList[key].email}</div>
                  <div style={{ float: 'left', width: 40, marginTop: 8 }}>{this.state.userList[key].emoticonCount}</div>
                  <FlatButton style={{ float: 'left', width: 60 }} label='추방' onClick={() => this.onDeleteUser(key)} />
                  <FlatButton style={{ float: 'left', width: 60 }} label='UP' onClick={() => this.onIncreaseEmoticonCount(key)} />
                  <FlatButton style={{ float: 'left', width: 60 }} label='DOWN' onClick={() => this.onDecreaseEmoticonCount(key)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminComponent);
