'use client';

import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  productName: yup.string().required('Este campo é campo obrigatório'),
  mark: yup.string().required('Este campo é campo obrigatório'),
  supplier: yup.string().required('Este campo é campo obrigatório'),
  unity: yup.string().required('Este campo é campo obrigatório'),
  quantity: yup
    .number()
    .typeError('Este campo é campo obrigatório')
    .required('Este campo é campo obrigatório')
    .min(1, 'Este campo não pode ser negativo'),
  costPrice: yup
    .number()
    .typeError('Este campo é campo obrigatório')
    .required('Este campo é campo obrigatório')
    .min(0.01, 'Este campo não pode ser negativo'),
  freigth: yup.number().typeError('Este campo é campo obrigatório').min(0, 'Este campo é campo obrigatório').optional(),
  anotherExpenses: yup
    .number()
    .typeError('Este campo é campo obrigatório')
    .min(0, 'Esse campo não pode ser negativo')
    .optional(),
  profitMargin: yup
    .number()
    .typeError('Este campo é campo obrigatório')
    .min(0, 'Esse campo não pode ser negativo')
    .optional(),
});

type ProductFormFields = {
  productName: string;
  mark: string;
  supplier: string;
  unity: string;
  costPrice: number;
  freigth?: number;
  anotherExpenses?: number;
  profitMargin?: number;
  quantity: number;
};

export function ProductsForm(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormFields>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      productName: '',
      mark: '',
      supplier: '',
      unity: '',
      costPrice: 0,
      freigth: 0,
      anotherExpenses: 0,
      profitMargin: 0,
      quantity: 1,
    },
  });

  const [costPrice, setCostPrice] = React.useState<number | undefined>(undefined);
  const [freigth, setFrete] = React.useState<number | undefined>(undefined);
  const [anotherExpenses, setAnotherExpenses] = React.useState<number | undefined>(undefined);
  const [profitMargin, setProfitMargin] = React.useState<number | undefined>(undefined);
  const [taxes, setTaxes] = React.useState({ icms: 0, pis: 0, cofins: 0, others: 0 });
  const [image, setImage] = React.useState<string | null>(null);

  const despesaAdmPercent = 44.33;
  const custoTotal = (costPrice || 0) + (freigth || 0) + (anotherExpenses || 0);
  const marginFraction = parseFloat(((profitMargin || 0) / 100).toFixed(9));
  const admFraction = parseFloat((despesaAdmPercent / 100).toFixed(9));
  const somaMarginAdm = Number((marginFraction + admFraction).toFixed(9));
  const fractionCustoNoPreco = Number((1 - somaMarginAdm).toFixed(9));
  let precoVendaCalculado = 0;
  if (fractionCustoNoPreco > 0) {
    const rawPrice = custoTotal / fractionCustoNoPreco;
    precoVendaCalculado = parseFloat(rawPrice.toFixed(9));
  }
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

  const onSubmit = (data: ProductFormFields) => {
    alert('Produto salvo com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Detalhes do Produto" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <FormControl required fullWidth error={!!errors.productName}>
                <InputLabel required>Nome do Produto</InputLabel>
                <OutlinedInput required label="Nome do Produto" {...register('productName')} />
                {errors.productName && (
                  <Typography variant="caption" color="error">
                    {errors.productName.message}
                  </Typography>
                )}
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
                      sx={{ width: 100, height: 100, bgcolor: 'action.active', cursor: 'pointer' }}
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
              <FormControl fullWidth error={!!errors.mark}>
                <InputLabel>Marca</InputLabel>
                <OutlinedInput label="Marca" {...register('mark')} />
                {errors.mark && (
                  <Typography variant="caption" color="error">
                    {errors.mark.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl required fullWidth error={!!errors.supplier}>
                <InputLabel>Fornecedor</InputLabel>
                <Select required label="Fornecedor" {...register('supplier')}>
                  <MenuItem value="fornecedor1">supplier 1</MenuItem>
                  <MenuItem value="fornecedor2">supplier 2</MenuItem>
                </Select>
                {errors.supplier && (
                  <Typography variant="caption" color="error">
                    {errors.supplier.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Coleção</InputLabel>
                <OutlinedInput label="Coleção" />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth error={!!errors.unity}>
                <InputLabel>Unidade</InputLabel>
                <Select label="Unidade" {...register('unity')}>
                  <MenuItem value="Un">Un</MenuItem>
                  <MenuItem value="Kg">Kg</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="cx">Cx</MenuItem>
                  <MenuItem value="pct">Pct</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
                {errors.unity && (
                  <Typography variant="caption" color="error">
                    {errors.unity.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth error={!!errors.quantity}>
                <InputLabel>Quantidade em Estoque</InputLabel>
                <OutlinedInput {...register('quantity')} type="number" label="Quantidade em Estoque" />
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
              <FormControl fullWidth error={!!errors.costPrice}>
                <InputLabel>Custo de Aquisição</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Custo de Aquisição"
                  {...register('costPrice')}
                  value={costPrice ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCostPrice(val === '' ? undefined : Number(val));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
                {errors.costPrice && (
                  <Typography variant="caption" color="error">
                    {errors.costPrice.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth error={!!errors.freigth}>
                <InputLabel>Frete</InputLabel>
                <OutlinedInput
                  type="number"
                  label="freigth"
                  {...register('freigth')}
                  value={freigth ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFrete(val === '' ? undefined : Number(val));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
                {errors.freigth && (
                  <Typography variant="caption" color="error">
                    {errors.freigth.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth error={!!errors.anotherExpenses}>
                <InputLabel>Outras Despesas</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Outras Despesas"
                  {...register('anotherExpenses')}
                  value={anotherExpenses ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnotherExpenses(val === '' ? undefined : Number(val));
                  }}
                  startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                />
                {errors.anotherExpenses && (
                  <Typography variant="caption" color="error">
                    {errors.anotherExpenses.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid mt={2} container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth error={!!errors.profitMargin}>
                <InputLabel>Margem de Lucro (%)</InputLabel>
                <OutlinedInput
                  type="number"
                  label="Margem de Lucro (%)"
                  {...register('profitMargin')}
                  value={profitMargin ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfitMargin(val === '' ? undefined : Number(val));
                  }}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
                {errors.profitMargin && (
                  <Typography variant="caption" color="error">
                    {errors.profitMargin.message}
                  </Typography>
                )}
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
