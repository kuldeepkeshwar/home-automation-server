import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';

const paperStyles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});
const PaperSheet = withStyles(paperStyles)(Paper);
export default PaperSheet;
