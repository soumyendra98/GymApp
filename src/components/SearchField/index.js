import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

const SearchField = styled(MuiTextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    height: 40,
    border: 0,
    "&.Mui-focused fieldset": {
      border: "0.8px solid rgba(112, 110, 110, 0.4)",
    },
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 14,
  },
}));

export default SearchField;
