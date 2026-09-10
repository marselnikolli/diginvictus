# Multilingual Site (EN / IT / SQ) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the DIGInvictus site in English, Italian and Albanian at `/en`, `/it`, `/sq`, with every visible string editable in all three languages from the admin panel.

**Architecture:** Each settings section is stored as `{ en, it, sq }`; `en` is the structurally complete master and `it`/`sq` are text overlays. The API returns the full nested object and the client resolves a locale with English fallback via pure functions. Collections gain a `translations` JSON column. Admin editors use language tabs; structure (icons, URLs, prices, toggles) is owned by the English tab.

**Tech Stack:** React 18 + Vite, React Router 6, Express + better-sqlite3, npm workspaces, Node 18 built-in `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-10-multilingual-i18n-design.md`

## Global Constraints

- Locales are exactly `["en", "it", "sq"]`; `DEFAULT_LOCALE` is `"en"`.
- `en` is always the structurally complete master; `it`/`sq` contain only localized text fields.
- Missing or empty (`""`) translations resolve to the English value.
- No new runtime dependencies. Tests use Node's built-in `node:test` runner.
- `shared` is imported as a bare specifier (workspace symlink at `node_modules/shared`).
- Do not commit secrets. Commit only files named in each task.

---

### Task 1: Shared locale model, nested defaults and starter translations

**Files:**
- Modify: `shared/index.js` (full rewrite)
- Test: `shared/index.test.js` (create)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `LOCALES: string[]`, `DEFAULT_LOCALE: string`, `LOCALE_LABELS: Record<string,string>`
  - `CONTENT_SECTIONS: string[]` = `["site","hero","highlights","services","process","cta","footer","ui"]`
  - `DEFAULT_SITE`, `DEFAULT_HERO`, `DEFAULT_HIGHLIGHTS`, `DEFAULT_SERVICES`, `DEFAULT_PROCESS`, `DEFAULT_CTA`, `DEFAULT_FOOTER`, `DEFAULT_UI` — each `{ en, it, sq }`
  - `DEFAULT_CLIENTS`, `DEFAULT_TESTIMONIALS` — arrays; each item gains `translations: { it, sq }`

- [ ] **Step 1: Write the failing test**

Create `shared/index.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALES,
  DEFAULT_LOCALE,
  CONTENT_SECTIONS,
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_SERVICES,
  DEFAULT_PROCESS,
  DEFAULT_CTA,
  DEFAULT_FOOTER,
  DEFAULT_UI,
  DEFAULT_CLIENTS,
  DEFAULT_TESTIMONIALS,
} from "./index.js";

const SECTIONS = {
  site: DEFAULT_SITE,
  hero: DEFAULT_HERO,
  highlights: DEFAULT_HIGHLIGHTS,
  services: DEFAULT_SERVICES,
  process: DEFAULT_PROCESS,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
  ui: DEFAULT_UI,
};

test("locale constants are correct", () => {
  assert.deepEqual(LOCALES, ["en", "it", "sq"]);
  assert.equal(DEFAULT_LOCALE, "en");
  assert.deepEqual(CONTENT_SECTIONS, Object.keys(SECTIONS));
});

test("every section has a complete en master", () => {
  for (const [name, section] of Object.entries(SECTIONS)) {
    assert.ok(section.en && typeof section.en === "object", `${name}.en missing`);
  }
});

test("overlays only contain keys present in en", () => {
  for (const [name, section] of Object.entries(SECTIONS)) {
    const enKeys = new Set(Object.keys(section.en));
    for (const locale of LOCALES) {
      if (locale === "en") continue;
      const overlay = section[locale];
      assert.ok(overlay && typeof overlay === "object", `${name}.${locale} missing`);
      for (const key of Object.keys(overlay)) {
        assert.ok(enKeys.has(key), `${name}.${locale}.${key} is not in en`);
      }
    }
  }
});

test("collections expose it and sq translations", () => {
  for (const item of DEFAULT_CLIENTS) {
    assert.ok(item.translations?.it, `client ${item.name} missing it`);
    assert.ok(item.translations?.sq, `client ${item.name} missing sq`);
  }
  for (const item of DEFAULT_TESTIMONIALS) {
    assert.ok(item.translations?.it, "testimonial missing it");
    assert.ok(item.translations?.sq, "testimonial missing sq");
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test shared/index.test.js`
Expected: FAIL — `DEFAULT_SERVICES`/`DEFAULT_UI` are not exported (or `CONTENT_SECTIONS` mismatch).

- [ ] **Step 3: Rewrite `shared/index.js`**

Replace the whole file with:

