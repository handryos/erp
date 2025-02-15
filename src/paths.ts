export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    customers: '/dashboard/customers',
    products: '/dashboard/products',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
