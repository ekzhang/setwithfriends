import { useEffect, useState } from "react";

import firebase from "../firebase";

function useFirebaseRefs(paths, once = false) {
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues({});
    const refs = {};
    const updates = {};
    for (const path of paths) {
      updates[path] = (snapshot) => {
        if (once) refs[path].off("value", updates[path]);
        setValues((values) => ({ ...values, [path]: snapshot.val() }));
      };
      refs[path] = firebase.database().ref(path);
      refs[path].on("value", updates[path]);
    }
    return () => {
      for (const path of paths) {
        refs[path].off("value", updates[path]);
      }
    };
  }, [paths, once]);

  const results = [];
  for (const path of paths) {
    if (path in values) {
      results.push(values[path]);
    } else {
      return [null, true];
    }
  }
  return [results, false];
}

export default useFirebaseRefs;