```js
export const LOCALES = ["en", "it", "sq"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_LABELS = { en: "English", it: "Italiano", sq: "Shqip" };

export const DEFAULT_SITE = {
  en: {
    name: "DIGInvictus",
    tagline: "Building Digital",
    metaDescription:
      "DIGInvictus — web development, server infrastructure and managed hosting. Secure, fast and reliable digital products.",
    keywords:
      "web development, server infrastructure, managed hosting, maintenance, technical support, hosting, devops",
    copyright: "All rights reserved.",
    year: "2026",
  },
  it: {
    tagline: "Costruiamo il Digitale",
    metaDescription:
      "DIGInvictus — sviluppo web, infrastruttura server e hosting gestito. Prodotti digitali sicuri, veloci e affidabili.",
    keywords:
      "sviluppo web, infrastruttura server, hosting gestito, manutenzione, supporto tecnico, hosting, devops",
    copyright: "Tutti i diritti riservati.",
  },
  sq: {
    tagline: "Ndërtojmë Digjitalen",
    metaDescription:
      "DIGInvictus — zhvillim web, infrastrukturë serveri dhe hosting i menaxhuar. Produkte digjitale të sigurta, të shpejta dhe të besueshme.",
    keywords:
      "zhvillim web, infrastrukturë serveri, hosting i menaxhuar, mirëmbajtje, mbështetje teknike, hosting, devops",
    copyright: "Të gjitha të drejtat e rezervuara.",
  },
};

export const DEFAULT_HERO = {
  en: {
    headline: "Building Digital",
    subTitle: "Web Development · Infrastructure · Hosting",
    ctaLabel: "Get in touch",
    ctaLink: "mailto:hello@diginvictus.com",
    ctaEnabled: true,
    scrollEnabled: true,
    threejsEnabled: true,
  },
  it: {
    headline: "Costruiamo il Digitale",
    subTitle: "Sviluppo Web · Infrastruttura · Hosting",
    ctaLabel: "Contattaci",
  },
  sq: {
    headline: "Ndërtojmë Digjitalen",
    subTitle: "Zhvillim Web · Infrastrukturë · Hosting",
    ctaLabel: "Kontaktoni",
  },
};

export const DEFAULT_HIGHLIGHTS = {
  en: {
    eyebrow: "Core capabilities",
    heading: "What we do.",
    subtitle:
      "Web development and infrastructure services engineered to keep your digital products secure, fast and always available.",
    items: [
      {
        icon: "code",
        title: "Web Development",
        description:
          "Modern, fast and responsive websites built with the latest technologies and a strong focus on performance and user experience.",
      },
      {
        icon: "server",
        title: "Server Infrastructure",
        description:
          "Design, deployment and hardening of production servers, containers and cloud-like infrastructure that stays secure, fast and reliable.",
      },
      {
        icon: "database",
        title: "Managed Hosting",
        description:
          "Secure, high-performance hosting with proactive monitoring, automated backups and zero-downtime updates.",
      },
      {
        icon: "refresh",
        title: "Maintenance & Support",
        description:
          "Ongoing stability management, updates, monitoring, backup verification and priority support for your digital products.",
      },
    ],
  },
  it: {
    eyebrow: "Competenze chiave",
    heading: "Cosa facciamo.",
    subtitle:
      "Servizi di sviluppo web e infrastruttura progettati per mantenere i tuoi prodotti digitali sicuri, veloci e sempre disponibili.",
    items: [
      {
        title: "Sviluppo Web",
        description:
          "Siti web moderni, veloci e responsive costruiti con le tecnologie più recenti e una forte attenzione alle prestazioni e all'esperienza utente.",
      },
      {
        title: "Infrastruttura Server",
        description:
          "Progettazione, distribuzione e messa in sicurezza di server di produzione, container e infrastrutture cloud-like che restano sicure, veloci e affidabili.",
      },
      {
        title: "Hosting Gestito",
        description:
          "Hosting sicuro e ad alte prestazioni con monitoraggio proattivo, backup automatizzati e aggiornamenti senza downtime.",
      },
      {
        title: "Manutenzione e Supporto",
        description:
          "Gestione continua della stabilità, aggiornamenti, monitoraggio, verifica dei backup e supporto prioritario per i tuoi prodotti digitali.",
      },
    ],
  },
  sq: {
    eyebrow: "Kompetenca kryesore",
    heading: "Çfarë bëjmë.",
    subtitle:
      "Shërbime zhvillimi web dhe infrastrukture të projektuara për t'i mbajtur produktet tuaja digjitale të sigurta, të shpejta dhe gjithmonë të disponueshme.",
    items: [
      {
        title: "Zhvillim Web",
        description:
          "Faqe web moderne, të shpejta dhe responsive të ndërtuara me teknologjitë më të reja dhe fokus të fortë në performancë dhe përvojën e përdoruesit.",
      },
      {
        title: "Infrastrukturë Serveri",
        description:
          "Dizajn, vendosje dhe forcim i serverëve të prodhimit, kontejnerëve dhe infrastrukturave cloud-like që mbeten të sigurta, të shpejta dhe të besueshme.",
      },
      {
        title: "Hosting i Menaxhuar",
        description:
          "Hosting i sigurt dhe me performancë të lartë me monitorim proaktiv, backup të automatizuar dhe përditësime pa ndërprerje.",
      },
      {
        title: "Mirëmbajtje dhe Mbështetje",
        description:
          "Menaxhim i vazhdueshëm i stabilitetit, përditësime, monitorim, verifikim i backup-eve dhe mbështetje prioritare për produktet tuaja digjitale.",
      },
    ],
  },
};

export const DEFAULT_SERVICES = {
  en: {
    eyebrow: "Services",
    heading: "Technical Consultancy",
    subtitle: "Flat-rate engineering. Clear scope, fixed price, predictable outcomes.",
    fromLabel: "Fixed from",
    ctaLabel: "Request engagement",
    bestValueLabel: "Best Value",
    items: [
      {
        icon: "alert",
        title: "Priority Incident Response",
        description:
          "Production outage recovery, critical error resolution, malware containment, and site restoration.",
        price: "€150",
        delivery: "24–72 hours",
        features: [
          "Production downtime recovery",
          "Malware containment & cleanup",
          "Corrupted database repair",
          "Priority response within hours",
        ],
      },
      {
        icon: "trending-up",
        title: "Performance Engineering",
        description:
          "Full-stack speed optimization, database tuning, Redis caching, TTFB reduction, and hosting recommendations.",
        price: "€250",
        delivery: "3–5 days",
        features: [
          "Complete speed audit & bottleneck analysis",
          "Redis / object cache architecture",
          "Database query optimization",
          "Asset delivery & CDN tuning",
        ],
      },
      {
        icon: "shield",
        title: "Security Architecture & Hardening",
        description:
          "Threat assessment, malware remediation, WAF configuration, login hardening, and ongoing monitoring strategy.",
        price: "€200",
        delivery: "2–4 days",
        features: [
          "Malware scanning & deep cleanup",
          "WAF & brute-force protection",
          "File integrity monitoring",
          "Security roadmap & recommendations",
        ],
      },
      {
        icon: "share-2",
        title: "Migration Engineering",
        description:
          "Zero-risk site migrations with rollback guarantees, DNS + SSL management, and full environment validation.",
        price: "€150",
        delivery: "2–5 days",
        features: [
          "Zero-downtime migration plan",
          "DNS & SSL certificate transfer",
          "Environment parity verification",
          "Rollback strategy included",
        ],
      },
      {
        icon: "refresh",
        title: "Stability & Maintenance Retainer",
        description:
          "Ongoing stability management, updates, monitoring, backup verification, and priority support.",
        price: "€100",
        delivery: "Ongoing",
        bestValue: true,
        features: [
          "Core / plugin / theme updates",
          "Daily backup verification",
          "Uptime & performance monitoring",
          "Priority support & minor fixes",
        ],
      },
      {
        icon: "clipboard",
        title: "Technical Audit & Risk Assessment",
        description:
          "Comprehensive infrastructure audit covering performance, security, code quality, and a prioritized remediation roadmap.",
        price: "€300",
        delivery: "3–5 days",
        features: [
          "Full technical audit (speed, security, code, SEO)",
          "Plugin & theme code review",
          "Security vulnerability assessment",
          "Prioritized remediation roadmap",
        ],
      },
    ],
  },
  it: {
    eyebrow: "Servizi",
    heading: "Consulenza Tecnica",
    subtitle: "Ingegneria a tariffa fissa. Ambito chiaro, prezzo fisso, risultati prevedibili.",
    fromLabel: "A partire da",
    ctaLabel: "Richiedi intervento",
    bestValueLabel: "Miglior valore",
    items: [
      {
        title: "Risposta Prioritaria agli Incidenti",
        description:
          "Recupero da interruzioni di produzione, risoluzione di errori critici, contenimento malware e ripristino del sito.",
        features: [
          "Recupero da downtime di produzione",
          "Contenimento e pulizia malware",
          "Riparazione di database corrotti",
          "Risposta prioritaria entro poche ore",
        ],
      },
      {
        title: "Ingegneria delle Prestazioni",
        description:
          "Ottimizzazione completa della velocità, tuning del database, caching Redis, riduzione del TTFB e consigli sull'hosting.",
        features: [
          "Audit completo della velocità e analisi dei colli di bottiglia",
          "Architettura di cache Redis / object cache",
          "Ottimizzazione delle query del database",
          "Ottimizzazione della distribuzione degli asset e CDN",
        ],
      },
      {
        title: "Architettura di Sicurezza e Hardening",
        description:
          "Valutazione delle minacce, rimedio malware, configurazione WAF, hardening del login e strategia di monitoraggio continuo.",
        features: [
          "Scansione malware e pulizia profonda",
          "Protezione WAF e anti brute-force",
          "Monitoraggio dell'integrità dei file",
          "Roadmap di sicurezza e raccomandazioni",
        ],
      },
      {
        title: "Ingegneria delle Migrazioni",
        description:
          "Migrazioni del sito a rischio zero con garanzie di rollback, gestione DNS + SSL e validazione completa dell'ambiente.",
        features: [
          "Piano di migrazione senza downtime",
          "Trasferimento di DNS e certificato SSL",
          "Verifica della parità degli ambienti",
          "Strategia di rollback inclusa",
        ],
      },
      {
        title: "Accordo di Stabilità e Manutenzione",
        description:
          "Gestione continua della stabilità, aggiornamenti, monitoraggio, verifica dei backup e supporto prioritario.",
        features: [
          "Aggiornamenti core / plugin / tema",
          "Verifica giornaliera dei backup",
          "Monitoraggio di uptime e prestazioni",
          "Supporto prioritario e piccole correzioni",
        ],
      },
      {
        title: "Audit Tecnico e Valutazione del Rischio",
        description:
          "Audit completo dell'infrastruttura che copre prestazioni, sicurezza, qualità del codice e una roadmap di rimedi prioritizzata.",
        features: [
          "Audit tecnico completo (velocità, sicurezza, codice, SEO)",
          "Revisione del codice di plugin e tema",
          "Valutazione delle vulnerabilità di sicurezza",
          "Roadmap di rimedi prioritizzata",
        ],
      },
    ],
  },
  sq: {
    eyebrow: "Shërbimet",
    heading: "Konsulencë Teknike",
    subtitle: "Inxhinieri me tarifë fikse. Qëllim i qartë, çmim fiks, rezultate të parashikueshme.",
    fromLabel: "Nga",
    ctaLabel: "Kërko angazhim",
    bestValueLabel: "Vlera më e mirë",
    items: [
      {
        title: "Përgjigje Prioritare ndaj Incidenteve",
        description:
          "Rikuperim nga ndërprerjet në prodhim, zgjidhje e gabimeve kritike, izolim i malware-it dhe rikthim i faqes.",
        features: [
          "Rikuperim nga ndërprerja e prodhimit",
          "Izolim dhe pastrim i malware-it",
          "Riparim i bazës së të dhënave të dëmtuar",
          "Përgjigje prioritare brenda orëve",
        ],
      },
      {
        title: "Inxhinieri e Performancës",
        description:
          "Optimizim i plotë i shpejtësisë, rregullim i bazës së të dhënave, cache Redis, reduktim i TTFB dhe rekomandime hosting-u.",
        features: [
          "Auditim i plotë i shpejtësisë dhe analizë e pengesave",
          "Arkitekturë Redis / object cache",
          "Optimizim i pyetjeve të bazës së të dhënave",
          "Optimizim i shpërndarjes së aseteve dhe CDN",
        ],
      },
      {
        title: "Arkitekturë Sigurie dhe Hardening",
        description:
          "Vlerësim i kërcënimeve, zgjidhje e malware-it, konfigurim WAF, forcim i hyrjes dhe strategji monitorimi të vazhdueshëm.",
        features: [
          "Skanim dhe pastrim i thellë i malware-it",
          "Mbrojtje WAF dhe kundër brute-force",
          "Monitorim i integritetit të skedarëve",
          "Roadmap sigurie dhe rekomandime",
        ],
      },
      {
        title: "Inxhinieri e Migrimit",
        description:
          "Migrime të faqes pa rrezik me garanci rollback, menaxhim DNS + SSL dhe validim të plotë të mjedisit.",
        features: [
          "Plan migrimi pa ndërprerje",
          "Transferim i DNS dhe certifikatës SSL",
          "Verifikim i barazisë së mjedisit",
          "Strategji rollback e përfshirë",
        ],
      },
      {
        title: "Marrëveshje Stabiliteti dhe Mirëmbajtjeje",
        description:
          "Menaxhim i vazhdueshëm i stabilitetit, përditësime, monitorim, verifikim i backup-eve dhe mbështetje prioritare.",
        features: [
          "Përditësime core / plugin / teme",
          "Verifikim ditor i backup-eve",
          "Monitorim i uptime dhe performancës",
          "Mbështetje prioritare dhe rregullime të vogla",
        ],
      },
      {
        title: "Auditim Teknik dhe Vlerësim Rreziku",
        description:
          "Auditim gjithëpërfshirës i infrastrukturës që mbulon performancën, sigurinë, cilësinë e kodit dhe një roadmap të prioritizuar për zgjidhje.",
        features: [
          "Auditim i plotë teknik (shpejtësi, siguri, kod, SEO)",
          "Rishikim i kodit të plugin-eve dhe temës",
          "Vlerësim i vulnerabiliteteve të sigurisë",
          "Roadmap i prioritizuar për zgjidhje",
        ],
      },
    ],
  },
};

export const DEFAULT_PROCESS = {
  en: {
    eyebrow: "Methodology",
    heading: "How We Work",
    subtitle: "From risk assessment to resolution in three straightforward steps.",
    steps: [
      {
        title: "Risk Assessment",
        description:
          "We audit your infrastructure, identify vulnerabilities and scope the work. You receive a clear proposal with timeline and fixed price.",
      },
      {
        title: "Engineering & Resolution",
        description:
          "We perform the work — incident response, performance optimization, security hardening or migration — with continuous updates and rollback guarantees.",
      },
      {
        title: "Stabilisation & Handover",
        description:
          "Your system is verified, documented and stable. You get a post-engagement report with recommendations for ongoing stability.",
      },
    ],
  },
  it: {
    eyebrow: "Metodologia",
    heading: "Come Lavoriamo",
    subtitle: "Dalla valutazione del rischio alla risoluzione in tre semplici passaggi.",
    steps: [
      {
        title: "Valutazione del Rischio",
        description:
          "Analizziamo la tua infrastruttura, identifichiamo le vulnerabilità e definiamo l'ambito del lavoro. Ricevi una proposta chiara con tempistiche e prezzo fisso.",
      },
      {
        title: "Ingegneria e Risoluzione",
        description:
          "Eseguiamo il lavoro — risposta agli incidenti, ottimizzazione delle prestazioni, hardening di sicurezza o migrazione — con aggiornamenti continui e garanzie di rollback.",
      },
      {
        title: "Stabilizzazione e Consegna",
        description:
          "Il tuo sistema è verificato, documentato e stabile. Ricevi un report post-intervento con raccomandazioni per la stabilità continua.",
      },
    ],
  },
  sq: {
    eyebrow: "Metodologjia",
    heading: "Si Punojmë",
    subtitle: "Nga vlerësimi i rrezikut deri te zgjidhja në tre hapa të thjeshtë.",
    steps: [
      {
        title: "Vlerësim Rreziku",
        description:
          "Auditojmë infrastrukturën tuaj, identifikojmë vulnerabilitetet dhe përcaktojmë qëllimin e punës. Merrni një propozim të qartë me afate dhe çmim fiks.",
      },
      {
        title: "Inxhinieri dhe Zgjidhje",
        description:
          "Kryejmë punën — përgjigje ndaj incidenteve, optimizim i performancës, forcim sigurie ose migrim — me përditësime të vazhdueshme dhe garanci rollback.",
      },
      {
        title: "Stabilizim dhe Dorëzim",
        description:
          "Sistemi juaj verifikohet, dokumentohet dhe stabilizohet. Merrni një raport pas angazhimit me rekomandime për stabilitet të vazhdueshëm.",
      },
    ],
  },
};

export const DEFAULT_CTA = {
  en: {
    eyebrow: "Contact",
    heading: "Reduce your technical risk.",
    text: "Tell us about your infrastructure and hosting challenges. We will assess your risk profile and propose an action plan within 24 hours.",
    ctaLabel: "Get in touch",
    ctaLink: "mailto:hello@diginvictus.com",
  },
  it: {
    eyebrow: "Contatti",
    heading: "Riduci il tuo rischio tecnico.",
    text: "Raccontaci le sfide della tua infrastruttura e del tuo hosting. Valuteremo il tuo profilo di rischio e proporremo un piano d'azione entro 24 ore.",
    ctaLabel: "Contattaci",
  },
  sq: {
    eyebrow: "Kontakt",
    heading: "Ulni rrezikun tuaj teknik.",
    text: "Na tregoni për sfidat e infrastrukturës dhe hosting-ut tuaj. Do të vlerësojmë profilin tuaj të rrezikut dhe do të propozojmë një plan veprimi brenda 24 orëve.",
    ctaLabel: "Kontaktoni",
  },
};

export const DEFAULT_FOOTER = {
  en: {
    copyright: "All rights reserved.",
    year: "2026",
    tagline:
      "web development, server infrastructure and managed hosting engineered for stability.",
    exploreHeading: "Explore",
    contactHeading: "Contact",
    statusText: "all systems operational",
    socialLinks: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Instagram", url: "#", icon: "instagram" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "Twitter", url: "#", icon: "twitter" },
    ],
  },
  it: {
    copyright: "Tutti i diritti riservati.",
    tagline:
      "sviluppo web, infrastruttura server e hosting gestito progettati per la stabilità.",
    exploreHeading: "Esplora",
    contactHeading: "Contatti",
    statusText: "tutti i sistemi operativi",
    socialLinks: [{ name: "Facebook" }, { name: "Instagram" }, { name: "LinkedIn" }, { name: "Twitter" }],
  },
  sq: {
    copyright: "Të gjitha të drejtat e rezervuara.",
    tagline:
      "zhvillim web, infrastrukturë serveri dhe hosting i menaxhuar i projektuar për stabilitet.",
    exploreHeading: "Eksploro",
    contactHeading: "Kontakt",
    statusText: "të gjitha sistemet funksionale",
    socialLinks: [{ name: "Facebook" }, { name: "Instagram" }, { name: "LinkedIn" }, { name: "Twitter" }],
  },
};

export const DEFAULT_UI = {
  en: {
    navServices: "Services",
    navProcess: "Process",
    navWork: "Work",
    navContact: "Contact",
    getInTouch: "Get in touch",
    headerStatus: "systems online",
    scrollAria: "Scroll to highlights",
    footerStatus: "all systems operational",
    workEyebrow: "Recent work",
    workHeading: "Selected Engagements",
    workSubtitle: "Projects and engagements across banking, media, retail and beyond.",
    loadingText: "Loading…",
    errorText: "We're having a technical hiccup — please check back shortly.",
  },
  it: {
    navServices: "Servizi",
    navProcess: "Processo",
    navWork: "Lavori",
    navContact: "Contatti",
    getInTouch: "Contattaci",
    headerStatus: "sistemi online",
    scrollAria: "Scorri alle competenze",
    footerStatus: "tutti i sistemi operativi",
    workEyebrow: "Lavori recenti",
    workHeading: "Progetti Selezionati",
    workSubtitle: "Progetti e collaborazioni nel settore bancario, media, retail e oltre.",
    loadingText: "Caricamento…",
    errorText: "Stiamo riscontrando un problema tecnico — riprova tra poco.",
  },
  sq: {
    navServices: "Shërbimet",
    navProcess: "Procesi",
    navWork: "Punët",
    navContact: "Kontakt",
    getInTouch: "Kontaktoni",
    headerStatus: "sistemet online",
    scrollAria: "Kalo te veçoritë",
    footerStatus: "të gjitha sistemet funksionale",
    workEyebrow: "Punë të fundit",
    workHeading: "Angazhime të Zgjedhura",
    workSubtitle: "Projekte dhe angazhime në bankë, media, retail dhe më gjerë.",
    loadingText: "Po ngarkohet…",
    errorText: "Po kemi një problem teknik — ju lutem provoni përsëri së shpejti.",
  },
};

export const DEFAULT_CLIENTS = [
  {
    id: 1,
    name: "OTP Bank Albania",
    websiteUrl: "https://otpbank.al/sq/",
    logo: "/assets/otp-logo-white.svg",
    description: "Corporate website, digital presence and ongoing web maintenance.",
    translations: {
      it: { description: "Sito web aziendale, presenza digitale e manutenzione web continua." },
      sq: { description: "Faqe web korporative, prezencë digjitale dhe mirëmbajtje e vazhdueshme web." },
    },
    active: 1,
    order: 1,
  },
  {
    id: 2,
    name: "Dajti Ekspres",
    websiteUrl: "https://dajtiekspres.com/",
    logo: "/assets/dajti-logo.svg",
    description: "Website development and digital experience for the Dajti Express railway.",
    translations: {
      it: { description: "Sviluppo del sito web ed esperienza digitale per la ferrovia Dajti Express." },
      sq: { description: "Zhvillim i faqes web dhe përvojë digjitale për trenin Dajti Ekspres." },
    },
    active: 1,
    order: 2,
  },
  {
    id: 3,
    name: "Telesport",
    websiteUrl: "https://telesport.al/",
    logo: "/assets/telesport-white.svg",
    description: "Sports news portal with fast, responsive content delivery.",
    translations: {
      it: { description: "Portale di notizie sportive con consegna dei contenuti rapida e responsive." },
      sq: { description: "Portal lajmesh sportive me shpërndarje të shpejtë dhe responsive të përmbajtjes." },
    },
    active: 1,
    order: 3,
  },
  {
    id: 4,
    name: "GKHair Albania",
    websiteUrl: "https://gkhair.al/",
    logo: "/assets/gk_hair_logo.png",
    description: "Brand website and online presence for the GK Hair salon brand.",
    translations: {
      it: { description: "Sito web del brand e presenza online per il marchio di saloni GK Hair." },
      sq: { description: "Faqe web e brandit dhe prezencë online për markën e salloneve GK Hair." },
    },
    active: 1,
    order: 4,
  },
  {
    id: 5,
    name: "Bare Flowers",
    websiteUrl: "https://www.bareflowers.com/",
    logo: "/assets/bareflowers_logo.png",
    description: "E-commerce storefront and digital design.",
    translations: {
      it: { description: "Negozio e-commerce e design digitale." },
      sq: { description: "Dyqan e-commerce dhe dizajn digjital." },
    },
    active: 1,
    order: 5,
  },
  {
    id: 6,
    name: "Kryefjala",
    websiteUrl: "https://kryefjala.com/",
    logo: "/assets/kryefjala-logo.svg",
    description: "News platform front-end and digital publishing experience.",
    translations: {
      it: { description: "Front-end della piattaforma di notizie ed esperienza di editoria digitale." },
      sq: { description: "Front-end i platformës së lajmeve dhe përvojë botimi digjital." },
    },
    active: 1,
    order: 6,
  },
  {
    id: 7,
    name: "Kryqi Kuq Shqiptar",
    websiteUrl: "https://www.kksh.org.al/",
    logo: "/assets/kksh-logo.svg",
    description: "NGO website, digital presence and brand support for the Albanian Red Cross.",
    translations: {
      it: { description: "Sito web ONG, presenza digitale e supporto al brand per la Croce Rossa Albanese." },
      sq: { description: "Faqe web OJQ, prezencë digjitale dhe mbështetje brandi për Kryqin e Kuq Shqiptar." },
    },
    active: 1,
    order: 7,
  },
  {
    id: 8,
    name: "Ringside",
    websiteUrl: "https://ringside.al",
    logo: "/assets/ringside-logo.png",
    description: "High-traffic website infrastructure, performance tuning and zero-downtime deployments.",
    translations: {
      it: { description: "Infrastruttura per siti ad alto traffico, ottimizzazione delle prestazioni e deployment senza downtime." },
      sq: { description: "Infrastrukturë për faqe me trafik të lartë, optimizim i performancës dhe vendosje pa ndërprerje." },
    },
    active: 1,
    order: 8,
  },
  {
    id: 9,
    name: "Bojken Lako",
    websiteUrl: "https://bojkenlako.com",
    logo: "/assets/bojken-logo.png",
    description: "Official artist website for singer and composer Bojken Lako — digital presence, identity and fan-facing media.",
    translations: {
      it: { description: "Sito web ufficiale dell'artista per il cantante e compositore Bojken Lako — presenza digitale, identità e media per i fan." },
      sq: { description: "Faqe web zyrtare e artistit për këngëtarin dhe kompozitorin Bojken Lako — prezencë digjitale, identitet dhe media për fansat." },
    },
    active: 1,
    order: 9,
  },
  {
    id: 10,
    name: "RTSH",
    websiteUrl: "https://rtsh.al",
    logo: "/assets/rtsh-logo.svg",
    description: "High-traffic national broadcaster platform — performance, stability and hosting for the Albanian public media.",
    translations: {
      it: { description: "Piattaforma dell'emittente nazionale ad alto traffico — prestazioni, stabilità e hosting per i media pubblici albanesi." },
      sq: { description: "Platformë e transmetuesit kombëtar me trafik të lartë — performancë, stabilitet dhe hosting për mediat publike shqiptare." },
    },
    active: 1,
    order: 10,
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote:
      "DIGInvictus delivered a website that perfectly represents our brand. Professional, creative and always on time.",
    author: "Client Name",
    role: "Marketing Director",
    company: "Example Company",
    translations: {
      it: {
        quote:
          "DIGInvictus ha realizzato un sito web che rappresenta perfettamente il nostro brand. Professionali, creativi e sempre puntuali.",
      },
      sq: {
        quote:
          "DIGInvictus realizoi një faqe web që përfaqëson në mënyrë të përsosur markën tonë. Profesionistë, krijues dhe gjithmonë në kohë.",
      },
    },
    active: 1,
    order: 1,
  },
  {
    id: 2,
    quote:
      "Their team handled our social media and the growth was immediate. Highly recommended digital partner.",
    author: "Another Client",
    role: "CEO",
    company: "Another Company",
    translations: {
      it: {
        quote:
          "Il loro team ha gestito i nostri social media e la crescita è stata immediata. Partner digitale altamente raccomandato.",
      },
      sq: {
        quote:
          "Ekipi i tyre menaxhoi mediat tona sociale dhe rritja ishte e menjëhershme. Partner digjital shumë i rekomanduar.",
      },
    },
    active: 1,
    order: 2,
  },
];

export const DEFAULT_ADMIN = {
  email: "admin@diginvictus.com",
  password: "admin123",
};

export const CONTENT_SECTIONS = ["site", "hero", "highlights", "services", "process", "cta", "footer", "ui"];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test shared/index.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add shared/index.js shared/index.test.js
git commit -m "feat(i18n): add locale model and nested default content"
```

