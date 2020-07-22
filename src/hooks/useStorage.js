import { useEffect, useState } from "react";

function useStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const value = window.localStorage.getItem(key);
    return value === null ? initialValue : value;
  });

  useEffect(() => {
    function update({ key: k, newValue }) {
      if (k === key) {
        setValue(newValue);
      }
    }
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useStorage;
