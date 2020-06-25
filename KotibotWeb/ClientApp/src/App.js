import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import './custom.css'

/*
#CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
*/

const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#3B8686',
      },
      secondary: {
          main: '#79BD9A',
      },
      background: {
          default: '#A8DBA8',
      },
      text: {
          primary: '#3B8686',
          secondary: '#0B486B',
      },
  },
})

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Route exact path='/' component={Home} />
        </Layout>
      </ThemeProvider>
    );
  }
}
