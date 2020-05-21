import { useEffect, useState } from "react";

function useFirebaseQuery(query) {
  const [value, setValue] = useState({});

  useEffect(() => {
    function childAddedOrChanged(snap) {
      setValue((value) => ({ ...value, [snap.key]: snap.val() }));
    }

    function childRemoved(snap) {
      setValue((value) => {
        const { [snap.key]: removedKey, ...newValue } = value;
        void removedKey;
        return newValue;
      });
    }

    setValue({});
    query.on("child_added", childAddedOrChanged);
    query.on("child_removed", childRemoved);
    query.on("child_changed", childAddedOrChanged);
    return () => {
      query.off("child_added", childAddedOrChanged);
      query.off("child_removed", childRemoved);
      query.off("child_changed", childAddedOrChanged);
    };
  }, [query]);

  return value;
}

export default useFirebaseQuery;
