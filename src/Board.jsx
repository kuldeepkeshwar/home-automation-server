/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { setPin } from './api';
import Switch from './Components/Switch';
import {
  OfflineIcon,
  OnlineIcon,
  PermIdentityIcon,
  AccessTimeIcon,
} from './Components/Icons';
import PaperSheet from './Components/Paper';

function DisplayDate({ date }) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  const Icon = diff > 60 ? OfflineIcon : OnlineIcon;
  return (
    <React.Fragment>
      <AccessTimeIcon />
      {' '}
      <span>{d.toLocaleString()}</span>
      {' '}
      <Icon />
    </React.Fragment>
  );
}
export default function Board({ data }) {
  const [board, setBoardState] = useState(data);
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
          <Grid item xs={3}>
            <Typography variant="title" component="span">
              {board.name}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography
              align="right"
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              <PermIdentityIcon />
              {' '}
              {board.id}
            </Typography>
            {/* <Typography align="right" variant="title" component="span" /> */}
          </Grid>
          <Grid item xs={3}>
            <Typography
              align="left"
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              IP:
              {' '}
              {board.ip}
            </Typography>
            {/* <Typography align="right" variant="title" component="span" /> */}
          </Grid>
          <Grid item xs={9}>
            <Typography
              align="right"
              variant="subheading"
              color="textSecondary"
              component="span"
            >
              <DisplayDate date={board.lastOnline} />
            </Typography>
            {/* <Typography align="right" variant="title" component="span" /> */}
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Button</TableCell>
                <TableCell align="center">Pin</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {board.pins.map((pin, i) => (
                <TableRow key={pin}>
                  <TableCell>{board.buttons[i]}</TableCell>
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
