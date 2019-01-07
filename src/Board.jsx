/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { setPin } from './api';
import Switch from './Components/Switch';
import PaperSheet from './Components/Paper';
import Emoji from './Components/Emoji';

const EmojiStyle = {
  fontSize: '1.5rem',
  height: '1.5rem',
  width: '1.5rem',
};

function DisplayDate({ date }) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  return (
    <React.Fragment>
      {diff > 15 ? (
        <Emoji style={EmojiStyle} name="offline" />
      ) : (
        <Emoji style={EmojiStyle} name="online" />
      )}
      {'  '}
      <span>{d.toLocaleString()}</span>
      {'  '}
      <Emoji style={EmojiStyle} name="watch" />
      {'  '}
    </React.Fragment>
  );
}
const typographyStyles = theme => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
});
const StyledTypography = withStyles(typographyStyles)(Typography);
export default function Board({ data }) {
  const [board, setBoardState] = useState(data);
  useEffect(
    () => {
      setBoardState(data);
    },
    [data],
  );
  function togglePin(index) {
    const status = [...board.status];
    status[index] = !status[index];
    setPin(board.id, board.pins[index], status[index]).then(() => {
      setBoardState({ ...board, status });
    });
  }

  return (
    <div style={{ margin: '20px' }}>
      <PaperSheet elevation={1}>
        <Grid container spacing={24}>
          <Grid item xs={3} sm={6}>
            <Typography variant="title" component="span">
              {board.name}
            </Typography>
          </Grid>
          <Grid item xs={9} sm={6}>
            <Typography
              align="right"
              style={{ display: 'flex', flexDirection: 'row-reverse' }}
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              {board.ip}
              {' '}
              <Emoji style={EmojiStyle} name="ip" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTypography
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              <Emoji style={EmojiStyle} name="iot-board" />
              {' '}
              {board.id}
            </StyledTypography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              style={{ display: 'flex', flexDirection: 'row-reverse' }}
              align="right"
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              <DisplayDate date={board.lastOnline} />
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell align="center">Pin</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {board.pins.map((pin, i) => (
                <TableRow key={pin}>
                  <TableCell>
                    <Emoji name={board.buttons[i]} />
                  </TableCell>
                  <TableCell align="center">{pin}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={board.status[i]}
                      onChange={togglePin.bind(null, i)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </PaperSheet>
    </div>
  );
}
