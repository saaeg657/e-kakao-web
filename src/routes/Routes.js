import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Main from '../components/Main/MainComponent';

class Routes extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%', minWidth: 1600 }}>
        <Switch>
          <Route exact path='/' render={() => <Main />} />
        </Switch>
        <Alert stack={{ limit: 10, spacing: 10 }} timeout={5000} position='bottom-left' effect='stackslide' />
      </div>
    );
  }
}

export default withRouter(Routes);
