import { useEffect, useState } from "react";

import firebase from "../firebase";

function useFirebaseRef(path) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function update(snapshot) {
      setValue(snapshot.val());
      setLoading(false);
    }

    setLoading(true);
    if (path) {
      const ref = firebase.database().ref(path);
      ref.on("value", update);
      return () => {
        ref.off("value", update);
      };
    }
  }, [path]);

  return [value, loading];
}

export default useFirebaseRef;
