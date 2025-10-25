import { createContext } from "react";

export const QRCodeModalContext = createContext<{
  isOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isOpen: false, setModalOpen: () => {} });
