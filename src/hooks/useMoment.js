import { useEffect, useState } from "react";
import moment from "moment";

function useMoment() {
  const [time, setTime] = useState(moment());
  useEffect(() => {
    const id = setInterval(() => setTime(moment()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default useMoment;