---

### Task 2: Client locale resolution logic

**Files:**
- Create: `client/src/i18n/resolve.js`
- Test: `client/src/i18n/resolve.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `resolveLocale(base, overlay)` — recursive merge; returns `any`.
  - `getSection(section, locale)` — takes a stored section `{en,it,sq}` (or a legacy flat object) and a locale string; returns the resolved section.
  - `localizeItem(item, locale)` — merges `item.translations[locale]` over `item`.

- [ ] **Step 1: Write the failing test**

Create `client/src/i18n/resolve.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { resolveLocale, getSection, localizeItem } from "./resolve.js";

test("overlay overrides base scalars", () => {
  assert.equal(resolveLocale("Hello", "Ciao"), "Ciao");
});

test("missing, null and empty overlays fall back to base", () => {
  assert.equal(resolveLocale("Hello", undefined), "Hello");
  assert.equal(resolveLocale("Hello", null), "Hello");
  assert.equal(resolveLocale("Hello", ""), "Hello");
});

test("objects merge key by key", () => {
  const base = { a: "A", b: "B" };
  assert.deepEqual(resolveLocale(base, { b: "Bee" }), { a: "A", b: "Bee" });
});

test("arrays merge by index and keep trailing base items", () => {
  const base = [{ title: "One", icon: "code" }, { title: "Two", icon: "server" }];
  const overlay = [{ title: "Uno" }];
  assert.deepEqual(resolveLocale(base, overlay), [
    { title: "Uno", icon: "code" },
    { title: "Two", icon: "server" },
  ]);
});

