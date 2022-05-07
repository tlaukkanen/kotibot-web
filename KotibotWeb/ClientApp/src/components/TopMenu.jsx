import {
  AppBar, Box, Button, IconButton, makeStyles, Toolbar, Typography,
} from '@material-ui/core'
import React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import DateRangeIcon from '@material-ui/icons/DateRange'

// #CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
const styles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#79BD9A',
    color: theme.palette.text.secondary,
  },
  timespanPaper: {
    marginLeft: 'auto',
    maxWidth: '400px',
    padding: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    backgroundColor: '#A8DBA8',
    borderRadius: '5px',
    border: '1px solid #79BD9A',
    boxShadow: '0px 1px 0px #3B8686',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  timespanContainer: {
    marginLeft: 'auto',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      left: '100%',
      marginLeft: '-200px',
    },
    [theme.breakpoints.up('sm')]: {
      left: '50%',
      marginLeft: '-100px',
    },
    width: '200px',
    marginTop: 'auto',
    marginBottom: 'auto',
    position: 'absolute',
  },
}))

const TopMenu = () => {
  const classes = styles()

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar>
        <IconButton edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          KotiBot
        </Typography>
        <div className={classes.headerTitle}>
          <Typography variant="h5">
            Tommi&apos;s Crib 🏡
          </Typography>
        </div>

        <Box className={classes.timespanContainer} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button edge="start" aria-label="date range" startIcon={<DateRangeIcon />} variant="outlined">
              <Typography variant="subtitle1">Last 48 hours</Typography>
            </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopMenu
