"use client";

import { useMediaQuery } from "react-responsive";

export const useIsDesktop = () => {
  return useMediaQuery({ minWidth: 768 });
};
