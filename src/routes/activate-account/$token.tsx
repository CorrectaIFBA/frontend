import { createFileRoute, redirect } from '@tanstack/react-router'

/* The activation e-mail links here; the screen itself lives at /account-activation. */
export const Route = createFileRoute('/activate-account/$token')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/account-activation/$token',
      params: { token: params.token },
      replace: true,
    })
  },
})
