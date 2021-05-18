import { styled } from "@material-ui/core/styles";

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
  color: theme.input.textColor,
  caretColor: theme.input.caretColor,
  backgroundColor: theme.input.background,
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

export default SimpleInput;
