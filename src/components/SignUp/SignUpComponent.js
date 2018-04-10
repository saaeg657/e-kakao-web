import React from 'react';
import { withRouter } from 'react-router-dom';
import { TextField } from 'material-ui';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Alert from 'react-s-alert';
import firebase from 'firebase';
import moment from 'moment';
import { db } from '../../utils/firebase/firebase';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 200
  }
}
/* eslint-disable */
const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
/* eslint-enable */

class SignUpComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordRe: '',
      invitationCode: ''
    }
    this.onChangeTextField = this.onChangeTextField.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.isSubmitted = false;
  }

  onChangeTextField(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onInputKeyDown(e) {
    if (e.keyCode === 13) this.onSubmitForm();
  }

  onSubmitForm() {
    if (!this.state.email) return Alert.error('이메일을 입력해주세요.');
    if (!validateEmail(this.state.email)) return Alert.error('올바른 이메일을 입력해주세요.');
    if (!this.state.password) return Alert.error('비밀번호를 입력해주세요.');
    if (this.state.password.length < 7 || this.state.password.length > 20) return Alert.error('비밀번호는 7자리 이상 20자리 이하로 입력해주세요.');
    if (!this.state.passwordRe) return Alert.error('비밀번호를 입력해주세요.');
    if (this.state.password !== this.state.passwordRe) return Alert.error('두 비밀번호가 일치하지 않습니다.');
    if (!this.state.invitationCode) return Alert.error('초대코드를 입력해주세요.');
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    setTimeout(() => {
      this.isSubmitted = false;
    }, 1000);
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        db.ref(`/invitationCode/${this.state.invitationCode}`).once('value')
          .then((snapshot) => {
            if (snapshot.val()) {
              db.ref(`/users/${firebase.auth().currentUser.uid}`).set({
                email: firebase.auth().currentUser.email,
                roomid: '',
                sessionid: '',
                cookie: '',
                emoticonCount: 10,
                sendEmailVerificationAt: moment().toString()
              });
              firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                  firebase.auth().signOut();
                  Alert.success(`${firebase.auth().currentUser.email}로 확인 메일이 전송되었습니다.`);
                  db.ref(`/invitationCode/${this.state.invitationCode}`).remove();
                  this.props.history.push('/');
                });
            }
            else {
              firebase.auth().currentUser.delete()
              return Alert.error('올바른 초대코드를 입력해주세요.');
            }
          })
      })
      .catch((error) => Alert.error(error.message));
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.form}>
          <div style={{ textAlign: 'center', fontSize: 50, marginBottom: 50, fontFamily: 'Nanum Pen Script' }}>회원가입</div>
          <div style={{ flex: 1 }}>
            <TextField
              hintText='이메일'
              name='email'
              value={this.state.email}
              onChange={this.onChangeTextField}
              onKeyDown={this.onInputKeyDown}
            />
          </div>
          <div style={{ flex: 1 }}>
            <TextField
              hintText='비밀번호'
              name='password'
              type='password'
              onChange={this.onChangeTextField}
              onKeyDown={this.onInputKeyDown}
            />
          </div>
          <div style={{ flex: 1 }}>
            <TextField
              hintText='비밀번호 확인'
              name='passwordRe'
              type='password'
              onChange={this.onChangeTextField}
              onKeyDown={this.onInputKeyDown}
            />
          </div>
          <div style={{ flex: 1 }}>
            <TextField
              hintText='초대코드'
              name='invitationCode'
              onChange={this.onChangeTextField}
              onKeyDown={this.onInputKeyDown}
            />
          </div>
          <FlatButton
            label='가입하기'
            style={{ marginTop: 30 }}
            onClick={this.onSubmitForm}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(SignUpComponent);