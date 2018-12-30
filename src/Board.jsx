import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { setPin } from './api';
import Switch from './Switch';

const paperStyles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});
const PaperSheet = withStyles(paperStyles)(Paper);
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
          <Grid item xs={12}>
            <Typography align="left" variant="h5" component="h2">
              Board:
              {' '}
              {board.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subheading" color="textSecondary">
              ID
              <Typography variant="title" component="h6">
                {board.id}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subheading" color="textSecondary">
              IP
              <Typography variant="title" component="h6">
                {board.ip}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subheading" color="textSecondary">
              Last Online
              <Typography variant="title" component="h6">
                {board.lastOnline}
              </Typography>
            </Typography>
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
                <TableRow key={i}>
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
