import { useEffect, useState } from "react";

function useFirebaseQuery(query) {
  const [value, setValue] = useState({});

  useEffect(() => {
    function childAdded(snap) {
      setValue((value) => ({ ...value, [snap.key]: snap.val() }));
    }

    function childRemoved(snap) {
      setValue((value) => {
        const { [snap.key]: removedKey, newValue } = value;
        void removedKey;
        return newValue;
      });
    }

    setValue({});
    query.on("child_added", childAdded);
    query.on("child_removed", childRemoved);
    return () => {
      query.off("child_added", childAdded);
      query.off("child_removed", childRemoved);
    };
  }, [query]);

  return value;
}

export default useFirebaseQuery;
