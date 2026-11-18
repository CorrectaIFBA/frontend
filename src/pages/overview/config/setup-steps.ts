/* The order a new institution actually has to do things in. */
export const SETUP_STEPS = [
  {
    title: 'Cadastre servidores e docentes',
    description: 'Cada pessoa recebe um e-mail para ativar a conta e criar a senha.',
    to: '/faculty',
  },
  {
    title: 'Acompanhe as turmas',
    description: 'Docentes criam as turmas e convidam os estudantes.',
    to: '/classes',
  },
  {
    title: 'Matricule os estudantes',
    description: 'Estudantes entram nas turmas e passam a ver as listas publicadas.',
    to: '/students',
  },
  {
    title: 'Monte o banco de problemas',
    description: 'Enunciados com casos de teste, prontos para correção automática.',
    to: '/problems',
  },
]
