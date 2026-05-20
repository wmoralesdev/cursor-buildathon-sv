/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  /** When set, /onepager, /onepager-niu, and /onepager-boxful require this password (client bundle). */
  readonly VITE_ONEPAGER_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
