import { styled } from "@material-ui/core/styles";

// A scrollable element that has smart side-shadows
// Modified from: https://stackoverflow.com/a/44794221
const Scrollbox = styled("div")(({ theme }) => ({
  overflow: "auto",
  background: `
    /* Shadow covers */
    linear-gradient(${theme.palette.background.paper} 30%, rgba(255, 255, 255, 0)),
    linear-gradient(rgba(255, 255, 255, 0), ${theme.palette.background.paper} 70%) 0 100%,
    /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)),
    radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%
  `,
  backgroundColor: theme.palette.background.paper,
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 20px, 100% 20px, 100% 5px, 100% 5px",
  backgroundAttachment: "local, local, scroll, scroll",
}));

export default Scrollbox;
