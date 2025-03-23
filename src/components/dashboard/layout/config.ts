import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Geral', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Clientes', href: paths.dashboard.customers, icon: 'users' },
  { key: 'products', title: 'Produtos', href: paths.dashboard.products, icon: 'product' },
  { key: 'expenses', title: 'Despesas', href: paths.dashboard.expenses, icon: 'expenses' },
  { key: 'sales', title: 'Vendas', href: paths.dashboard.sales, icon: 'sales' },
  { key: 'services', title: 'Serviços', href: paths.dashboard.sales, icon: 'services' },
  { key: 'company', title: 'Empresa', href: paths.dashboard.company, icon: 'company' },
] satisfies NavItemConfig[];
