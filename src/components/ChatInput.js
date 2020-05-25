import { styled } from "@material-ui/core/styles";

const ChatInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "1px solid",
  borderRadius: 4,
  borderColor: "rgba(0, 0, 0, 0.23)",
  padding: "6px 8px",
  fontSize: "0.875rem",
  outline: "none",
  appearance: "none",
  transition: "border-color 0.2s",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
}));

export default ChatInput;
