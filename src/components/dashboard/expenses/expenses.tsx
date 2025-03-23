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
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

interface DespesasState {
  agua: number;
  luz: number;
  internet: number;
  aluguel: number;
  folhaPagamento: number;
  proLabore: number;
  limpeza: number;
  outrasDespesasAdm: number;
  taxaCartaoDebito: number;
  taxaCartaoCredito: number;
  [key: string]: number;
}

function TaxasCartaoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (taxas: { debito: number; credito: number }) => void;
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

  const calcularTaxas = () => {
    const credito = ((values.faturamento * values.percentualCredito) / 100) * (values.taxaCredito / 100);
    const debito = ((values.faturamento * values.percentualDebito) / 100) * (values.taxaDebito / 100);
    return { credito, debito };
  };

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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(calcularTaxas())}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ExpensesForm() {
  const [despesas, setDespesas] = React.useState<DespesasState>({
    agua: 0,
    luz: 0,
    internet: 0,
    aluguel: 0,
    folhaPagamento: 0,
    proLabore: 0,
    limpeza: 0,
    outrasDespesasAdm: 0,
    taxaCartaoDebito: 0,
    taxaCartaoCredito: 0,
  });

  const [openTaxas, setOpenTaxas] = React.useState(false);

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
      despesas.taxaCartaoDebito +
      despesas.taxaCartaoCredito
    );
  }, [despesas]);

  const handleNumberInput = (value: string, field: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const numericValue = sanitized === '' ? 0 : Number(sanitized);
    setDespesas((prev) => ({ ...prev, [field]: numericValue }));
  };

  const renderCampoDespesa = (label: string, campo: keyof DespesasState) => (
    <Grid item xs={12} md={3} key={campo}>
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
    </Grid>
  );

  const displayLabels: { [key: string]: string } = {
    agua: 'Água',
    luz: 'Luz',
    internet: 'Internet',
    aluguel: 'Aluguel',
    folhaPagamento: 'Folha de Pagamento',
    proLabore: 'Pró-labore',
    limpeza: 'Limpeza',
    outrasDespesasAdm: 'Outras Despesas Adm',
    taxaCartaoDebito: 'Taxa Cartão Débito',
    taxaCartaoCredito: 'Taxa Cartão Crédito',
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert('Formulário enviado!');
      }}
    >
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

            <Grid item xs={12}>
              <Typography variant="subtitle1" align="left">
                Taxas do Cartão
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Taxa Cartão Débito"
                value={despesas.taxaCartaoDebito || ''}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Taxa Cartão Crédito"
                value={despesas.taxaCartaoCredito || ''}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} md={5.9}>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => setOpenTaxas(true)}>
              Calcular Taxas
            </Button>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                Total Despesas Operacionais: R$ {totalDespesasOperacionais.toLocaleString('pt-BR')}
              </Typography>
            </Grid>

            {totalDespesasOperacionais > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Composição das Despesas:
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(despesas).map(([key, value]) => {
                    if (value <= 0) return null;
                    const percentual = (value / totalDespesasOperacionais) * 100;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Typography variant="body2">
                          <strong>{displayLabels[key] || key}:</strong> R$ {value.toLocaleString('pt-BR')} (
                          {percentual.toFixed(2)}%)
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
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
        onSave={(taxas) => {
          setDespesas((prev) => ({
            ...prev,
            taxaCartaoDebito: taxas.debito,
            taxaCartaoCredito: taxas.credito,
          }));
          setOpenTaxas(false);
        }}
      />
    </form>
  );
}
