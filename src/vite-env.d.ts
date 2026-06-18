/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_URL?: string
  readonly VITE_DEMO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// CSS-only font packages (side-effect imports, no type declarations)
declare module '@fontsource-variable/inter'
declare module '@fontsource-variable/sora'
