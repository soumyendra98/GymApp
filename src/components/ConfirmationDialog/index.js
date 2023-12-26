import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Dialog, DialogTitle } from "components/Dialog";
import Button from "components/Button";

export default function ConfirmationDialog(props) {
  const { open, onClose, onConfirm, title, message, confirmButtonLabel } =
    props;

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(event, reason);
        }
      }}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>{title}</DialogTitle>

      <DialogContent dividers>{message}</DialogContent>

      <DialogActions>
        <Button
          label={confirmButtonLabel}
          color="info"
          onClick={onConfirm}
          style={{
            borderRadius: 10,
            fontSize: 16,
            color: "#FFFFFF",
            height: 40,
          }}
        />
      </DialogActions>
    </Dialog>
  );
}
