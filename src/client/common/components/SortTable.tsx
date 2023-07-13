import * as React from 'react';
import { CircularProgress, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useDebouncedCallback } from 'use-debounce';

export type Order = 'asc' | 'desc';

export interface HeadCell<T> {
  /**
   * Use this if you don't need sorting
   */
  id?: string;
  /**
   * Use this for a sortable cell
   */
  typeId?: keyof T;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
  sortable?: boolean;
}

interface EnhancedTableProps<T> {
  headCells: HeadCell<T>[];
  order: Order;
  orderBy: keyof T;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
}

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const { headCells, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id?.toString() || headCell.typeId?.toString()}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.typeId ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.typeId}
              direction={orderBy === headCell.typeId ? order : 'asc'}
              onClick={headCell.typeId && createSortHandler(headCell.typeId)}
              disabled={!headCell.sortable}
            >
              {headCell.label}
              {orderBy === headCell.typeId ? (
                <Box
                  component="span"
                  sx={{
                    border: 0,
                    clip: 'rect(0 0 0 0)',
                    height: '1px',
                    margin: -1,
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    width: '1px',
                  }}
                >
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface SortTableProps<T> {
  data: T[];
  total: number;
  headCells: HeadCell<T>[];
  initialOrderBy: keyof T;
  loading?: boolean;
  Actions?: React.ReactNode;
  onPagePropsChange: (
    page: number,
    rowsPerPage: number,
    order: Order,
    orderBy: keyof T,
    searchText: string,
  ) => Promise<void>;
  children: (item: T) => React.ReactNode;
}

const initialOrder = 'asc';
const initialRowsPerPage = 20;
const initialPage = 0;

export default function SortTable<T>({
  data,
  total,
  headCells,
  initialOrderBy,
  loading,
  Actions,
  onPagePropsChange,
  children,
}: SortTableProps<T>) {
  const [order, setOrder] = React.useState<Order>(initialOrder);
  const [orderBy, setOrderBy] = React.useState<keyof T>(initialOrderBy);
  const [page, setPage] = React.useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  const [searchText, setSearchText] = React.useState('');

  const debounced = useDebouncedCallback(async (value) => {
    setSearchText(value);
    onPagePropsChange(page, rowsPerPage, order, orderBy, value);
  }, 1000);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    onPagePropsChange(page, rowsPerPage, newOrder, property, searchText);
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage);
    onPagePropsChange(newPage, rowsPerPage, order, orderBy, searchText);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rows = parseInt(event.target.value, 10);
    setRowsPerPage(rows);
    setPage(0);
    onPagePropsChange(0, rows, order, orderBy, searchText);
  };

  const [initialLoad, setInitialLoad] = React.useState(true);
  React.useEffect(() => {
    onPagePropsChange(initialPage, initialRowsPerPage, initialOrder, initialOrderBy, '').then(() => {
      setInitialLoad(false);
    });
    // Only want to run this once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between">
        <TextField
          label="Search"
          placeholder="Search..."
          variant="standard"
          defaultValue=""
          onChange={(e) => {
            debounced(e.target.value);
          }}
          sx={{ mt: 1, flexGrow: 1 }}
        />
        {Actions && (
          <Box alignSelf="flex-end" ml={2}>
            {Actions}
          </Box>
        )}
      </Box>
      <Paper sx={{ width: '100%', my: 2 }}>
        {!initialLoad && !loading && data.length === 0 && (
          <Box display="flex" justifyContent="center" py={5}>
            <Typography variant="body1" color="secondary">
              Nothing here
            </Typography>
          </Box>
        )}
        {(initialLoad || !!data.length) && (
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              {(initialLoad || loading) && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={headCells.length}>
                      <Box display="flex" justifyContent="center">
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {!initialLoad && !loading && (
                <TableBody>
                  {data.map((row) => children(row))}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
