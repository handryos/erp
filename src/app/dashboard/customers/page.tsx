'use client';

import * as React from 'react';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';

import { ColumnDef, MainGrid } from '@/components/dashboard/main-table/main-table';

const customers = [
  {
    id: 'USR-010',
    name: 'Carlos Silva',
    avatar: '',
    email: 'carlos.silva@exemplo.com',
    phone: '(11) 98765-4321',
    address: { city: 'São Paulo', country: 'Brasil', state: 'SP', street: 'Rua das Flores, 123' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-009',
    name: 'Ana Souza',
    avatar: '',
    email: 'ana.souza@exemplo.com',
    phone: '(21) 99876-5432',
    address: { city: 'Rio de Janeiro', country: 'Brasil', state: 'RJ', street: 'Avenida Brasil, 456' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-008',
    name: 'Fernando Oliveira',
    avatar: '',
    email: 'fernando.oliveira@exemplo.com',
    phone: '(31) 98765-1234',
    address: { city: 'Belo Horizonte', country: 'Brasil', state: 'MG', street: 'Rua das Palmeiras, 789' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-007',
    name: 'Patrícia Santos',
    avatar: '',
    email: 'patricia.santos@exemplo.com',
    phone: '(41) 99876-6543',
    address: { city: 'Curitiba', country: 'Brasil', state: 'PR', street: 'Rua das Araucárias, 321' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-006',
    name: 'Ricardo Almeida',
    avatar: '',
    email: 'ricardo.almeida@exemplo.com',
    phone: '(51) 98765-8765',
    address: { city: 'Porto Alegre', country: 'Brasil', state: 'RS', street: 'Avenida dos Estados, 654' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-005',
    name: 'Mariana Costa',
    avatar: '',
    email: 'mariana.costa@exemplo.com',
    phone: '(61) 99876-1234',
    address: { city: 'Brasília', country: 'Brasil', state: 'DF', street: 'Quadra 123, Conjunto 456' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-004',
    name: 'José Pereira',
    avatar: '',
    email: 'jose.pereira@exemplo.com',
    phone: '(71) 98765-5678',
    address: { city: 'Salvador', country: 'Brasil', state: 'BA', street: 'Rua das Praias, 987' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-003',
    name: 'Amanda Lima',
    avatar: '',
    email: 'amanda.lima@exemplo.com',
    phone: '(81) 99876-4321',
    address: { city: 'Recife', country: 'Brasil', state: 'PE', street: 'Avenida Boa Viagem, 654' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-002',
    name: 'Lucas Mendes',
    avatar: '',
    email: 'lucas.mendes@exemplo.com',
    phone: '(85) 98765-9876',
    address: { city: 'Fortaleza', country: 'Brasil', state: 'CE', street: 'Rua das Dunas, 321' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-001',
    name: 'Camila Rocha',
    avatar: '',
    email: 'camila.rocha@exemplo.com',
    phone: '(48) 99876-5678',
    address: { city: 'Florianópolis', country: 'Brasil', state: 'SC', street: 'Rua das Praias, 123' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Customer[];

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
}
const customerColumns: ColumnDef<Customer>[] = [
  {
    header: 'Nome',
    accessorKey: 'name',
    filterable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar src={row.avatar} />
        <Typography variant="subtitle2">{row.name}</Typography>
      </Stack>
    ),
  },
  {
    header: 'Email',
    accessorKey: 'email',
    filterable: true,
  },
  {
    header: 'Localização',
    accessorKey: 'address',
    renderCell: (row) => <Typography>{`${row.address.city}, ${row.address.state}`}</Typography>,
  },
  {
    header: 'Telefone',
    accessorKey: 'phone',
  },
  {
    header: 'Data de cadastro',
    accessorKey: 'createdAt',
    renderCell: (row) => <Typography>{dayjs(row.createdAt).format('MMM D, YYYY')}</Typography>,
  },
];

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Clientes</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Adicionar
          </Button>
        </div>
      </Stack>
      <MainGrid<Customer> rows={customers} columns={customerColumns} idKey="id" />
    </Stack>
  );
}
