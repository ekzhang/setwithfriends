import useMoment from "../hooks/useMoment";

// Wrapper around useMoment, since state hooks cause rerender of component
function ElapsedTime({ value }) {
  const time = useMoment();
  return <>{time.to(value)}</>;
}

export default ElapsedTime;
