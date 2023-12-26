import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

const TextField = styled(MuiTextField)(() => ({
  "& .MuiInputLabel-root": {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Poppins",
    width: "100%",
    "&.Mui-focused": {
      color: "#363333",
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 6,
    fontFamily: "Poppins",
    "& legend": {
      display: "none",
    },
    // "&:hover fieldset": {
    //   borderColor: "#363333",
    // },
    "&.Mui-focused fieldset": {
      border: "0.8px solid rgba(112, 110, 110, 0.4)",
    },
  },
}));

export default TextField;
