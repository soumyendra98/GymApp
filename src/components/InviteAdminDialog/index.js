import Button from "components/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Dialog, DialogTitle } from "components/Dialog";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";

export default function MerchantInviteMemberDialog({ open, onClose, onSave }) {
  const [state, setState] = useMergeState({
    isLoading: false,

    email: "",

    errors: {},
  });

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSendInvitation = () => {
    if (!isFormValid()) {
      return;
    }

    onSave(state?.email);
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Invite Admin</DialogTitle>

      <DialogContent dividers>
        <div className="my-4">
          <TextField
            fullWidth
            label="EMAIL"
            variant="outlined"
            name="email"
            value={state.email}
            onChange={handleChange}
            required
            error={state?.errors?.email}
            InputLabelProps={{
              shrink: true,
              disableAnimation: true,
            }}
            autoComplete="off"
            disabled={state?.isLoading}
          />

          {state?.errors?.email && <ErrorMessage message="Email is required" />}
        </div>
      </DialogContent>

      <DialogActions>
        <div className="my-2">
          <Button
            label="Send Invitation"
            color="info"
            onClick={handleSendInvitation}
            style={{
              borderRadius: 4,
              fontSize: 14,
              color: "#FFFFFF",
              height: 40,
            }}
            loaderButton
            loadingPosition="center"
            loading={state?.isLoading}
            disabled={state?.isLoading}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
}
