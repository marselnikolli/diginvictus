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
    tagline: "Building Digital",
    metaDescription:
      "DIGInvictus — sviluppo web, infrastruttura server e hosting gestito. Prodotti digitali sicuri, veloci e affidabili.",
    keywords:
      "sviluppo web, infrastruttura server, hosting gestito, manutenzione, supporto tecnico, hosting, devops",
    copyright: "Tutti i diritti riservati.",
  },
  sq: {
    tagline: "Building Digital",
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
    headline: "Building Digital",
    subTitle: "Sviluppo Web · Infrastruttura · Hosting",
    ctaLabel: "Contattaci",
  },
  sq: {
    headline: "Building Digital",
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
