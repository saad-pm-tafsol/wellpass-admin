"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CREDIT_AMOUNT, CREDIT_VALUE_SAR, creditsToSar } from "@/data/settings";

type CreditConversionState = {
  creditAmount: number;
  sarAmount: number;
  sarPerCredit: number;
  setConversion: (creditAmount: number, sarAmount: number) => void;
  convertCreditsToSar: (credits: number) => number;
};

const CreditConversionContext = createContext<CreditConversionState | null>(null);

export function CreditConversionProvider({ children }: { children: ReactNode }) {
  const [creditAmount, setCreditAmount] = useState(CREDIT_AMOUNT);
  const [sarAmount, setSarAmount] = useState(CREDIT_VALUE_SAR);

  const setConversion = useCallback((nextCreditAmount: number, nextSarAmount: number) => {
    setCreditAmount(Math.max(1, Math.trunc(nextCreditAmount)));
    setSarAmount(nextSarAmount);
  }, []);

  const convertCreditsToSar = useCallback(
    (credits: number) => creditsToSar(credits, creditAmount, sarAmount),
    [creditAmount, sarAmount],
  );

  const value = useMemo(
    () => ({
      creditAmount,
      sarAmount,
      sarPerCredit: creditsToSar(1, creditAmount, sarAmount),
      setConversion,
      convertCreditsToSar,
    }),
    [convertCreditsToSar, creditAmount, sarAmount, setConversion],
  );

  return (
    <CreditConversionContext.Provider value={value}>
      {children}
    </CreditConversionContext.Provider>
  );
}

export function useCreditConversion(): CreditConversionState {
  const ctx = useContext(CreditConversionContext);
  if (!ctx) throw new Error("useCreditConversion must be used within CreditConversionProvider");
  return ctx;
}
