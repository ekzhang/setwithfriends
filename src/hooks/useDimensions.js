import { useLayoutEffect, useRef, useState } from "react";

function useDimensions() {
  const ref = useRef();
  const [dimensions, setDimensions] = useState(null);

  useLayoutEffect(() => {
    function update() {
      setDimensions(ref.current.getBoundingClientRect());
    }
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return [dimensions, ref];
}

export default useDimensions;
