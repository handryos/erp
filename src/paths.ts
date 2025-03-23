export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    customers: '/dashboard/customers',
    products: '/dashboard/products',
    expenses: '/dashboard/expenses',
    sales: '/dashboard/sales',
    company: '/dashboard/company',
    services: 'dashboard/ ',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
