import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { ProductsForm } from '@/components/dashboard/products/produtcs';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Produtos</Typography>
      </div>
      <Grid container spacing={3}>
  
        <Grid xs={12}>
          <ProductsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
