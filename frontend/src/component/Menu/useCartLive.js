import { useEffect, useState } from "react";

const useCartLive = () => {
  const [cartData, setCartData] = useState(() => {
    const stored = sessionStorage.getItem("cartstate");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handleCartChange = () => {
      const stored = sessionStorage.getItem("cartstate");
      setCartData(stored ? JSON.parse(stored) : null);
    };

    // Listen to custom event
    window.addEventListener("cartstateChanged", handleCartChange);

    return () => {
      window.removeEventListener("cartstateChanged", handleCartChange);
    };
  }, []);

  return cartData;
};

export default useCartLive;