test("getSection returns the en master for en", () => {
  const section = { en: { heading: "Hi" }, it: { heading: "Ciao" } };
  assert.deepEqual(getSection(section, "en"), { heading: "Hi" });
});

test("getSection merges a locale overlay over en", () => {
  const section = {
    en: { heading: "Hi", subtitle: "Sub", items: [{ title: "A", icon: "code" }] },
    it: { heading: "Ciao", items: [{ title: "Uno" }] },
  };
  assert.deepEqual(getSection(section, "it"), {
    heading: "Ciao",
    subtitle: "Sub",
    items: [{ title: "Uno", icon: "code" }],
  });
});

test("getSection passes legacy flat sections through unchanged", () => {
  const flat = { heading: "Legacy" };
  assert.deepEqual(getSection(flat, "it"), flat);
});

test("localizeItem merges item translations", () => {
  const item = { id: 1, name: "Bank", description: "English", translations: { it: { description: "Italiano" } } };
  assert.deepEqual(localizeItem(item, "it"), { id: 1, name: "Bank", description: "Italiano", translations: item.translations });
});

test("localizeItem returns the item unchanged for en or missing translations", () => {
  const item = { id: 1, name: "Bank" };
  assert.equal(localizeItem(item, "en"), item);
  assert.equal(localizeItem(item, "it"), item);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test client/src/i18n/resolve.test.js`
Expected: FAIL — cannot find module `./resolve.js`.

- [ ] **Step 3: Write the implementation**

Create `client/src/i18n/resolve.js`:

```js
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function resolveLocale(base, overlay) {
  if (Array.isArray(base) || Array.isArray(overlay)) {
    const b = Array.isArray(base) ? base : [];
    const o = Array.isArray(overlay) ? overlay : [];
    const length = Math.max(b.length, o.length);
    return Array.from({ length }, (_, i) => resolveLocale(b[i], o[i]));
  }

  if (isPlainObject(base) || isPlainObject(overlay)) {
    const out = isPlainObject(base) ? { ...base } : {};
    if (isPlainObject(overlay)) {
      for (const key of Object.keys(overlay)) {
        out[key] = resolveLocale(out[key], overlay[key]);
      }
    }
    return out;
  }

  if (overlay === undefined || overlay === null || overlay === "") return base;
  return overlay;
}

export function getSection(section, locale) {
  if (!section || typeof section !== "object") return section;
  if (!("en" in section)) return section;
  if (!locale || locale === "en") return section.en;
  return resolveLocale(section.en, section[locale] || {});
}

export function localizeItem(item, locale) {
  if (!item || !locale || locale === "en") return item;
  const overlay = item.translations?.[locale];
  if (!overlay) return item;
  return { ...item, ...resolveLocale(item, overlay) };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test client/src/i18n/resolve.test.js`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/i18n/resolve.js client/src/i18n/resolve.test.js
git commit -m "feat(i18n): add client locale resolution helpers"
```

---

### Task 3: Server database migrations and seeds

**Files:**
- Modify: `server/src/db.js` (full rewrite)
- Test: `server/src/db.test.js` (create)

**Interfaces:**
- Consumes: `DEFAULT_SITE`, `DEFAULT_HERO`, `DEFAULT_HIGHLIGHTS`, `DEFAULT_SERVICES`, `DEFAULT_PROCESS`, `DEFAULT_CTA`, `DEFAULT_FOOTER`, `DEFAULT_UI`, `DEFAULT_CLIENTS`, `DEFAULT_TESTIMONIALS` from `shared` (Task 1).
- Produces: default export `db` (better-sqlite3 Database) and named `DATA_DIR`, `UPLOAD_DIR`. After import, `settings` rows contain `{en,it,sq}` and `clients`/`testimonials` have a populated `translations` column.

- [ ] **Step 1: Write the failing test**

Create `server/src/db.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";

async function loadDb() {
  const dir = mkdtempSync(join(tmpdir(), "dig-db-"));
  process.env.DATA_DIR = dir;
  process.env.UPLOAD_DIR = join(dir, "uploads");
  return { dir };
}

test("fresh database is seeded with nested locales and translations", async () => {
  const { dir } = await loadDb();
  const mod = await import(`./db.js?fresh=${Date.now()}`);
  const db = mod.default;

  const hero = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value);
  assert.ok(hero.en && hero.it && hero.sq);
  assert.equal(hero.en.headline, "Building Digital");

  const services = db.prepare("SELECT value FROM settings WHERE key = 'services'").get();
  assert.ok(services, "services section seeded");

  const client = db.prepare("SELECT translations FROM clients ORDER BY id LIMIT 1").get();
  assert.ok(client.translations && client.translations !== "{}");

  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test("legacy flat settings are migrated preserving edits", async () => {
  const { dir } = await loadDb();
  const legacy = new Database(join(dir, "diginvictus.db"));
  legacy.exec("CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
  legacy
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?)")
    .run("hero", JSON.stringify({ headline: "Custom", subTitle: "X", ctaEnabled: true }));
  legacy.close();

  const mod = await import(`./db.js?legacy=${Date.now()}`);
  const db = mod.default;
  const hero = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'hero'").get().value);
  assert.equal(hero.en.headline, "Custom");
  assert.ok(hero.it, "starter italian overlay filled in");
  assert.ok(hero.sq, "starter albanian overlay filled in");

  db.close();
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test server/src/db.test.js`
Expected: FAIL — settings `hero` has no `en`/`it`/`sq` keys (current db.js stores flat values).

- [ ] **Step 3: Rewrite `server/src/db.js`**

Replace the whole file with:

```js
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_SERVICES,
  DEFAULT_PROCESS,
  DEFAULT_CTA,
  DEFAULT_FOOTER,
  DEFAULT_UI,
  DEFAULT_CLIENTS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_ADMIN,
} from "shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "..", "data");

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(DATA_DIR, "uploads");
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const db = new Database(join(DATA_DIR, "diginvictus.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website_url TEXT,
    logo TEXT,
    description TEXT,
    translations TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT,
    role TEXT,
    company TEXT,
    translations TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

const DEFAULT_SECTIONS = {
  site: DEFAULT_SITE,
  hero: DEFAULT_HERO,
  highlights: DEFAULT_HIGHLIGHTS,
  services: DEFAULT_SERVICES,
  process: DEFAULT_PROCESS,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
  ui: DEFAULT_UI,
};

function ensureColumn(table, column, type) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  }
}

ensureColumn("clients", "description", "TEXT");
ensureColumn("clients", "translations", "TEXT");
ensureColumn("testimonials", "translations", "TEXT");

function migrateClientsDescription() {
  const byName = new Map(DEFAULT_CLIENTS.map((c) => [c.name, c.description]));
  const stmt = db.prepare(
    "UPDATE clients SET description = ? WHERE name = ? AND (description IS NULL OR description = '')"
  );
  for (const [name, description] of byName) {
    if (description) stmt.run(description, name);
  }
}
migrateClientsDescription();

function seedSettings() {
  const stmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(DEFAULT_SECTIONS)) {
    stmt.run(key, JSON.stringify(value));
  }
}
seedSettings();

function migrateSettingsLocales() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const update = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
  for (const row of rows) {
    let parsed;
    try {
      parsed = JSON.parse(row.value);
    } catch {
      continue;
    }
    if (parsed && typeof parsed === "object" && "en" in parsed) continue;
    const defaults = DEFAULT_SECTIONS[row.key] || { en: {}, it: {}, sq: {} };
    const en = { ...(defaults.en || {}), ...(parsed && typeof parsed === "object" ? parsed : {}) };
    update.run(JSON.stringify({ en, it: defaults.it || {}, sq: defaults.sq || {} }), row.key);
  }
}
migrateSettingsLocales();

function seedCollectionTranslations(table, defaults, matchKey) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  const update = db.prepare(`UPDATE ${table} SET translations = ? WHERE id = ?`);
  for (const row of rows) {
    const has = row.translations && row.translations !== "" && row.translations !== "{}";
    if (has) continue;
    const def = defaults.find((d) => d[matchKey] === row[matchKey]);
    if (def?.translations) update.run(JSON.stringify(def.translations), row.id);
  }
}

function seedClients() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM clients").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO clients (name, website_url, logo, description, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const c of DEFAULT_CLIENTS) {
    stmt.run(
      c.name,
      c.websiteUrl,
      c.logo,
      c.description || "",
      JSON.stringify(c.translations || {}),
      c.active,
      c.order
    );
  }
}

function seedTestimonials() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM testimonials").get().c;
  if (count > 0) return;
  const stmt = db.prepare(
    "INSERT INTO testimonials (quote, author, role, company, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const t of DEFAULT_TESTIMONIALS) {
    stmt.run(
      t.quote,
      t.author,
      t.role,
      t.company,
      JSON.stringify(t.translations || {}),
      t.active,
      t.order
    );
  }
}

function seedUsers() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  if (count > 0) return;
  const email = process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN.password;
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, hash);
  console.log(`Seeded admin user: ${email}`);
}

seedClients();
seedTestimonials();
seedCollectionTranslations("clients", DEFAULT_CLIENTS, "name");
seedCollectionTranslations("testimonials", DEFAULT_TESTIMONIALS, "quote");
seedUsers();

export default db;
export { DATA_DIR, UPLOAD_DIR };
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test server/src/db.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add server/src/db.js server/src/db.test.js
git commit -m "feat(i18n): migrate settings to nested locales and seed translations"
```

---

### Task 4: Server content route accepts nested locale objects

**Files:**
- Modify: `server/src/routes/content.js` (full rewrite)

**Interfaces:**
- Consumes: `CONTENT_SECTIONS` from `shared` (Task 1); `db` (Task 3).
- Produces: `GET /api/content` and `GET /api/content/:section` return nested `{en,it,sq}`; `PUT /api/content/:section` validates and stores a nested object.

- [ ] **Step 1: Replace `server/src/routes/content.js`**

```js
import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { CONTENT_SECTIONS } from "shared";

const router = express.Router();

function getAllSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));
}

function isValidSectionValue(body) {
  return (
    body !== null &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    body.en !== null &&
    typeof body.en === "object" &&
    !Array.isArray(body.en)
  );
}

router.get("/", (req, res) => {
  res.json(getAllSettings());
});

router.get("/:section", (req, res) => {
  const { section } = req.params;
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(section);
  if (!row) return res.status(404).json({ error: "Section not found" });
  res.json(JSON.parse(row.value));
});

router.put("/:section", requireAuth, (req, res) => {
  const { section } = req.params;
  if (!CONTENT_SECTIONS.includes(section)) {
    return res.status(400).json({ error: "Unknown section" });
  }
  if (!isValidSectionValue(req.body)) {
    return res.status(400).json({ error: "Body must be an object with an 'en' object" });
  }
  const value = JSON.stringify(req.body);
  db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(value, section);
  res.json({ ok: true, section, value: req.body });
});

export default router;
```

- [ ] **Step 2: Verify by booting the server against a fresh temp DB**

Run:

```bash
rm -rf /tmp/dig-i18n && mkdir -p /tmp/dig-i18n
DATA_DIR=/tmp/dig-i18n UPLOAD_DIR=/tmp/dig-i18n/uploads PORT=4100 node server/src/index.js &
sleep 1
curl -s http://localhost:4100/api/content | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const c=JSON.parse(s);console.log(Object.keys(c).join(','));console.log(!!c.hero.en, !!c.hero.it, !!c.services.en)})"
kill %1
```

Expected output:

```
site,hero,highlights,services,process,cta,footer,ui
true true true
```

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/content.js
git commit -m "feat(i18n): store and serve nested locale content"
```

---

### Task 5: Server clients and testimonials expose translations

**Files:**
- Modify: `server/src/routes/clients.js` (full rewrite)
- Modify: `server/src/routes/testimonials.js` (full rewrite)

**Interfaces:**
- Consumes: `db` (Task 3).
- Produces: client/testimonial JSON now includes a `translations` object (`{}` when empty); POST/PUT accept a `translations` object.

- [ ] **Step 1: Replace `server/src/routes/clients.js`**

```js
import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function parseTranslations(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function rowToClient(row) {
  return {
    id: row.id,
    name: row.name,
    websiteUrl: row.website_url,
    logo: row.logo,
    description: row.description,
    translations: parseTranslations(row.translations),
    active: row.active,
    order: row.position,
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM clients ORDER BY position ASC, id ASC").all();
  res.json(rows.map(rowToClient));
});

router.post("/", requireAuth, (req, res) => {
  const { name, websiteUrl, logo, description, translations, active, order } = req.body || {};
  if (!name) return res.status(400).json({ error: "Name is required" });
  const max = db.prepare("SELECT COALESCE(MAX(position), 0) AS m FROM clients").get().m;
  const result = db
    .prepare(
      "INSERT INTO clients (name, website_url, logo, description, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      name,
      websiteUrl || "",
      logo || "",
      description || "",
      JSON.stringify(translations || {}),
      active === false ? 0 : 1,
      order ?? max + 1
    );
  const row = db.prepare("SELECT * FROM clients WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(rowToClient(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { name, websiteUrl, logo, description, translations, active, order } = req.body || {};
  const existing = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Client not found" });
  db.prepare(
    "UPDATE clients SET name = ?, website_url = ?, logo = ?, description = ?, translations = ?, active = ?, position = ? WHERE id = ?"
  ).run(
    name ?? existing.name,
    websiteUrl ?? existing.website_url,
    logo ?? existing.logo,
    description ?? existing.description,
    translations === undefined ? existing.translations : JSON.stringify(translations),
    active === undefined ? existing.active : active ? 1 : 0,
    order ?? existing.position,
    id
  );
  const row = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
  res.json(rowToClient(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  res.json({ ok: true });
});

export default router;
```

- [ ] **Step 2: Replace `server/src/routes/testimonials.js`**

```js
import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function parseTranslations(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function rowToTestimonial(row) {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    role: row.role,
    company: row.company,
    translations: parseTranslations(row.translations),
    active: row.active,
    order: row.position,
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM testimonials ORDER BY position ASC, id ASC").all();
  res.json(rows.map(rowToTestimonial));
});

router.post("/", requireAuth, (req, res) => {
  const { quote, author, role, company, translations, active, order } = req.body || {};
  if (!quote) return res.status(400).json({ error: "Quote is required" });
  const max = db.prepare("SELECT COALESCE(MAX(position), 0) AS m FROM testimonials").get().m;
  const result = db
    .prepare(
      "INSERT INTO testimonials (quote, author, role, company, translations, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      quote,
      author || "",
      role || "",
      company || "",
      JSON.stringify(translations || {}),
      active === false ? 0 : 1,
      order ?? max + 1
    );
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(rowToTestimonial(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { quote, author, role, company, translations, active, order } = req.body || {};
  const existing = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Testimonial not found" });
  db.prepare(
    "UPDATE testimonials SET quote = ?, author = ?, role = ?, company = ?, translations = ?, active = ?, position = ? WHERE id = ?"
  ).run(
    quote ?? existing.quote,
    author ?? existing.author,
    role ?? existing.role,
    company ?? existing.company,
    translations === undefined ? existing.translations : JSON.stringify(translations),
    active === undefined ? existing.active : active ? 1 : 0,
    order ?? existing.position,
    id
  );
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
  res.json(rowToTestimonial(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
  res.json({ ok: true });
});

export default router;
```

- [ ] **Step 3: Verify clients/testimonials include translations**

Run:

```bash
rm -rf /tmp/dig-i18n2 && mkdir -p /tmp/dig-i18n2
DATA_DIR=/tmp/dig-i18n2 UPLOAD_DIR=/tmp/dig-i18n2/uploads PORT=4101 node server/src/index.js &
sleep 1
curl -s http://localhost:4101/api/clients | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const c=JSON.parse(s);console.log(c.length, !!c[0].translations.it)})"
curl -s http://localhost:4101/api/testimonials | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const c=JSON.parse(s);console.log(c.length, !!c[0].translations.sq)})"
kill %1
```

Expected output:

```
10 true
2 true
```

- [ ] **Step 4: Commit**

```bash
git add server/src/routes/clients.js server/src/routes/testimonials.js
git commit -m "feat(i18n): persist collection translations"
```

---

### Task 6: Client routing and locale provider

**Files:**
- Modify: `client/src/main.jsx` (full rewrite)
- Create: `client/src/i18n/LocaleContext.jsx`
- Create: `client/src/components/LanguageSwitcher.jsx`
- Modify: `client/src/App.jsx` (full rewrite)

**Interfaces:**
- Consumes: `LOCALES`, `DEFAULT_LOCALE`, `DEFAULT_UI` from `shared`; `getSection`, `localizeItem` from `../i18n/resolve.js` (Task 2); `getContent`, `getClients` from `./api/api.js`.
- Produces:
  - `LocaleProvider({ locale, children })`, `useLocale(): string`.
  - `LanguageSwitcher` component (no props).
  - `App` default export with routes `/` → redirect, `/:lang` → site, `*` → `/en`.
  - `Site` passes localized section props to every section component: `Header` gets `site`, `ui`; `Hero` gets `hero`, `site`, `ui`; `Highlights` gets `highlights`; `Services` gets `services`; `Process` gets `process`; `Clients` gets `clients`; `CtaBanner` gets `cta`; `Footer` gets `footer`, `site`, `ui`.

- [ ] **Step 1: Create `client/src/i18n/LocaleContext.jsx`**

```jsx
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
```

- [ ] **Step 2: Create `client/src/components/LanguageSwitcher.jsx`**

```jsx
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
```

- [ ] **Step 3: Replace `client/src/main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Replace `client/src/App.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { LOCALES, DEFAULT_LOCALE, DEFAULT_UI } from "shared";
import { getContent, getClients } from "./api/api.js";
import { LocaleProvider, useLocale } from "./i18n/LocaleContext.jsx";
import { getSection, localizeItem } from "./i18n/resolve.js";
import Header from "./components/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Highlights from "./sections/Highlights.jsx";
import Services from "./sections/Services.jsx";
import Process from "./sections/Process.jsx";
import Clients from "./sections/Clients.jsx";
import CtaBanner from "./sections/CtaBanner.jsx";
import Footer from "./sections/Footer.jsx";

function savedLocale() {
  try {
    const saved = localStorage.getItem("dig_locale");
    return LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${savedLocale()}`} replace />} />
        <Route path="/:lang" element={<Home />} />
        <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const { lang } = useParams();
  if (!LOCALES.includes(lang)) return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  return (
    <LocaleProvider locale={lang}>
      <Site />
    </LocaleProvider>
  );
}

function Site() {
  const locale = useLocale();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getContent(), getClients()])
      .then(([content, clients]) => setData({ content, clients }))
      .catch((e) => setError(e));
  }, []);

  const content = data?.content || null;
  const localized = content
    ? Object.fromEntries(Object.entries(content).map(([key, section]) => [key, getSection(section, locale)]))
    : null;
  const ui = localized?.ui || getSection(DEFAULT_UI, locale);

  useEffect(() => {
    if (!content?.site) return;
    const site = getSection(content.site, locale);
    document.documentElement.lang = locale;
    document.title = site.name || "DIGInvictus";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && site.metaDescription) meta.setAttribute("content", site.metaDescription);
  }, [content, locale]);

  if (error) {
    return (
      <>
        <Header site={null} ui={ui} />
        <main>
          <section className="hero">
            <div className="hero-content" style={{ height: "80vh" }}>
              <div className="hero-banner">
                <h1>Building Digital</h1>
                <p className="sub-title">{ui.errorText}</p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header site={null} ui={ui} />
        <main>
          <section className="hero">
            <div className="hero-content" style={{ height: "100vh" }}>
              <div className="hero-banner">
                <h1>Building Digital</h1>
                <p className="sub-title">{ui.loadingText}</p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  const { clients } = data;

  return (
    <>
      <Header site={localized.site} ui={localized.ui} />
      <main>
        <Hero hero={localized.hero} site={localized.site} ui={localized.ui} />
        <Highlights highlights={localized.highlights} />
        <Services services={localized.services} />
        <Process process={localized.process} />
        <Clients clients={clients.map((c) => localizeItem(c, locale))} ui={localized.ui} />
        <CtaBanner cta={localized.cta} />
        <Footer footer={localized.footer} site={localized.site} ui={localized.ui} />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify the build succeeds**

Run: `npm run build -w client`
Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/main.jsx client/src/App.jsx client/src/i18n/LocaleContext.jsx client/src/components/LanguageSwitcher.jsx
git commit -m "feat(i18n): add locale routing and provider"
```

---

### Task 7: Data-driven, localized client sections

**Files:**
- Modify: `client/src/components/Header.jsx` (full rewrite)
- Modify: `client/src/sections/Hero.jsx` (full rewrite)
- Modify: `client/src/sections/Highlights.jsx` (full rewrite)
- Modify: `client/src/sections/Services.jsx` (full rewrite)
- Modify: `client/src/sections/Process.jsx` (full rewrite)
- Modify: `client/src/sections/Clients.jsx` (full rewrite)
- Modify: `client/src/sections/CtaBanner.jsx` (full rewrite)
- Modify: `client/src/sections/Footer.jsx` (full rewrite)
- Modify: `client/src/styles.css` (append language-switch styles)

**Interfaces:**
- Consumes: the props produced by `Site` in Task 6; `LanguageSwitcher` (Task 6); `Logo`, `Icon`, `ThreeSphere` (existing).
- Produces: no exports consumed elsewhere.

- [ ] **Step 1: Replace `client/src/components/Header.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function Header({ site, ui }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: ui?.navServices || "Services", href: "#services" },
    { label: ui?.navProcess || "Process", href: "#process" },
    { label: ui?.navWork || "Work", href: "#work" },
    { label: ui?.navContact || "Contact", href: "#contact" },
  ];

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#" className="header-logo" aria-label={site?.name || "DIGInvictus"}>
          <Logo />
        </a>
        <span className="header-status" aria-hidden="true">
          <span className="header-dot" />
          {ui?.headerStatus || "systems online"}
        </span>
        <nav className="header-nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
        <a href="mailto:hello@diginvictus.com" className="button button--banner">
          {ui?.getInTouch || "Get in touch"}
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Replace `client/src/sections/Hero.jsx`**

```jsx
import React from "react";
import ThreeSphere from "../components/ThreeSphere.jsx";

export default function Hero({ hero, site, ui }) {
  return (
    <section id="hero" className="hero">
      <ThreeSphere enabled={hero?.threejsEnabled !== false} />
      <div className="hero-bg-grid" />
      <div className="hero-content">
        <div className="hero-banner">
          <h1>{hero?.headline || site?.tagline || "Building Digital"}</h1>
          {hero?.subTitle && <p className="sub-title">{hero.subTitle}</p>}
          {hero?.ctaEnabled && (
            <div className="hero-cta">
              <a href={hero.ctaLink || "#"} className="button button--banner">
                {hero.ctaLabel || "Get in touch"}
              </a>
            </div>
          )}
          {hero?.scrollEnabled && (
            <div className="hero-scroll">
              <a href="#section1" className="js--localscroll" aria-label={ui?.scrollAria || "Scroll to highlights"}>
                ▼
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace `client/src/sections/Highlights.jsx`**

```jsx
import React from "react";
import Icon from "../components/Icon.jsx";

export default function Highlights({ highlights }) {
  if (!highlights) return null;
  return (
    <section id="section1" className="highlights styled">
      <div className="highlights-header">
        <span className="section-eyebrow section-eyebrow--dot">{highlights.eyebrow || "Core capabilities"}</span>
        <h2>{highlights.heading}</h2>
        <p className="highlights-subtitle">{highlights.subtitle}</p>
      </div>
      {highlights.items && highlights.items.length > 0 && (
        <div className="highlights-grid">
          {highlights.items.map((item, i) => (
            <div className="highlights-card" key={i}>
              <div className="highlights-card-icon">
                <Icon name={item.icon || "code"} size={24} />
              </div>
              <h5 className="highlights-card-title">{item.title}</h5>
              <p className="highlights-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Replace `client/src/sections/Services.jsx`**

```jsx
import React from "react";
import Icon from "../components/Icon.jsx";

export default function Services({ services }) {
  if (!services) return null;
  const items = services.items || [];
  return (
    <section id="services" className="services">
      <div className="services-header">
        <span className="section-eyebrow section-eyebrow--dot">{services.eyebrow || "Services"}</span>
        <h2>{services.heading}</h2>
        <p className="services-subtitle">{services.subtitle}</p>
      </div>
      <div className="services-grid">
        {items.map((s, i) => (
          <div className={`services-card${s.bestValue ? " services-card--featured" : ""}`} key={i}>
            {s.bestValue && <span className="services-card-badge">{services.bestValueLabel || "Best Value"}</span>}
            <div className="services-card-icon">
              <Icon name={s.icon || "code"} size={28} />
            </div>
            <h3 className="services-card-title">{s.title}</h3>
            <p className="services-card-desc">{s.description}</p>
            {s.features && s.features.length > 0 && (
              <ul className="services-card-features">
                {s.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            )}
            <div className="services-card-footer">
              <span className="services-card-from">{services.fromLabel || "Fixed from"}</span>
              <div className="services-card-rate">
                <span className="services-card-price">{s.price}</span>
                <span className="services-card-duration">· {s.delivery}</span>
              </div>
              <a
                href={`mailto:hello@diginvictus.com?subject=Engagement%20request%3A%20${encodeURIComponent(s.title)}`}
                className="text-link services-card-cta"
              >
                {services.ctaLabel || "Request engagement"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace `client/src/sections/Process.jsx`**

```jsx
import React from "react";

export default function Process({ process }) {
  if (!process) return null;
  const steps = process.steps || [];
  return (
    <section id="process" className="process styled">
      <div className="process-header">
        <span className="section-eyebrow section-eyebrow--dot">{process.eyebrow || "Methodology"}</span>
        <h2>{process.heading}</h2>
        <p className="process-subtitle">{process.subtitle}</p>
      </div>
      <div className="process-grid">
        {steps.map((s, i) => (
          <div className="process-step" key={i}>
            <span className="process-step-number">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Replace `client/src/sections/Clients.jsx`**

```jsx
import React from "react";

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/\/+$/, "");
  } catch {
    return url || "";
  }
}

export default function Clients({ clients, ui }) {
  if (!clients || clients.length === 0) return null;
  const active = clients.filter((c) => c.active);
  return (
    <section id="work" className="clients styled">
      <div className="clients-content">
        <div className="clients-header">
          <span className="section-eyebrow section-eyebrow--dot">{ui?.workEyebrow || "Recent work"}</span>
          <h2>{ui?.workHeading || "Selected Engagements"}</h2>
          <p className="clients-subtitle">{ui?.workSubtitle}</p>
        </div>
        <ul className="clients-grid">
          {active.map((c) => (
            <li key={c.id}>
              <a
                href={c.websiteUrl || "#"}
                target="_blank"
                rel="noreferrer noopener"
                className="clients-card"
              >
                <div className="clients-card-head">
                  <div className="clients-card-logo">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} loading="lazy" />
                    ) : (
                      <span>{c.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="clients-card-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="clients-card-body">
                  <h3 className="clients-card-name">{c.name}</h3>
                  <span className="clients-card-domain">{hostnameOf(c.websiteUrl)}</span>
                  {c.description && <p className="clients-card-desc">{c.description}</p>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Replace `client/src/sections/CtaBanner.jsx`**

```jsx
import React from "react";

export default function CtaBanner({ cta }) {
  if (!cta) return null;
  return (
    <section id="contact" className="cta-banner styled">
      <div className="cta-banner-card">
        <span className="section-eyebrow section-eyebrow--dot">{cta.eyebrow || "Contact"}</span>
        <h2>{cta.heading}</h2>
        <p>{cta.text}</p>
        <div className="cta-banner-actions">
          <a href={cta.ctaLink || "mailto:hello@diginvictus.com"} className="button button--banner">
            {cta.ctaLabel || "Get in touch"}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Replace `client/src/sections/Footer.jsx`**

```jsx
import React from "react";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";

export default function Footer({ footer, site, ui }) {
  const links = footer?.socialLinks || [];
  const explore = [
    { label: ui?.navServices || "Services", href: "#services" },
    { label: ui?.navProcess || "How We Work", href: "#process" },
    { label: ui?.navWork || "Recent Work", href: "#work" },
    { label: ui?.navContact || "Contact", href: "#contact" },
  ];

  return (
    <footer className="footer styled">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#" className="footer-brand-logo">
            <Logo className="footer-logo" />
          </a>
          <p className="footer-tagline">
            {site?.tagline || "Building Digital"} — {footer?.tagline || ""}
          </p>
        </div>
        <div className="footer-col">
          <h5>{footer?.exploreHeading || "Explore"}</h5>
          <ul>
            {explore.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h5>{footer?.contactHeading || "Contact"}</h5>
          <ul>
            <li>
              <a href="mailto:hello@diginvictus.com">hello@diginvictus.com</a>
            </li>
          </ul>
          {links.length > 0 && (
            <ul className="footer-social">
              {links.map((l, i) => (
                <li key={i}>
                  <a href={l.url || "#"} target="_blank" rel="noreferrer noopener" aria-label={l.name}>
                    <Icon name={l.icon || "facebook"} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p className="-copyright">
          <small>
            © {footer?.year || site?.year || new Date().getFullYear()} {site?.name || "DIGInvictus"}.{" "}
            {footer?.copyright || site?.copyright || "All rights reserved."}
          </small>
        </p>
        <p className="footer-status" aria-label="Systems status">
          <span className="footer-status-dot" />
          {footer?.statusText || ui?.footerStatus || "all systems operational"}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 9: Append language-switch styles to `client/src/styles.css`**

Add at the end of the file:

```css
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-right: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 2px;
}

.lang-switch-item {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  padding: 4px 8px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.lang-switch-item:hover {
  color: #fff;
}

.lang-switch-item.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
```

- [ ] **Step 10: Verify the build succeeds**

Run: `npm run build -w client`
Expected: build completes with no errors.

- [ ] **Step 11: Commit**

```bash
git add client/src/components/Header.jsx client/src/sections client/src/styles.css
git commit -m "feat(i18n): localize all public sections and add language switcher"
```

---

### Task 8: Admin section editor with language tabs

**Files:**
- Modify: `admin/src/components/Fields.jsx` (append `ListInput`)
- Modify: `admin/src/pages/SectionEditor.jsx` (full rewrite)
- Modify: `admin/src/admin.css` (append tab styles)

**Interfaces:**
- Consumes: `LOCALES`, `LOCALE_LABELS` from `shared`; `api.getSection`/`api.updateSection` (existing); `TextInput`, `Textarea`, `Toggle`, `ImageInput`, `IconPicker` (existing).
- Produces: `ListInput({ label, value, onChange })` where `value` is `string[]`; the editor reads/writes section values shaped `{en,it,sq}`.

- [ ] **Step 1: Append `ListInput` to `admin/src/components/Fields.jsx`**

Add after the `Textarea` export (before `Toggle` is fine):

```jsx
export function ListInput({ label, value, onChange, rows = 4 }) {
  const text = Array.isArray(value) ? value.join("\n") : value || "";
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea
        rows={rows}
        value={text}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
          )
        }
      />
    </label>
  );
}
```

- [ ] **Step 2: Replace `admin/src/pages/SectionEditor.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle, ImageInput, IconPicker, ListInput } from "../components/Fields.jsx";

const SCHEMAS = {
  site: [
    { key: "name", label: "Site name", type: "text", structural: true },
    { key: "year", label: "Copyright year", type: "text", structural: true },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "metaDescription", label: "Meta description", type: "textarea" },
    { key: "keywords", label: "Keywords", type: "textarea" },
    { key: "copyright", label: "Copyright text", type: "text" },
  ],
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subTitle", label: "Sub-title", type: "text" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaLink", label: "CTA link", type: "text", structural: true },
    { key: "ctaEnabled", label: "Show CTA button", type: "toggle", structural: true },
    { key: "scrollEnabled", label: "Show scroll-down arrow", type: "toggle", structural: true },
    { key: "threejsEnabled", label: "Show 3D particle sphere", type: "toggle", structural: true },
  ],
  highlights: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    {
      key: "items",
      label: "Service cards",
      type: "repeater",
      fields: [
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  services: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    { key: "fromLabel", label: "\"Fixed from\" label", type: "text" },
    { key: "ctaLabel", label: "Card CTA label", type: "text" },
    { key: "bestValueLabel", label: "\"Best value\" badge", type: "text" },
    {
      key: "items",
      label: "Service cards",
      type: "repeater",
      fields: [
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "price", label: "Price", type: "text", structural: true },
        { key: "delivery", label: "Delivery", type: "text", structural: true },
        { key: "bestValue", label: "Best value", type: "toggle", structural: true },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features (one per line)", type: "list" },
      ],
    },
  ],
  process: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    {
      key: "steps",
      label: "Steps",
      type: "repeater",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  cta: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "text", label: "Text", type: "textarea" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaLink", label: "CTA link", type: "text", structural: true },
  ],
  footer: [
    { key: "year", label: "Copyright year", type: "text", structural: true },
    { key: "copyright", label: "Copyright text", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "exploreHeading", label: "\"Explore\" heading", type: "text" },
    { key: "contactHeading", label: "\"Contact\" heading", type: "text" },
    { key: "statusText", label: "Status text", type: "text" },
    {
      key: "socialLinks",
      label: "Social links",
      type: "repeater",
      fields: [
        { key: "url", label: "URL", type: "text", structural: true },
        { key: "icon", label: "Icon", type: "icon", structural: true },
        { key: "name", label: "Name", type: "text" },
      ],
    },
  ],
  ui: [
    { key: "navServices", label: "Nav: Services", type: "text" },
    { key: "navProcess", label: "Nav: Process", type: "text" },
    { key: "navWork", label: "Nav: Work", type: "text" },
    { key: "navContact", label: "Nav: Contact", type: "text" },
    { key: "getInTouch", label: "Get in touch", type: "text" },
    { key: "headerStatus", label: "Header status", type: "text" },
    { key: "scrollAria", label: "Scroll arrow aria-label", type: "text" },
    { key: "footerStatus", label: "Footer status", type: "text" },
    { key: "workEyebrow", label: "Work section eyebrow", type: "text" },
    { key: "workHeading", label: "Work section heading", type: "text" },
    { key: "workSubtitle", label: "Work section subtitle", type: "textarea" },
    { key: "loadingText", label: "Loading text", type: "text" },
    { key: "errorText", label: "Error text", type: "textarea" },
  ],
};

function isStructural(field) {
  return field.structural === true || field.type === "toggle" || field.type === "icon" || field.type === "image";
}

function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case "toggle":
      return <Toggle label={field.label} value={value} onChange={onChange} />;
    case "textarea":
      return <Textarea label={field.label} value={value} onChange={onChange} />;
    case "image":
      return <ImageInput label={field.label} value={value} onChange={onChange} />;
    case "icon":
      return <IconPicker label={field.label} value={value} onChange={onChange} />;
    case "list":
      return <ListInput label={field.label} value={value} onChange={onChange} />;
    default:
      return <TextInput label={field.label} value={value} onChange={onChange} />;
  }
}

function setLocaleField(value, locale, key, v) {
  return { ...value, [locale]: { ...(value[locale] || {}), [key]: v } };
}

function setEnField(value, key, v) {
  return { ...value, en: { ...(value.en || {}), [key]: v } };
}

function setLocaleItem(value, locale, key, index, field, v) {
  const arr = Array.isArray(value[locale]?.[key]) ? [...value[locale][key]] : [];
  while (arr.length <= index) arr.push({});
  arr[index] = { ...(arr[index] || {}), [field]: v };
  return { ...value, [locale]: { ...(value[locale] || {}), [key]: arr } };
}

function setEnItem(value, key, index, field, v) {
  const arr = [...(value.en?.[key] || [])];
  arr[index] = { ...(arr[index] || {}), [field]: v };
  return { ...value, en: { ...value.en, [key]: arr } };
}

function addEnItem(value, key, fields) {
  const base = Object.fromEntries(
    fields.map((f) => [f.key, f.type === "toggle" ? true : f.type === "list" ? [] : ""])
  );
  return { ...value, en: { ...value.en, [key]: [...(value.en?.[key] || []), base] } };
}

function removeEnItem(value, key, index) {
  return { ...value, en: { ...value.en, [key]: (value.en?.[key] || []).filter((_, i) => i !== index) } };
}

export default function SectionEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus("");
    setError("");
    setActiveLocale("en");
    api
      .getSection(name)
      .then(setValue)
      .catch((e) => {
        setError(e.message);
        navigate("/", { replace: true });
      });
  }, [name]);

  const schema = SCHEMAS[name];
  if (!schema) return <p>Unknown section.</p>;
  if (!value) return <p className="loading">Loading…</p>;

  const topLevel = schema.filter((f) => f.type !== "repeater");
  const structuralFields = topLevel.filter(isStructural);
  const localizedFields = topLevel.filter((f) => !isStructural(f));
  const repeaters = schema.filter((f) => f.type === "repeater");

  async function save() {
    setStatus("saving");
    setError("");
    try {
      await api.updateSection(name, value);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  return (
    <div>
      <header className="page-header">
        <h1>Edit: {name}</h1>
        <button type="button" className="btn btn--primary" onClick={save}>
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      <div className="form-card">
        {structuralFields.length > 0 && (
          <div className="shared-fields">
            <h2 className="shared-fields-title">Shared settings</h2>
            {structuralFields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={value.en?.[field.key]}
                onChange={(v) => setValue(setEnField(value, field.key, v))}
              />
            ))}
          </div>
        )}

        <div className="lang-tabs" role="tablist" aria-label="Language">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={locale === activeLocale}
              className={locale === activeLocale ? "lang-tab active" : "lang-tab"}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>

        <div className="lang-panel">
          {localizedFields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={value[activeLocale]?.[field.key]}
              onChange={(v) => setValue(setLocaleField(value, activeLocale, field.key, v))}
            />
          ))}

          {repeaters.map((repeater) => {
            const fields = activeLocale === "en" ? repeater.fields : repeater.fields.filter((f) => !isStructural(f));
            const items =
              activeLocale === "en"
                ? value.en?.[repeater.key] || []
                : (value.en?.[repeater.key] || []).map((_, i) => value[activeLocale]?.[repeater.key]?.[i] || {});

            return (
              <div className="field" key={repeater.key}>
                <span className="field-label">{repeater.label}</span>
                {activeLocale !== "en" && (
                  <p className="field-hint">
                    Translate the cards defined in the English tab. Add or remove cards there.
                  </p>
                )}
                {items.map((item, index) => (
                  <div className="repeater-row" key={index}>
                    <div className="repeater-grid">
                      {fields.map((f) => (
                        <FieldControl
                          key={f.key}
                          field={f}
                          value={item[f.key]}
                          onChange={(v) =>
                            activeLocale === "en"
                              ? setValue(setEnItem(value, repeater.key, index, f.key, v))
                              : setValue(setLocaleItem(value, activeLocale, repeater.key, index, f.key, v))
                          }
                        />
                      ))}
                    </div>
                    {activeLocale === "en" && (
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => setValue(removeEnItem(value, repeater.key, index))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {activeLocale === "en" && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setValue(addEnItem(value, repeater.key, repeater.fields))}
                  >
                    + Add {repeater.label.toLowerCase()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Append tab styles to `admin/src/admin.css`**

Add at the end of the file:

```css
.lang-tabs {
  display: flex;
  gap: 6px;
  margin: 20px 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  font: inherit;
  font-size: 13px;
  padding: 8px 14px;
  cursor: pointer;
}

.lang-tab:hover {
  color: #fff;
}

.lang-tab.active {
  color: #fff;
  border-bottom-color: #6ea8fe;
}

.shared-fields {
  margin-bottom: 8px;
}

.shared-fields-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 12px;
}

.field-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 8px;
}
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build -w admin`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add admin/src/components/Fields.jsx admin/src/pages/SectionEditor.jsx admin/src/admin.css
git commit -m "feat(i18n): add language tabs to admin section editor"
```

---

### Task 9: Admin collection managers with language tabs and new navigation

**Files:**
- Modify: `admin/src/pages/ClientsManager.jsx` (full rewrite)
- Modify: `admin/src/pages/TestimonialsManager.jsx` (full rewrite)
- Modify: `admin/src/pages/Dashboard.jsx` (full rewrite)
- Modify: `admin/src/components/Layout.jsx` (full rewrite)

**Interfaces:**
- Consumes: `LOCALES`, `LOCALE_LABELS` from `shared`; existing `api` methods; `TextInput`, `Textarea`, `Toggle`, `ImageInput`.
- Produces: no exports consumed elsewhere.

- [ ] **Step 1: Replace `admin/src/pages/ClientsManager.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Toggle, ImageInput } from "../components/Fields.jsx";

const EMPTY = { name: "", websiteUrl: "", logo: "", description: "", active: true };

function withTranslations(client) {
  return {
    ...EMPTY,
    ...client,
    translations: {
      it: { name: "", description: "", ...(client?.translations?.it || {}) },
      sq: { name: "", description: "", ...(client?.translations?.sq || {}) },
    },
  };
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function load() {
    api
      .getClients()
      .then((data) => setClients(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEditing(client) {
    setActiveLocale("en");
    setEditing(withTranslations(client));
  }

  const form = editing || withTranslations(null);

  function updateForm(field, v) {
    setEditing({ ...form, [field]: v });
  }

  function updateTranslation(locale, field, v) {
    setEditing({
      ...form,
      translations: { ...form.translations, [locale]: { ...form.translations[locale], [field]: v } },
    });
  }

  async function save() {
    setError("");
    setStatus("saving");
    try {
      if (editing.id) {
        await api.updateClient(editing.id, editing);
      } else {
        await api.createClient(editing);
      }
      setEditing(null);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
      load();
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  async function toggleActive(c) {
    try {
      await api.updateClient(c.id, { active: !c.active });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(c) {
    if (!window.confirm(`Delete client "${c.name}"?`)) return;
    try {
      await api.deleteClient(c.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <header className="page-header">
        <h1>Clients</h1>
        <button type="button" className="btn btn--primary" onClick={() => startEditing(null)}>
          + Add client
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit client" : "New client"}</h2>
          <div className="form-grid">
            <TextInput label="Website URL" value={form.websiteUrl} onChange={(v) => updateForm("websiteUrl", v)} />
            <ImageInput label="Logo" value={form.logo} onChange={(v) => updateForm("logo", v)} />
            <Toggle label="Visible on site" value={form.active} onChange={(v) => updateForm("active", v)} />
          </div>

          <div className="lang-tabs" role="tablist" aria-label="Language">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                role="tab"
                aria-selected={locale === activeLocale}
                className={locale === activeLocale ? "lang-tab active" : "lang-tab"}
                onClick={() => setActiveLocale(locale)}
              >
                {LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>

          {activeLocale === "en" ? (
            <div className="lang-panel">
              <TextInput label="Name" value={form.name} onChange={(v) => updateForm("name", v)} />
              <TextInput
                label="Project description"
                value={form.description || ""}
                onChange={(v) => updateForm("description", v)}
              />
            </div>
          ) : (
            <div className="lang-panel">
              <TextInput
                label="Name"
                value={form.translations[activeLocale].name}
                onChange={(v) => updateTranslation(activeLocale, "name", v)}
              />
              <TextInput
                label="Project description"
                value={form.translations[activeLocale].description}
                onChange={(v) => updateTranslation(activeLocale, "description", v)}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={save}>
              {status === "saving" ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="list">
        {clients.map((c) => (
          <div className="list-row" key={c.id}>
            {c.logo ? <img src={c.logo} alt="" className="list-logo" /> : <div className="list-logo list-logo--empty" />}
            <div className="list-info">
              <strong>{c.name}</strong>
              <small>{c.websiteUrl || "—"}</small>
            </div>
            <button
              type="button"
              className={`badge ${c.active ? "badge--on" : "badge--off"}`}
              onClick={() => toggleActive(c)}
            >
              {c.active ? "Visible" : "Hidden"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => startEditing(c)}>
              Edit
            </button>
            <button type="button" className="btn btn--danger" onClick={() => remove(c)}>
              Delete
            </button>
          </div>
        ))}
        {clients.length === 0 && <p className="empty">No clients yet.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `admin/src/pages/TestimonialsManager.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "shared";
import { api } from "../api.js";
import { TextInput, Textarea, Toggle } from "../components/Fields.jsx";

const EMPTY = { quote: "", author: "", role: "", company: "", active: true };
const FIELDS = ["quote", "author", "role", "company"];

function withTranslations(item) {
  const empty = Object.fromEntries(FIELDS.map((f) => [f, ""]));
  return {
    ...EMPTY,
    ...item,
    translations: {
      it: { ...empty, ...(item?.translations?.it || {}) },
      sq: { ...empty, ...(item?.translations?.sq || {}) },
    },
  };
}

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function load() {
    api
      .getTestimonials()
      .then((data) => setItems(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEditing(item) {
    setActiveLocale("en");
    setEditing(withTranslations(item));
  }

  const form = editing || withTranslations(null);

  function updateForm(field, v) {
    setEditing({ ...form, [field]: v });
  }

  function updateTranslation(locale, field, v) {
    setEditing({
      ...form,
      translations: { ...form.translations, [locale]: { ...form.translations[locale], [field]: v } },
    });
  }

  async function save() {
    setError("");
    setStatus("saving");
    try {
      if (editing.id) {
        await api.updateTestimonial(editing.id, editing);
      } else {
        await api.createTestimonial(editing);
      }
      setEditing(null);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
      load();
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  async function toggleActive(t) {
    try {
      await api.updateTestimonial(t.id, { active: !t.active });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(t) {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(t.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <header className="page-header">
        <h1>Testimonials</h1>
        <button type="button" className="btn btn--primary" onClick={() => startEditing(null)}>
          + Add testimonial
        </button>
      </header>
      {status === "saved" && <p className="toast">Saved ✓</p>}
      {error && <p className="page-error">{error}</p>}

      {editing && (
        <div className="form-card">
          <h2>{editing.id ? "Edit testimonial" : "New testimonial"}</h2>

          <div className="lang-tabs" role="tablist" aria-label="Language">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                role="tab"
                aria-selected={locale === activeLocale}
                className={locale === activeLocale ? "lang-tab active" : "lang-tab"}
                onClick={() => setActiveLocale(locale)}
              >
                {LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>

          {activeLocale === "en" ? (
            <div className="lang-panel">
              <Textarea label="Quote" value={form.quote} onChange={(v) => updateForm("quote", v)} rows={3} />
              <div className="form-grid">
                <TextInput label="Author" value={form.author} onChange={(v) => updateForm("author", v)} />
                <TextInput label="Role" value={form.role} onChange={(v) => updateForm("role", v)} />
                <TextInput label="Company" value={form.company} onChange={(v) => updateForm("company", v)} />
              </div>
            </div>
          ) : (
            <div className="lang-panel">
              <Textarea
                label="Quote"
                value={form.translations[activeLocale].quote}
                onChange={(v) => updateTranslation(activeLocale, "quote", v)}
                rows={3}
              />
              <div className="form-grid">
                <TextInput
                  label="Author"
                  value={form.translations[activeLocale].author}
                  onChange={(v) => updateTranslation(activeLocale, "author", v)}
                />
                <TextInput
                  label="Role"
                  value={form.translations[activeLocale].role}
                  onChange={(v) => updateTranslation(activeLocale, "role", v)}
                />
                <TextInput
                  label="Company"
                  value={form.translations[activeLocale].company}
                  onChange={(v) => updateTranslation(activeLocale, "company", v)}
                />
              </div>
            </div>
          )}

          <Toggle label="Visible on site" value={form.active} onChange={(v) => updateForm("active", v)} />

          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={save}>
              {status === "saving" ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="list">
        {items.map((t) => (
          <div className="list-row list-row--col" key={t.id}>
            <div className="list-info">
              <p className="quote">“{t.quote}”</p>
              <small>
                {t.author} — {[t.role, t.company].filter(Boolean).join(", ") || "—"}
              </small>
            </div>
            <div className="list-actions">
              <button
                type="button"
                className={`badge ${t.active ? "badge--on" : "badge--off"}`}
                onClick={() => toggleActive(t)}
              >
                {t.active ? "Visible" : "Hidden"}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => startEditing(t)}>
                Edit
              </button>
              <button type="button" className="btn btn--danger" onClick={() => remove(t)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty">No testimonials yet.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace `admin/src/pages/Dashboard.jsx`**

```jsx
import React from "react";
import { Link } from "react-router-dom";

const cards = [
  { to: "/section/hero", title: "Hero", desc: "Headline, sub-title, CTA and scroll settings" },
  { to: "/section/highlights", title: "What we do", desc: "Heading and the capability cards" },
  { to: "/section/services", title: "Services", desc: "Service cards, prices and features" },
  { to: "/section/process", title: "Process", desc: "The three methodology steps" },
  { to: "/section/cta", title: "Contact banner", desc: "Contact section heading, text and button" },
  { to: "/section/ui", title: "Navigation & labels", desc: "Menu labels, status text and small UI strings" },
  { to: "/section/site", title: "Site settings", desc: "Name, tagline, SEO meta and keywords" },
  { to: "/section/footer", title: "Footer", desc: "Copyright, tagline and social links" },
  { to: "/clients", title: "Clients", desc: "Manage client logos shown on the homepage" },
  { to: "/testimonials", title: "Testimonials", desc: "Manage the testimonial slider" },
];

export default function Dashboard() {
  return (
    <div>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Edit any part of the DIGInvictus homepage in English, Italian and Albanian. Changes go live immediately.</p>
      </header>
      <div className="cards">
        {cards.map((card) => (
          <Link to={card.to} className="card" key={card.to}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Replace `admin/src/components/Layout.jsx`**

```jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../App.jsx";

const nav = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/section/hero", label: "Hero" },
  { to: "/section/highlights", label: "What we do" },
  { to: "/section/services", label: "Services" },
  { to: "/section/process", label: "Process" },
  { to: "/section/cta", label: "Contact banner" },
  { to: "/section/ui", label: "Navigation & labels" },
  { to: "/section/site", label: "Site settings" },
  { to: "/section/footer", label: "Footer" },
  { to: "/clients", label: "Clients" },
  { to: "/testimonials", label: "Testimonials" },
];

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">DIGInvictus</div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="logout" onClick={logout}>
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Verify the build succeeds**

Run: `npm run build -w admin`
Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add admin/src/pages/ClientsManager.jsx admin/src/pages/TestimonialsManager.jsx admin/src/pages/Dashboard.jsx admin/src/components/Layout.jsx
git commit -m "feat(i18n): add language tabs to collection managers and new sections"
```

---

### Task 10: Full build and end-to-end smoke verification

**Files:** none (verification only).

- [ ] **Step 1: Run all Node tests**

Run:

```bash
node --test shared/index.test.js client/src/i18n/resolve.test.js server/src/db.test.js
```

Expected: all tests PASS.

- [ ] **Step 2: Build both frontends**

Run: `npm run build`
Expected: client and admin builds complete with no errors.

- [ ] **Step 3: Boot the server and smoke-test the API**

Run:

```bash
rm -rf /tmp/dig-e2e && mkdir -p /tmp/dig-e2e
DATA_DIR=/tmp/dig-e2e UPLOAD_DIR=/tmp/dig-e2e/uploads PORT=4102 node server/src/index.js &
sleep 1
curl -s http://localhost:4102/api/content | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const c=JSON.parse(s);const ok=['site','hero','highlights','services','process','cta','footer','ui'].every(k=>c[k]&&c[k].en&&c[k].it&&c[k].sq);console.log('sections ok:',ok);console.log('it hero headline:',c.hero.it.headline);console.log('sq cta heading:',c.cta.sq.heading)})"
kill %1
```

Expected output:

```
sections ok: true
it hero headline: Costruiamo il Digitale
sq cta heading: Ulni rrezikun tuaj teknik.
```

- [ ] **Step 4: Verify admin write path round-trips**

Run:

```bash
rm -rf /tmp/dig-e2e2 && mkdir -p /tmp/dig-e2e2
DATA_DIR=/tmp/dig-e2e2 UPLOAD_DIR=/tmp/dig-e2e2/uploads PORT=4103 JWT_SECRET=testsecret node server/src/index.js &
sleep 1
TOKEN=$(curl -s -X POST http://localhost:4103/api/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@diginvictus.com","password":"admin123"}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
curl -s -X PUT http://localhost:4103/api/content/hero -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"en":{"headline":"Changed","ctaEnabled":true},"it":{"headline":"Cambiato"},"sq":{}}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log('put ok:',JSON.parse(s).ok))"
curl -s http://localhost:4103/api/content/hero | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const h=JSON.parse(s);console.log('en:',h.en.headline,'it:',h.it.headline)})"
kill %1
```

Expected output:

```
put ok: true
en: Changed it: Cambiato
```

- [ ] **Step 5: Manual browser checklist**

Start the dev servers (`npm run dev:server`, `npm run dev:client`, `npm run dev:admin`) and confirm:

1. `http://localhost:5173/` redirects to `/en`; `/it` and `/sq` render translated copy.
2. The header language switcher changes locale and preserves the current hash anchor.
3. Clearing an Italian field in the admin and saving makes the English text appear on `/it`.
4. The admin Services, Process, Contact banner and Navigation & labels editors show EN/IT/SQ tabs and save successfully.
5. Client and testimonial edit forms show language tabs; translated text appears on the public site.

- [ ] **Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "chore(i18n): final verification fixes"
```

Only run this if Step 5 produced changes; otherwise skip.

---

## Self-Review

**Spec coverage**

- Locale constants & CONTENT_SECTIONS → Task 1.
- Nested section shape, resolution algorithm, field inventory → Tasks 1, 2, 3.
- Collections `translations` → Tasks 1, 3, 5.
- Starter translations → Task 1.
- db migrations/seeds → Task 3.
- content route nested validation → Task 4.
- client routing `/en` `/it` `/sq`, `/` redirect, fallback → Task 6.
- i18n module (`resolve.js`, `LocaleContext.jsx`) → Tasks 2, 6.
- Language switcher + localized Header/sections + meta/lang → Tasks 6, 7.
- Admin language tabs for sections → Task 8.
- Admin tabs for collections + nav → Task 9.
- Build + API smoke + manual checklist → Task 10.

**Placeholder scan:** no TBD/TODO; every code step contains full code; translations are complete.

**Type consistency:** `resolveLocale`/`getSection`/`localizeItem` names and signatures match across Tasks 2 and 6. `LOCALES`/`DEFAULT_LOCALE`/`LOCALE_LABELS`/`DEFAULT_UI` match Tasks 1, 6, 8, 9. Section names in `CONTENT_SECTIONS` (Task 1) match `SCHEMAS` (Task 8) and the nav (Task 9). `translations` object shape matches Tasks 1, 3, 5, 9.
