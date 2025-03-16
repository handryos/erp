'use client';

import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Pencil as EditIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  filterable?: boolean;
  renderCell?: (row: T) => React.ReactNode;
}

interface MainGridProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  idKey: keyof T;
}

export function MainGrid<T extends { [key: string]: any }>({
  rows: initialRows,
  columns,
  idKey,
}: MainGridProps<T>): React.JSX.Element {
  const [rows, setRows] = React.useState(initialRows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<T | null>(null);

  const filteredRows = rows.filter((row) =>
    columns.every((column) => {
      if (!column.filterable || !filters[column.accessorKey]) return true;
      const value = row[column.accessorKey];
      return value?.toString().toLowerCase().includes(filters[column.accessorKey].toLowerCase());
    })
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFilterChange = (accessorKey: keyof T, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [accessorKey]: value,
    }));
    setPage(0);
  };

  const handleDelete = async (rowId: any) => {
    try {
      await api.delete(`/${rowId}`);
      setRows((prevRows) => prevRows.filter((row) => row[idKey] !== rowId));
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const handleEdit = (row: T) => {
    setEditRow(row);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editRow) {
      try {
        await api.put(`/${editRow[idKey]}`, editRow);
        setRows((prevRows) => prevRows.map((row) => (row[idKey] === editRow[idKey] ? editRow : row)));
        setEditDialogOpen(false);
      } catch (error) {
        console.error('Erro ao editar item:', error);
      }
    }
  };

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          {columns.map(
            (column) =>
              column.filterable && (
                <TextField
                  key={column.accessorKey as string}
                  label={`Filtrar por ${column.header}`}
                  variant="outlined"
                  size="small"
                  value={filters[column.accessorKey] || ''}
                  onChange={(e) => handleFilterChange(column.accessorKey, e.target.value)}
                />
              )
          )}
        </Stack>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell key={'actions'}>Ações</TableCell>
              {columns.map((column) => (
                <TableCell key={column.accessorKey as string}>{column.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              return (
                <TableRow hover key={row[idKey]}>
                  <TableCell key={'column-actions'}>
                    <Stack direction={'row'} gap={1}>
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon size={18} color="blue" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row[idKey])}>
                        <TrashIcon size={18} color="red" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey as string}>
                      {column.renderCell ? column.renderCell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Modal de Edição */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Item</DialogTitle>
        <DialogContent>
          {editRow &&
            columns.map(
              (column) =>
                column.accessorKey !== idKey && (
                  <TextField
                    key={column.accessorKey as string}
                    label={column.header}
                    fullWidth
                    margin="dense"
                    value={editRow[column.accessorKey] || ''}
                    onChange={(e) =>
                      setEditRow((prev) => (prev ? { ...prev, [column.accessorKey]: e.target.value } : prev))
                    }
                  />
                )
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
