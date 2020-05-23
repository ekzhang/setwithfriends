import { useEffect, useState } from "react";
import moment from "moment";
import useFirebaseRef from "./useFirebaseRef";

function useMoment() {
  const [time, setTime] = useState(moment()); //firebase server time
  const [offSet] = useFirebaseRef(".info/serverTimeOffset");

  useEffect(() => {
    const id = setInterval(() => {
      setTime(moment().add(offSet, "ms"));
    }, 1000);
    return () => {
      clearInterval(id); //Any setIntervals() that saw stale offSet is cleared
    };
  }, [offSet]);

  return time;
}

export default useMoment;
