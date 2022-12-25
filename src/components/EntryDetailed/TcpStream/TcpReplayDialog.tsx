import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styles from './TcpStream.module.sass';
import { toast } from "react-toastify";
import { HubBaseUrl } from "../../../consts";

export interface TcpReplayDialogProps {
  color: string;
  node: string;
  tcpReplay: string;
  stream: string;
  worker: string;
}

export const TcpReplayDialog: React.FC<TcpReplayDialogProps> = ({ color, node, tcpReplay, stream, worker }) => {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState("1");
  const [delay, setDelay] = React.useState("100");

  const replayTcpStream = () => {
    setOpen(false);
    fetch(`${HubBaseUrl}/pcaps/replay/${worker}/${stream}?count=${count}&delay=${delay}`)
      .then(response => {
        if (response.status === 200) {
          toast.info("TCP replay was successful.", {
            theme: "colored"
          });
        } else {
          toast.error("TCP replay was failed!", {
            theme: "colored"
          });
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(err.toString(), {
          theme: "colored"
        });
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        className={`${styles.marginLeft10} ${styles.button}`}
        style={{
          backgroundColor: color,
        }}
        onClick={handleClickOpen}
        title={`Replay this TCP stream to the default network interface of the node: ${node}`}
      >
        {tcpReplay}
      </Button>
      <Dialog open={open} onClose={handleClose} style={{color: color}}>
        <DialogTitle style={{fontWeight: "bold", color: color}}>TCP Replay</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will replay the TCP stream <b>{stream}</b> on the node <b>{node}</b>.
          </DialogContentText>
          <DialogContentText style={{marginTop: "20px"}}>
            Please set how many times it will be replayed:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="count"
            label="TCP replay count"
            type="number"
            defaultValue={count}
            fullWidth
            variant="outlined"
            helperText="positive integer"
            required={true}
            onChange={(event) => setCount(event.target.value)}
          />
          <DialogContentText style={{marginTop: "20px"}}>
            The delay between the replayed packets:
          </DialogContentText>
          <TextField
            margin="dense"
            id="delay"
            label="Delay"
            type="number"
            defaultValue={delay}
            fullWidth
            variant="outlined"
            helperText="microseconds"
            required={true}
            onChange={(event) => setDelay(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{
              color: color,
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            style={{
              color: color,
            }}
            onClick={replayTcpStream}
          >
            Replay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
