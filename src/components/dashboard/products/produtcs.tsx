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
  const [salePrice, setSalePrice] = React.useState<number | undefined>(undefined);
  const [taxes, setTaxes] = React.useState({
    icms: 0,
    pis: 0,
    cofins: 0,
    others: 0,
  });
  const [image, setImage] = React.useState<string | null>(null);

  // Despesa Administrativa fixa (conforme o exemplo)
  const despesaAdm = 93.19;

  // Cálculo do Custo Total
  const custoTotal = (costPrice || 0) + (frete || 0) + (outrasDespesas || 0);

  // Cálculo do Preço Mínimo de Venda
  const markupMultiplicador = 2.8; // Markup fixo conforme o exemplo
  const precoMinimoVenda = custoTotal * markupMultiplicador;

  // Cálculo do Preço de Venda com base na margem de lucro
  const calcularPrecoVenda = () => {
    if (costPrice !== undefined && profitMargin !== undefined) {
      const newSalePrice = custoTotal * (1 + profitMargin / 100);
      setSalePrice(Number(newSalePrice.toFixed(2)));
    }
  };

  // Cálculo da Margem de Lucro com base no preço de venda
  const calcularMargemLucro = () => {
    if (salePrice !== undefined && custoTotal !== undefined) {
      const newMargin = ((salePrice - custoTotal) / custoTotal) * 100;
      setProfitMargin(Number(newMargin.toFixed(2)));
    }
  };

  // Atualiza o preço de venda quando o custo ou a margem mudam
  React.useEffect(() => {
    calcularPrecoVenda();
  }, [costPrice, profitMargin, custoTotal]);

  // Atualiza a margem de lucro quando o preço de venda muda
  React.useEffect(() => {
    calcularMargemLucro();
  }, [salePrice, custoTotal]);

  const handleTaxChange = (name: string, value: number) => {
    setTaxes((prev) => ({
      ...prev,
      [name]: ((salePrice || 0) * value) / 100,
    }));
  };

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
  const totalTaxes = Object.values(taxes).reduce((acc, curr) => acc + curr, 0);
  const totalSalePrice = (salePrice || 0) + totalTaxes;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Lógica de submissão do formulário
      }}
    >
      {/* Card: Detalhes do Produto */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Detalhes do Produto" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Nome do Produto */}
            <Grid xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nome do Produto</InputLabel>
                <OutlinedInput label="Nome do Produto" name="productName" />
              </FormControl>
            </Grid>

            {/* Imagem do Produto */}
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

            {/* Peso */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Peso (kg)</InputLabel>
                <OutlinedInput type="number" label="Peso (kg)" />
              </FormControl>
            </Grid>

            {/* Dimensões */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dimensões (cm)</InputLabel>
                <OutlinedInput label="Dimensões (cm)" placeholder="Largura x Altura x Profundidade" />
              </FormControl>
            </Grid>

            {/* Categoria */}
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

            {/* Marca */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Marca</InputLabel>
                <OutlinedInput label="Marca" />
              </FormControl>
            </Grid>

            {/* Fornecedor */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Fornecedor</InputLabel>
                <Select label="Fornecedor">
                  <MenuItem value="fornecedor1">Fornecedor 1</MenuItem>
                  <MenuItem value="fornecedor2">Fornecedor 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Coleção */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Coleção</InputLabel>
                <OutlinedInput label="Coleção" />
              </FormControl>
            </Grid>

            {/* Unidade */}
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

            {/* Quantidade em Estoque */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quantidade em Estoque</InputLabel>
                <OutlinedInput type="number" label="Quantidade em Estoque" />
              </FormControl>
            </Grid>

            {/* Código de Barras */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Código de Barras</InputLabel>
                <OutlinedInput label="Código de Barras" />
              </FormControl>
            </Grid>

            {/* SKU */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>SKU</InputLabel>
                <OutlinedInput label="SKU" />
              </FormControl>
            </Grid>

            {/* Grade */}
            <Grid xs={6}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <OutlinedInput label="Grade" placeholder="Ex: Tamanho, Cor, etc." />
              </FormControl>
            </Grid>

            {/* Observações */}
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Observações</InputLabel>
                <OutlinedInput label="Observações" multiline rows={4} />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Card: Precificação */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Precificação" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Custo de Aquisição */}
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

            {/* Frete */}
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

            {/* Outras Despesas */}
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

            {/* Margem de Lucro */}
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

            {/* Preço de Venda */}
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

            {/* Preço Mínimo de Venda */}
            <Grid xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Preço Mínimo de Venda: R$ {precoMinimoVenda.toFixed(2)}
                <Typography variant="caption" display="block" color="text.secondary">
                  (Custo Total: R$ {custoTotal.toFixed(2)}, Markup: {markupMultiplicador})
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Card: Dados Fiscais */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Dados Fiscais" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* NCM */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>NCM</InputLabel>
                <OutlinedInput label="NCM" />
              </FormControl>
            </Grid>

            {/* CEST */}
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>CEST</InputLabel>
                <OutlinedInput label="CEST" />
              </FormControl>
            </Grid>

            {/* ICMS Retido */}
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

            {/* PIS */}
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

            {/* COFINS */}
            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>COFINS (%)</InputLabel>
                <OutlinedInput
                  label="COFINS (%)"
                  type="number"
                  onChange={(e) => {
                    handleTaxChange('cofins', Number(e.target.value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            {/* Outros Impostos */}
            <Grid md={3} xs={6}>
              <FormControl fullWidth>
                <InputLabel>Outros (%)</InputLabel>
                <OutlinedInput
                  label="Outros (%)"
                  type="number"
                  onChange={(e) => {
                    handleTaxChange('others', Number(e.target.value));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            {/* Preço Final de Venda */}
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

      {/* Botão de Submissão */}
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Salvar Produto
        </Button>
      </CardActions>
    </form>
  );
}
