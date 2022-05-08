import React, { useState } from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import Layout from './components/Layout'
import Home from './components/Home'
import './custom.css'
import TopMenu from './components/TopMenu'

/*
#CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
*/

const theme = createTheme({
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

function App() {
  const [timeRangeHours, setTimeRangeHours] = useState(48)

  return (
  <ThemeProvider theme={theme}>
    <Layout>
      <TopMenu setTimeRangeHours={setTimeRangeHours} />
      <Home timeRangeHours={timeRangeHours} />
    </Layout>
  </ThemeProvider>
  )
}

export default App
