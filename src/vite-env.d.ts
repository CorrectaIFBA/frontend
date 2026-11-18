/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_API_URL?: string
  readonly VITE_COHORT_API_URL?: string
  readonly VITE_ASSESSMENT_API_URL?: string
  readonly VITE_CODE_INTEL_API_URL?: string
  readonly VITE_WORKSPACE_API_URL?: string
  readonly VITE_EVALUATION_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
