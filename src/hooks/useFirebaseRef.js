import { useEffect, useState } from "react";

import firebase from "../firebase";

function useFirebaseRef(path) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    function update(snapshot) {
      setValue(snapshot.val());
    }

    if (path) {
      const ref = firebase.database().ref(path);
      ref.on("value", update);
      return () => {
        ref.off("value", update);
      };
    }
  }, [path]);

  return value;
}

export default useFirebaseRef;
