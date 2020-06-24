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
          main: '#222222',
      },
      secondary: {
          main: '#79BD9A',
      },
      background: {
          default: '#A8DBA8',
      },
      text: {
          primary: '#222222',
          secondary: '#0B486B',
      },
  },
  appBar: {
      height: 60,
      background: {
          default: '#2C2933',
      },
      primary: {
          main: '#FFF',
      },
      text: {
          primary: '#FFF',
      },
  },
  typography: {
      h3: {
          textTransform: 'uppercase',
      },
      h5: {
          textTransform: 'uppercase',
      },
  },
  overrides: {
      MuiInputBase: {
          input: {
              color: '#000',
          },
      },
      MuiFormHelperText: {
          root: {
              marginBottom: '16px',
              color: '#00000089',
          },
      },
      MuiFormLabel: {
          root: {
              color: '#00000089',
          },
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
