import { styled } from "@material-ui/core/styles";
import FilledInput from "@material-ui/core/FilledInput";

const ChatInput = styled(FilledInput)({
  width: "100%",
  borderRadius: 0,
  "& input": {
    padding: "10px 12px",
  },
});

export default ChatInput;
