import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { Vendor } from '@prisma/client';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { VendorPageData } from 'src/types/response/vendors/vendor-page.response';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Vendor;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
  sortable?: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    label: 'Id',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'name',
    label: 'Name',
    numeric: false,
    disablePadding: true,
    sortable: true,
  },
  {
    id: 'address',
    label: 'Address',
    numeric: false,
    disablePadding: false,
  },
];

interface EnhancedTableProps {
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Vendor) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Vendor) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              disabled={!headCell.sortable}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
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

export default function VendorsTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Vendor>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const { get } = useApiRequest('secure/admin/vendors');
  const { displayError } = useNotifications();

  const getVendors = async () => {
    let query = `?skip=${page * rowsPerPage}&take=${rowsPerPage}&sortType=${order}&column=${orderBy}`;
    const response = await get<VendorPageData>(query);
    if (response.error) {
      displayError(response.error);
      return;
    }
    if (!response.data) {
      displayError('Could not get vendors');
      return;
    }
    const { data: vendors, total } = response.data;
    console.log({ response, vendors });
    setVendors(vendors);
    setTotal(total);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Vendor) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rows = parseInt(event.target.value, 10);
    setRowsPerPage(rows);
    setPage(0);
  };

  React.useEffect(() => {
    getVendors();
  }, [page, rowsPerPage, order, orderBy]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {vendors.map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                  </TableRow>
                );
              })}
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
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
