import * as React from 'react';
import Link from 'next/link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Vendor } from '@prisma/client';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { VendorPageData } from 'src/types/response/vendors/vendor-page.response';
import SortTable, { HeadCell, Order } from 'src/client/common/components/SortTable';
import ManageVendorDialog from './ManageVendorDialog';
import LoadingButton from 'src/client/common/components/LoadingButton';

const headCells: HeadCell<Vendor>[] = [
  {
    typeId: 'name',
    label: 'Name',
    numeric: false,
    disablePadding: false,
    sortable: true,
  },
  {
    id: 'address',
    label: 'Address',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'tier',
    label: 'Tier',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'onedishcount',
    label: 'OneDishes',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'delete',
    label: '',
    numeric: false,
    disablePadding: false,
  },
];

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function VendorsTable() {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const { get, loading } = useApiRequest('secure/admin/vendors');
  // Separate hooks just to get different loading states
  const { deleteApi, loading: loadingDelete } = useApiRequest('secure/admin/vendors');
  const { displayError, displayInfo } = useNotifications();

  const [vendorToDelete, setVendorToDelete] = React.useState<Vendor | undefined>(undefined);

  const onPagePropsChange = async (
    page: number,
    rowsPerPage: number,
    order: Order,
    orderBy: keyof Vendor,
    searchText: string,
  ) => {
    let query = `?skip=${
      page * rowsPerPage
    }&take=${rowsPerPage}&sortType=${order}&column=${orderBy}&searchQuery=${searchText}`;
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
    setVendors(vendors);
    setTotal(total);
  };

  const deleteVendor = async (vendor: Vendor) => {
    const result = await deleteApi<boolean>(`/${vendor.id}`);
    if (result.error) {
      displayError(result.error);
      return;
    }
    if (!result.data) {
      displayError('Could not delete vendor');
      return;
    }
    displayInfo(`The vendor ${vendor.name} was deleted`);
    setVendors((prev) => prev.filter((v) => v.id !== vendor.id));
  };

  return (
    <>
      <SortTable
        data={vendors}
        total={total}
        headCells={headCells}
        initialOrderBy="name"
        loading={loading}
        Actions={<ManageVendorDialog onVendor={(vendor) => setVendors((prev) => [vendor, ...prev])} />}
        onPagePropsChange={onPagePropsChange}
      >
        {(item) => {
          return (
            <TableRow hover tabIndex={-1} key={item.id}>
              <TableCell>
                <Link href={`/admin/vendors/${item.id}`}>{item.name}</Link>
              </TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{capitalizeFirstLetter(item.tier || '')}</TableCell>
              <TableCell>{item.oneDishes.length}</TableCell>
              <TableCell>
                <IconButton aria-label="delete" onClick={() => setVendorToDelete(item)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        }}
      </SortTable>
      {vendorToDelete && (
        <Dialog open fullWidth maxWidth="sm">
          <DialogTitle>
            Delete {vendorToDelete.name}
            <IconButton
              aria-label="close"
              disabled={loadingDelete}
              onClick={() => setVendorToDelete(undefined)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body1">Are you sure you want to delete the vendor {vendorToDelete.name}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVendorToDelete(undefined)} disabled={loadingDelete}>
              Close
            </Button>
            <LoadingButton
              loading={loadingDelete}
              onClick={async () => {
                await deleteVendor(vendorToDelete);
                setVendorToDelete(undefined);
              }}
              color="error"
              variant="contained"
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
