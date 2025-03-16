'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface SalesProps {
  chartSeries: { name: string; data: number[] }[];
  costSeries?: { name: string; data: number[] };
  sx?: SxProps;
}

export function Sales({ chartSeries, costSeries, sx }: SalesProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  const combinedSeries = costSeries ? [...chartSeries, costSeries] : chartSeries;

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Atualizar
          </Button>
        }
        title="Análise de Vendas & Custos"
        subheader="Comparação mensal com indicadores-chave"
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={combinedSeries} type="bar" width="100%" />
        <Divider sx={{ my: 2 }} />
        <KpiBadges />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button color="inherit" size="small">
          Detalhes de Margens
        </Button>
        <Button color="inherit" endIcon={<ArrowRightIcon />} size="small">
          Simular Cenários
        </Button>
      </CardActions>
    </Card>
  );
}

function KpiBadges(): React.JSX.Element {
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
      <span style={{ backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
        🚀 Margem Média: 22%
      </span>
      <span style={{ backgroundColor: '#fff3e0', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
        ⚠️ Estoque Baixo: 5 Itens
      </span>
    </div>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: true },
      foreColor: theme.palette.text.secondary,
    },
    colors: [theme.palette.primary.main, theme.palette.error.main],
    dataLabels: { enabled: false },
    fill: { opacity: 0.9 },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { radius: 12 },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    stroke: { width: 2 },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisTicks: { show: false },
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      title: { text: 'Valor (R$)', style: { color: theme.palette.text.secondary } },
      labels: {
        formatter: (value) => `R$ ${value}K`,
        style: { colors: theme.palette.text.secondary },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 80,
          borderColor: theme.palette.success.main,
          label: {
            borderColor: theme.palette.success.main,
            style: { color: '#fff', background: theme.palette.success.main },
            text: 'Meta Mensal',
          },
        },
      ],
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (value) => `R$ ${value} mil`,
        title: { formatter: (seriesName) => `${seriesName}: ` },
      },
    },
  };
}
