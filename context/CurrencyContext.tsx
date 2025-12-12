"use client";
import { createContext, useContext, useState } from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR", 
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState("INR");

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
