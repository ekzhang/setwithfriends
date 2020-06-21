import React, { forwardRef } from "react";

import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

function InternalLink(props) {
  return <Link component={RouterLink} {...props} />;
}

export default forwardRef(InternalLink);
