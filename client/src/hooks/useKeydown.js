import { useEffect } from "react";

function useKeydown(handler) {
  useEffect(() => {
    const patchedHandler = (event) =>
      document.activeElement.tagName !== "INPUT" && handler(event);
    window.addEventListener("keydown", patchedHandler);
    return () => {
      window.removeEventListener("keydown", patchedHandler);
    };
  }, [handler]);
}

export default useKeydown;
