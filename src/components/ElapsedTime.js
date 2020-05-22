import React from "react";
import useMoment from "../hooks/useMoment";
import moment from "moment";

//Wrapper around useMoment, since custom hooks cause rerender of component it's in
export default function ElapsedTime({ pastTime }) {
  const time = useMoment();
  return <div>{moment(pastTime).from(time)}</div>;
}
