import { Cube } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { CashRegister as Sales } from '@phosphor-icons/react/dist/ssr/CashRegister';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Invoice as Expenses } from '@phosphor-icons/react/dist/ssr/Invoice';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  product: Cube,
  user: UserIcon,
  users: UsersIcon,
  expenses: Expenses,
  sales: Sales,
} as Record<string, Icon>;
