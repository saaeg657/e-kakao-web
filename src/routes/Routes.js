import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Main from '../Comps/Main/MainComponent';
import Loading from '../Comps/Loading/LoadingComponent';
import Login from '../Comps/Login/LoginComponent';
import SignUp from '../Comps/SignUp/SignUpComponent';
import Admin from '../Comps/Admin/AdminComponent';
import HowTo from '../Comps/HowTo/HowToComponent';

class Routes extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', minWidth: 1600 }}>
        <Switch>
          <Route exact path='/' render={() => <Loading component={Main} />} />
          <Route exact path='/signup' render={() => <Loading component={SignUp} isSignUpPath={true} />} />
          <Route exact path='/admin' render={() => <Loading component={Admin} onlyAdmin={true} />} />
          <Route exact path='/howto' render={() => <Loading component={HowTo} />} />
          <Route path='/login' render={() => <Loading component={Login} isLoginPath={true} />} />
        </Switch>
        <Alert stack={{ limit: 10, spacing: 10 }} timeout={3000} position='bottom-left' effect='stackslide' />
      </div>
    );
  }
}

export default withRouter(Routes);
