import { styled } from "@mui/material/styles";

const SimpleInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "1px solid",
  borderRadius: 4,
  borderColor: theme.palette.divider,
  padding: "6px 8px",
  fontSize: "0.875rem",
  outline: "none",
  appearance: "none",
  transition: "border-color 0.2s",
  color: theme.components.MuiInput.styleOverrides.root.color,
  caretColor: theme.components.MuiInput.styleOverrides.root.caretColor,
  backgroundColor:
    theme.components.MuiInput.styleOverrides.root.backgroundColor,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

export default SimpleInput;
