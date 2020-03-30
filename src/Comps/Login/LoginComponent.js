import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import { signIn, sendEmailVerification } from '../../utils/api/api.auth';

const styles = {
  root: {
    // display: 'flex',
    textAlign: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 200
    // backgroundColor: '#313131'
  },
  title: {
    // color: '#d5d8da'
  },
  textField: {
    marginBottom: 20,
    underlineFocus: {
      borderColor: 'black'
    }
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleClickButton = this.handleClickButton.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleSendEmailVerification = this.handleSendEmailVerification.bind(this);
  }

  /* eslint-disable */
  handleSubmit() {
    if (!this.state.email) return Alert.error('이메일을 입력해주세요.');
    if (!this.state.password) return Alert.error('비밀번호를 입력해주세요.');
    const user = { email: this.state.email, password: this.state.password };
    // signIn(user)
    signIn(user)
      .then((result) => {
        Alert.success(result);
        this.handleRedirect();
      })
      .catch(err => Alert.error(err.message));
  }
  /* eslint-enable */

  handleSendEmailVerification() {
    if (!this.state.email) return Alert.error('이메일을 입력해주세요.');
    if (!this.state.password) return Alert.error('비밀번호를 입력해주세요.');
    const user = { email: this.state.email, password: this.state.password };
    sendEmailVerification(user)
      .then((result) => {
        Alert.success(result);
      })
      .catch(err => Alert.error(err.message));
  }

  handleRedirect() {
    if (this.props.location.pathname === '/login') this.props.history.push('/');
    else this.props.history.push(this.props.location.pathname);
  }

  handleInputKeyDown(e) {
    if (e.keyCode === 13) this.handleSubmit();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleClickButton() {
    this.handleSubmit();
  }

  render() {
    return (
      <div style={styles.root}>
        <div>
          <h1 style={styles.title}>Login for Admin</h1>
        </div>
        <form style={{ margin: 'auto' }} onSubmit={this.handleSubmit}>
          <TextField
            name='email'
            hintText='Email'
            underlineFocusStyle={styles.textField.underlineFocus}
            onChange={this.handleChange}
            onKeyDown={this.handleInputKeyDown}
            style={styles.textField}
          /><br />
          <TextField
            name='password'
            hintText='Password'
            underlineFocusStyle={styles.textField.underlineFocus}
            type='password'
            onChange={this.handleChange}
            onKeyDown={this.handleInputKeyDown}
            style={styles.textField}
          /><br />
          <FlatButton label='가입' onClick={() => this.props.history.push('/signup')} />
          <FlatButton label='로그인' onClick={this.handleClickButton} /><br />
          <FlatButton label='인증이메일전송' onClick={this.handleSendEmailVerification} />
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
