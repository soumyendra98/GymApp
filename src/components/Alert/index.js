import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function Alert({ severity, message }) {
  const handleClose = () => {
    // appSetError({ severity: "", message: "" });
  };

  const hasError = severity && message ? true : false;

  return hasError ? (
    <Snackbar
      open={hasError}
      autoHideDuration={30000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MuiAlert
        severity={severity}
        onClose={handleClose}
        sx={{
          fontFamily: "Poppins",
        }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  ) : null;
}
