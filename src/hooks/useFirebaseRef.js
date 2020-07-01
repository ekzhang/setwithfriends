import { useEffect, useState } from "react";

import firebase from "../firebase";

function useFirebaseRef(path, once = false) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (path) {
      const ref = firebase.database().ref(path);
      const update = (snapshot) => {
        if (once) ref.off("value", update);
        setValue(snapshot.val());
        setLoading(false);
      };
      ref.on("value", update);
      return () => {
        ref.off("value", update);
      };
    }
  }, [path, once]);

  return [value, loading];
}

export default useFirebaseRef;
