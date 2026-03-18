import type React from "react";
import { createContext, useContext, useState } from "react";

export type Country = "uk" | "mt";

interface CountryContextValue {
  country: Country;
  setCountry: (c: Country) => void;
}

const CountryContext = createContext<CountryContextValue>({
  country: "uk",
  setCountry: () => {},
});

const LS_KEY = "iamthelaw_country";

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>(() => {
    const stored = localStorage.getItem(LS_KEY) as Country | null;
    return stored && ["uk", "mt"].includes(stored) ? stored : "uk";
  });

  const setCountry = (c: Country) => {
    setCountryState(c);
    localStorage.setItem(LS_KEY, c);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}
