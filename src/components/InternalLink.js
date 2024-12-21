import { forwardRef } from "react";

import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function InternalLink(props, ref) {
  return <Link ref={ref} component={RouterLink} underline="hover" {...props} />;
}

export default forwardRef(InternalLink);
