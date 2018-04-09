import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes/Routes';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <Routes />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
