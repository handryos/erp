'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

export function ProductsForm(): React.JSX.Element {
  const [costPrice, setCostPrice] = React.useState<number | undefined>(undefined);
  const [frete, setFrete] = React.useState<number | undefined>(undefined);
  const [outrasDespesas, setOutrasDespesas] = React.useState<number | undefined>(undefined);
  const [profitMargin, setProfitMargin] = React.useState<number | undefined>(undefined);

  const despesaAdmPercent = 44.33;

  const [taxes, setTaxes] = React.useState({
    icms: 0,
    pis: 0,
    cofins: 0,
    others: 0,
  });

  const [image, setImage] = React.useState<string | null>(null);

  const custoTotal = (costPrice || 0) + (frete || 0) + (outrasDespesas || 0);

  const marginFraction = parseFloat(((profitMargin || 0) / 100).toFixed(9));
  const admFraction = parseFloat((despesaAdmPercent / 100).toFixed(9));

  const somaMarginAdm = Number(Number((marginFraction + admFraction).toFixed(9))).toFixed(9);

  const fractionCustoNoPreco = Number(Number((1 - Number(somaMarginAdm)).toFixed(9)).toFixed(9));

  let precoVendaCalculado = 0;
  if (fractionCustoNoPreco > 0) {
    const rawPrice = custoTotal / fractionCustoNoPreco;
    precoVendaCalculado = parseFloat(rawPrice.toFixed(9));
  }

  console.log(custoTotal, fractionCustoNoPreco);

  let valorMargem = parseFloat((precoVendaCalculado * marginFraction).toFixed(9));
  let valorDespesaAdm = parseFloat((precoVendaCalculado - custoTotal - valorMargem).toFixed(9));

  let markupMultiplicador = 0;
  if (custoTotal > 0) {
    markupMultiplicador = parseFloat((precoVendaCalculado / custoTotal).toFixed(9));
  }

  const precoMinimoVenda = precoVendaCalculado;

  const handleTaxChange = (name: string, value: number) => {
    setTaxes((prev) => ({
      ...prev,
      [name]: parseFloat(((precoVendaCalculado * value) / 100).toFixed(9)),
    }));
  };

  const totalTaxes = Object.values(taxes).reduce((acc, curr) => acc + curr, 0);
  const totalSalePrice = precoVendaCalculado + totalTaxes;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const custoPercent = precoMinimoVenda > 0 ? (custoTotal / precoMinimoVenda) * 100 : 0;
  const margemPercent = precoMinimoVenda > 0 ? (valorMargem / precoMinimoVenda) * 100 : 0;
  const despesaAdmPercentCalculated = precoMinimoVenda > 0 ? (valorDespesaAdm / precoMinimoVenda) * 100 : 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
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
            <Grid xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-image"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="upload-image">
                  <IconButton component="span">
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'action.active',
                        cursor: 'pointer',
                      }}
                      src={image || undefined}
                    />
                  </IconButton>
                </label>
                <Typography variant="body2" color="text.secondary">
                  Clique para adicionar uma foto
                </Typography>
              </Box>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Peso (kg)</InputLabel>
                <OutlinedInput type="number" label="Peso (kg)" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dimensões (cm)</InputLabel>
                <OutlinedInput label="Dimensões (cm)" placeholder="Largura x Altura x Profundidade" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select label="Categoria">
                  <MenuItem value="eletronicos">Eletrônicos</MenuItem>
                  <MenuItem value="vestuario">Vestuário</MenuItem>
                  <MenuItem value="alimentos">Alimentos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Marca</InputLabel>
                <OutlinedInput label="Marca" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Fornecedor</InputLabel>
                <Select label="Fornecedor">
                  <MenuItem value="fornecedor1">Fornecedor 1</MenuItem>
                  <MenuItem value="fornecedor2">Fornecedor 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Coleção</InputLabel>
                <OutlinedInput label="Coleção" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Unidade</InputLabel>
                <Select label="Unidade">
                  <MenuItem value="Un">Un</MenuItem>
                  <MenuItem value="Kg">Kg</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="cx">Cx</MenuItem>
                  <MenuItem value="pct">Pct</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quantidade em Estoque</InputLabel>
                <OutlinedInput type="number" label="Quantidade em Estoque" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Código de Barras</InputLabel>
                <OutlinedInput label="Código de Barras" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>SKU</InputLabel>
                <OutlinedInput label="SKU" />
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <OutlinedInput label="Grade" placeholder="Ex: Tamanho, Cor, etc." />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Observações</InputLabel>
                <OutlinedInput label="Observações" multiline rows={4} />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Precificação" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Custo de Aquisição</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Custo de Aquisição"
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
                <InputLabel>Frete</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Frete"
                  value={frete ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFrete(value === '' ? undefined : Number(value));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Outras Despesas</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Outras Despesas"
                  value={outrasDespesas ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOutrasDespesas(value === '' ? undefined : Number(value));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid mt={2} container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
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
          </Grid>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Despesa Administrativa (fixa): {despesaAdmPercent.toFixed(2)}%
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Preço Mínimo de Venda: R$ {precoMinimoVenda.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            - Custo Total: R$ {custoTotal.toFixed(2)} ({custoPercent.toFixed(2)}%)
            <br />- Margem: R$ {valorMargem.toFixed(2)} ({margemPercent.toFixed(2)}%)
            <br />- Despesas Administrativas: R$ {valorDespesaAdm.toFixed(2)} ({despesaAdmPercentCalculated.toFixed(2)}
            %)
            <br />- Total dos Componentes: R$ {precoMinimoVenda.toFixed(2)} (100.00%)
            <br />- Markup multiplicador: {markupMultiplicador.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Dados Fiscais" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>ICMS Retido (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="ICMS Retido (%)"
                  onChange={(e) => {
                    handleTaxChange('icms', Number(e.target.value));
                  }}
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
                  onChange={(e) => {
                    handleTaxChange('pis', Number(e.target.value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>COFINS (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="COFINS (%)"
                  onChange={(e) => {
                    handleTaxChange('cofins', Number(e.target.value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>Outros (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Outros (%)"
                  onChange={(e) => {
                    handleTaxChange('others', Number(e.target.value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Preço Final de Venda: R$ {totalSalePrice.toFixed(2)}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                (Incluindo R$ {totalTaxes.toFixed(2)} de impostos)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Salvar Produto
        </Button>
      </CardActions>
    </form>
  );
}
