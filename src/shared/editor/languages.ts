import type { ProgrammingLanguage } from '@/shared/api/assessments'

/* What the UI says about each language; kept apart from Monaco so it loads with the page. */

export const LANGUAGE_LABEL: Record<ProgrammingLanguage, string> = {
  C: 'C',
}

export const MONACO_LANGUAGE: Record<ProgrammingLanguage, string> = {
  C: 'c',
}

/** A starting point for an empty draft, so the student gets something that runs. */
export const STARTER_CODE: Record<ProgrammingLanguage, string> = {
  C: '#include <stdio.h>\n\nint main(void) {\n    \n    return 0;\n}\n',
}

/**
 * A starting point for a harness: declares the function the student writes and runs it on the
 * input. The draft then defines that function and leaves `main` to the harness.
 */
export const STARTER_HARNESS: Record<ProgrammingLanguage, string> = {
  C: '#include <stdio.h>\n\n/* Escrita pelo estudante. */\nint soma(int a, int b);\n\nint main(void) {\n    int a, b;\n    if (scanf("%d %d", &a, &b) != 2) return 1;\n    printf("%d\\n", soma(a, b));\n    return 0;\n}\n',
}
