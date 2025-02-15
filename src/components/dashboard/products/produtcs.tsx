'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export function ProductsForm(): React.JSX.Element {
  const [costPrice, setCostPrice] = React.useState<number | undefined>(undefined);
  const [profitMargin, setProfitMargin] = React.useState<number | undefined>(undefined);
  const [salePrice, setSalePrice] = React.useState<number | undefined>(undefined);
  const [taxes, setTaxes] = React.useState({
    icms: 0,
    pis: 0,
    cofins: 0,
    others: 0,
  });

  const totalTaxes = Object.values(taxes).reduce((acc, curr) => acc + curr, 0);
  const totalSalePrice = (salePrice || 0) + totalTaxes;

  React.useEffect(() => {
    if (costPrice !== undefined && profitMargin !== undefined) {
      const newSalePrice = costPrice * (1 + profitMargin / 100);
      setSalePrice(Number(newSalePrice.toFixed(2)));
    }
  }, [costPrice, profitMargin]);

  React.useEffect(() => {
    if (salePrice !== undefined && costPrice !== undefined) {
      const newMargin = ((salePrice - costPrice) / costPrice) * 100;
      setProfitMargin(Number(newMargin.toFixed(2)));
    }
  }, [salePrice, costPrice]);

  const handleTaxChange = (name: string, value: number) => {
    setTaxes(prev => ({
      ...prev,
      [name]: ((salePrice || 0) * value) / 100
    }));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Lógica de submissão do formulário
    }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Detalhes do Produto" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nome do Produto</InputLabel>
                <OutlinedInput label="Nome do Produto" name="productName" />
              </FormControl>
            </Grid>

            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Preço de Custo</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Preço de Custo"
                  value={costPrice ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCostPrice(value === '' ? undefined : Number(value));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Margem de Lucro (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Margem de Lucro (%)"
                  value={profitMargin ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfitMargin(value === '' ? undefined : Number(value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Preço de Venda</InputLabel>
                <OutlinedInput
                  type="number"
                  value={salePrice ?? ''}
                  label="Preço de Venda"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSalePrice(value === '' ? undefined : Number(value));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Impostos e Taxas" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>ICMS (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="ICMS (%)"
                  onChange={(e) => { handleTaxChange('icms', Number(e.target.value)); }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>PIS (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="PIS (%)"
                  onChange={(e) => { handleTaxChange('pis', Number(e.target.value)); }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>COFINS (%)</InputLabel>
                <OutlinedInput
                label="COFINS (%)"
                  type="number"
                  onChange={(e) => { handleTaxChange('cofins', Number(e.target.value)); }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>Outros (%)</InputLabel>
                <OutlinedInput
                label="Outros (%)"
                  type="number"
                  onChange={(e) => { handleTaxChange('others', Number(e.target.value)); }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Preço Final de Venda: R$ {totalSalePrice.toFixed(2)}
                <Typography variant="caption" display="block" color="text.secondary">
                  (Incluindo R$ {totalTaxes.toFixed(2)} de impostos)
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">Salvar Produto</Button>
      </CardActions>
    </form>
  );
}