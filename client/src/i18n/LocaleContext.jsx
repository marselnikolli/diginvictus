import React, { createContext, useContext, useEffect } from "react";

const LocaleContext = createContext("en");

export function LocaleProvider({ locale, children }) {
  useEffect(() => {
    try {
      localStorage.setItem("dig_locale", locale);
    } catch {
      /* ignore storage errors */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
