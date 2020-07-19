import { useEffect, useState } from "react";

function objectOrString(possibleJson) {
  if (!possibleJson) {
    return possibleJson;
  }
  try {
    return JSON.parse(possibleJson);
  } catch (e) {
      return possibleJson;
  }
}

function useStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const value = window.localStorage.getItem(key);
    return value === null ? initialValue : objectOrString(value);
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
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useStorage;
