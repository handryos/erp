'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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

import CurrencyInput from '@/components/core/currency-input';

type Regime = 'Simples' | 'Lucro Real' | 'Lucro Presumido';

interface CompanyFormData {
  nome: string;
  cnpj: string;
  regimeTributacao: Regime;
  faturamentoMensal: number;
}

interface DespesasState {
  icms: number;
  iss: number;
  pis: number;
  cofins: number;
  irpj: number;
  irpjAdicional: number;
  csll: number;
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
    icms: 0,
    iss: 0,
    pis: 0,
    cofins: 0,
    irpj: 0,
    irpjAdicional: 0,
    csll: 0,
  });

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

  // Despesas Operacionais fixas (Despesas Administrativas)
  const totalDespesasOperacionais = 1000;
  const totalDespesas = totalDespesasOperacionais + despesasImpostos;
  const relacaoDespesas = calcularPercentual(totalDespesas);
  const resultadoLiquido = faturamentoMensal - totalDespesas;

  // Cálculos para o regime "Lucro Presumido"
  const presuncaoLucro = React.useMemo(() => {
    return regimeTributacao === 'Lucro Presumido' ? faturamentoMensal * 0.08 : 0;
  }, [faturamentoMensal, regimeTributacao]);

  const irpjPresumido = React.useMemo(() => {
    return presuncaoLucro * 0.15;
  }, [presuncaoLucro]);

  // Determina se o IRPJ Adicional deve ser pago: se a presunção for maior que R$20.000,00
  const irpjAdicionalPagar = presuncaoLucro > 20000 ? 'Sim' : 'Não';

  // Função para renderizar os campos de imposto usando o componente CurrencyInput
  const renderCampoImposto = (label: string, campo: keyof DespesasState) => (
    <Grid item xs={12} md={4} key={campo}>
      <CurrencyInput
        label={label}
        value={despesas[campo]}
        onChange={(num) => setDespesas((prev) => ({ ...prev, [campo]: num }))}
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
                  <MenuItem value="Simples">Simples</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <CurrencyInput
                label="Faturamento Mensal"
                value={faturamentoMensal}
                onChange={(num) => setValue('faturamentoMensal', num)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {regimeTributacao !== 'Simples' && (
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Impostos" />
          <CardContent>
            <Grid container spacing={3}>
              {renderCampoImposto('ICMS', 'icms')}
              {renderCampoImposto('ISS', 'iss')}
              {renderCampoImposto('PIS', 'pis')}
              {renderCampoImposto('COFINS', 'cofins')}
              {renderCampoImposto('IRPJ', 'irpj')}
              {renderCampoImposto('IRPJ Adicional', 'irpjAdicional')}
              {renderCampoImposto('CSLL', 'csll')}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  Total Impostos:{' '}
                  {despesasImpostos.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
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
                    Presunção (8%):{' '}
                    {presuncaoLucro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <br />
                    IRPJ Calculado (15%):{' '}
                    {irpjPresumido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <br />
                    IRPJ Adicional a pagar: {irpjAdicionalPagar}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Resumo Financeiro" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Total Geral de Despesas:{' '}
                {totalDespesas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2">Relação Despesas/Faturamento: {relacaoDespesas.toFixed(2)}%</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Total de Despesas Operacionais:{' '}
                {totalDespesasOperacionais.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2">
                Porcentagem sobre Total Geral: {calcularPercentual(totalDespesasOperacionais).toFixed(2)}%
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Resultado Líquido:{' '}
                {resultadoLiquido.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2">
                Faturamento Mensal:{' '}
                {faturamentoMensal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
    </form>
  );
}
