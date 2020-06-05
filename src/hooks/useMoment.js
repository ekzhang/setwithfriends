import { useEffect, useState } from "react";
import moment from "moment";
import useFirebaseRef from "./useFirebaseRef";

function useMoment(delay = 1000) {
  const [time, setTime] = useState(moment()); // Estimated firebase server time
  const [offset] = useFirebaseRef(".info/serverTimeOffset");

  useEffect(() => {
    const id = setInterval(() => {
      setTime(moment(Date.now() + offset));
    }, delay);

    // Clear any intervals that saw stale offsets
    return () => clearInterval(id);
  }, [offset, delay]);

  return time;
}

export default useMoment;
