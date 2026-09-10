import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LOCALES, LOCALE_LABELS } from "shared";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const { hash } = useLocation();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LOCALES.map((code) => (
        <Link
          key={code}
          to={`/${code}${hash}`}
          className={code === locale ? "lang-switch-item active" : "lang-switch-item"}
          aria-current={code === locale ? "true" : undefined}
          title={LOCALE_LABELS[code]}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
