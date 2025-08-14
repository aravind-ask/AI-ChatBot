/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NHOST_SUBDOMAIN: string
  readonly VITE_APP_NHOST_REGION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}