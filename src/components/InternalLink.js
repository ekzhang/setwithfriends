import { forwardRef } from "react";

import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

function InternalLink(props, ref) {
  return <Link ref={ref} component={RouterLink} {...props} />;
}

export default forwardRef(InternalLink);
