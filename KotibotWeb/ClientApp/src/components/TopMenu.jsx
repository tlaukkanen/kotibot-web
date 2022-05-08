import {
  AppBar, Box, IconButton, List, ListItem, ListItemText, makeStyles, Menu, MenuItem, Toolbar, Typography,
} from '@material-ui/core'
import React, { useState } from 'react'
import MenuIcon from '@material-ui/icons/Menu'

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

const timeRangeOptions = [
  'Last 24 hours',
  'Last 48 hours',
  'Last 7 days',
  'Last 30 days',
]

function TopMenu() {
  const classes = styles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleClickTimeRangeItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseTimeRange = () => {
    setAnchorEl(null)
  }

  const handleChangeTimeRange = (event, index) => {
    setSelectedIndex(index)
    handleCloseTimeRange()
    // eslint-disable-next-line no-alert
    alert('Time range feature in progress 🤓')
  }

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
          <List component="nav" aria-label="date range">
            <ListItem
              button
              onClick={handleClickTimeRangeItem}
            >
              <ListItemText primary="Time range" secondary={timeRangeOptions[selectedIndex]} />
            </ListItem>
          </List>
          <Menu
            id="time-range-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseTimeRange}
          >
            {timeRangeOptions.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleChangeTimeRange(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopMenu
