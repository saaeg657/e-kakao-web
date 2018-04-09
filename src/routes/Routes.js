import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Main from '../components/Main/MainComponent';
import Loading from '../components/Loading/LoadingComponent';
import Login from '../components/Login/LoginComponent';
import SignUp from '../components/SignUp/SignUpComponent';

class Routes extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', minWidth: 1600 }}>
        <Switch>
          <Route exact path='/' render={() => <Loading component={Main} />} />
          <Route exact path='/signup' render={() => <Loading component={SignUp} isSignUpPath={true} />} />
          <Route path='/login' render={() => <Loading component={Login} isLoginPath={true} />} />
        </Switch>
        <Alert stack={{ limit: 10, spacing: 10 }} timeout={5000} position='bottom-left' effect='stackslide' />
      </div>
    );
  }
}

export default withRouter(Routes);
