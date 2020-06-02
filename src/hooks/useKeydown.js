import { useEffect } from "react";

function useKeydown(handler) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handler]);
}

export default useKeydown;
