'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';

type Regime = 'Simples' | 'Lucro Real' | 'Lucro Presumido';

interface CompanyFormData {
  nome: string;
  cnpj: string;
  regimeTributacao: Regime;
  faturamentoMensal: number;
}

interface DespesasState {
  agua: number;
  luz: number;
  internet: number;
  aluguel: number;
  folhaPagamento: number;
  proLabore: number;
  limpeza: number;
  outrasDespesasAdm: number;
  taxasCartao: number;
  icms: number;
  iss: number;
  pis: number;
  cofins: number;
  irpj: number;
  irpjAdicional: number;
  csll: number;
  [key: string]: number;
}

function TaxasCartaoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (taxas: number) => void;
}) {
  const [values, setValues] = React.useState({
    faturamento: 0,
    percentualCredito: 0,
    taxaCredito: 0,
    percentualDebito: 0,
    taxaDebito: 0,
  });

  const handleNumberInput = (value: string, field: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const numericValue = sanitized === '' ? 0 : Number(sanitized);
    setValues((prev) => ({ ...prev, [field]: numericValue }));
  };

  const custoEstimado = React.useMemo(() => {
    const credito = ((values.faturamento * values.percentualCredito) / 100) * (values.taxaCredito / 100);
    const debito = ((values.faturamento * values.percentualDebito) / 100) * (values.taxaDebito / 100);
    return credito + debito;
  }, [values]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Taxas de Cartão</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Faturamento Estimado"
              value={values.faturamento || ''}
              onChange={(e) => handleNumberInput(e.target.value, 'faturamento')}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                inputMode: 'numeric',
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="subtitle1">Taxas de Crédito</Typography>
            </Divider>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="% de Vendas no Crédito"
              value={values.percentualCredito || ''}
              onChange={(e) => handleNumberInput(e.target.value, 'percentualCredito')}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputMode: 'numeric',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Taxa de Crédito"
              value={values.taxaCredito || ''}
              onChange={(e) => handleNumberInput(e.target.value, 'taxaCredito')}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputMode: 'numeric',
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="subtitle1">Taxas de Débito</Typography>
            </Divider>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="% de Vendas no Débito"
              value={values.percentualDebito || ''}
              onChange={(e) => handleNumberInput(e.target.value, 'percentualDebito')}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputMode: 'numeric',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Taxa de Débito"
              value={values.taxaDebito || ''}
              onChange={(e) => handleNumberInput(e.target.value, 'taxaDebito')}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputMode: 'numeric',
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Custo Total Estimado: R$ {custoEstimado.toLocaleString('pt-BR')}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(custoEstimado)}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
export default function CompanyFullForm() {
  const { register, handleSubmit, watch, setValue } = useForm<CompanyFormData>({
    defaultValues: {
      nome: '',
      cnpj: '',
      regimeTributacao: 'Lucro Real',
      faturamentoMensal: 0,
    },
  });

  const regimeTributacao = watch('regimeTributacao');
  const faturamentoMensal = watch('faturamentoMensal');
  const [despesas, setDespesas] = React.useState<DespesasState>({
    agua: 0,
    luz: 0,
    internet: 0,
    aluguel: 0,
    folhaPagamento: 0,
    proLabore: 0,
    limpeza: 0,
    outrasDespesasAdm: 0,
    taxasCartao: 0,
    icms: 0,
    iss: 0,
    pis: 0,
    cofins: 0,
    irpj: 0,
    irpjAdicional: 0,
    csll: 0,
  });
  const [openTaxas, setOpenTaxas] = React.useState(false);

  const calcularPercentual = (valor: number) => {
    return faturamentoMensal > 0 ? (valor / faturamentoMensal) * 100 : 0;
  };

  const despesasImpostos = React.useMemo(() => {
    return (
      despesas.icms +
      despesas.iss +
      despesas.pis +
      despesas.cofins +
      despesas.irpj +
      despesas.irpjAdicional +
      despesas.csll
    );
  }, [despesas]);

  const totalDespesasOperacionais = React.useMemo(() => {
    return (
      despesas.agua +
      despesas.luz +
      despesas.internet +
      despesas.aluguel +
      despesas.folhaPagamento +
      despesas.proLabore +
      despesas.limpeza +
      despesas.outrasDespesasAdm +
      despesas.taxasCartao
    );
  }, [despesas]);

  const totalDespesas = totalDespesasOperacionais + despesasImpostos;

  const relacaoDespesas = calcularPercentual(totalDespesas);
  const resultadoLiquido = faturamentoMensal - totalDespesas;

  const presuncaoLucro = React.useMemo(() => {
    return regimeTributacao === 'Lucro Presumido' ? faturamentoMensal * 0.08 : 0;
  }, [faturamentoMensal, regimeTributacao]);

  const irpjPresumido = React.useMemo(() => {
    return presuncaoLucro * 0.15;
  }, [presuncaoLucro]);

  const handleNumberInput = (value: string, field: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const numericValue = sanitized === '' ? 0 : Number(sanitized);
    setDespesas((prev) => ({ ...prev, [field]: numericValue }));
  };

  const renderCampoDespesa = (label: string, campo: keyof DespesasState) => (
    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        label={label}
        value={despesas[campo] || ''}
        onChange={(e) => handleNumberInput(e.target.value, String(campo))}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          inputMode: 'numeric',
        }}
      />
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        {calcularPercentual(despesas[campo]).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </Typography>
    </Grid>
  );

  return (
    <form onSubmit={handleSubmit(() => alert('Formulário enviado!'))}>
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Dados Gerais" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Nome da Empresa" {...register('nome')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="CNPJ" {...register('cnpj')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Regime Tributário</InputLabel>
                <Select label="Regime Tributário" value={regimeTributacao} {...register('regimeTributacao')}>
                  <MenuItem value="Lucro Real">Lucro Real</MenuItem>
                  <MenuItem value="Lucro Presumido">Lucro Presumido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Faturamento Mensal"
                value={faturamentoMensal || ''}
                onChange={(e) => setValue('faturamentoMensal', Number(e.target.value.replace(/[^0-9]/g, '')))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  inputMode: 'numeric',
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Despesas Operacionais" />
        <CardContent>
          <Grid container spacing={3}>
            {renderCampoDespesa('Água', 'agua')}
            {renderCampoDespesa('Luz', 'luz')}
            {renderCampoDespesa('Internet', 'internet')}
            {renderCampoDespesa('Aluguel', 'aluguel')}
            {renderCampoDespesa('Folha de Pagamento', 'folhaPagamento')}
            {renderCampoDespesa('Pró-labore', 'proLabore')}
            {renderCampoDespesa('Limpeza', 'limpeza')}
            {renderCampoDespesa('Outras Despesas Adm', 'outrasDespesasAdm')}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Taxas de Cartão"
                value={despesas.taxasCartao || ''}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
              <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => setOpenTaxas(true)}>
                Calcular Taxas
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                Total Despesas Operacionais: R$ {totalDespesasOperacionais.toLocaleString('pt-BR')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Impostos" />
        <CardContent>
          <Grid container spacing={3}>
            {renderCampoDespesa('ICMS', 'icms')}
            {renderCampoDespesa('ISS', 'iss')}
            {renderCampoDespesa('PIS', 'pis')}
            {renderCampoDespesa('COFINS', 'cofins')}
            {renderCampoDespesa('IRPJ', 'irpj')}
            {renderCampoDespesa('IRPJ Adicional', 'irpjAdicional')}
            {renderCampoDespesa('CSLL', 'csll')}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Total Impostos: R$ {despesasImpostos.toLocaleString('pt-BR')}</Typography>
              <Typography variant="body2">
                {regimeTributacao === 'Lucro Presumido'
                  ? 'Despesas com Impostos (Presumido)'
                  : 'Despesas com Impostos (Real)'}
                : {calcularPercentual(despesasImpostos).toFixed(2)}%
              </Typography>
            </Grid>

            {regimeTributacao === 'Lucro Presumido' && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  Presunção de Lucro (8%): R$ {presuncaoLucro.toLocaleString('pt-BR')}
                  <br />
                  IRPJ Calculado (15%): R$ {irpjPresumido.toLocaleString('pt-BR')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Resumo Financeiro" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Total Geral de Despesas: R$ {totalDespesas.toLocaleString('pt-BR')}</Typography>
              <Typography variant="body2">Relação Despesas/Faturamento: {relacaoDespesas.toFixed(2)}%</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">Resultado Líquido: R$ {resultadoLiquido.toLocaleString('pt-BR')}</Typography>
              <Typography variant="body2">
                Faturamento Mensal: R$ {faturamentoMensal.toLocaleString('pt-BR')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button type="submit" variant="contained" size="large">
          Salvar
        </Button>
      </CardActions>

      <TaxasCartaoModal
        open={openTaxas}
        onClose={() => setOpenTaxas(false)}
        onSave={(valor) => {
          setDespesas((prev) => ({ ...prev, taxasCartao: valor })), setOpenTaxas(false);
        }}
      />
    </form>
  );
}
