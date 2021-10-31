import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Layout from './components/Layout'
import Home from './components/Home'

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

const App = () => (
  <ThemeProvider theme={theme}>
    <Layout>
      <Route exact path="/" component={Home} />
    </Layout>
  </ThemeProvider>
)

export default App
