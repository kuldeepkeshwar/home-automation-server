import { withStyles } from '@material-ui/core/styles';
import Offline from '@material-ui/icons/SignalCellularConnectedNoInternet0Bar';
import Online from '@material-ui/icons/SignalCellular4Bar';
import AccessTime from '@material-ui/icons/AccessTime';
import PermIdentity from '@material-ui/icons/PermIdentity';

const iconStyles = () => ({
  root: {
    fill: 'green',
    fontSize: '15px',
  },
});

export const OfflineIcon = withStyles(iconStyles)(Offline);
export const OnlineIcon = withStyles(iconStyles)(Online);
export const AccessTimeIcon = withStyles(iconStyles)(AccessTime);
export const PermIdentityIcon = withStyles(iconStyles)(PermIdentity);
