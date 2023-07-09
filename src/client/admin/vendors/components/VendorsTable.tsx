import * as React from 'react';
import Link from 'next/link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Vendor } from '@prisma/client';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { VendorPageData } from 'src/types/response/vendors/vendor-page.response';
import SortTable, { HeadCell, Order } from 'src/client/common/components/SortTable';
import AddVendorDialog from './AddVendorDialog';

const headCells: HeadCell<Vendor>[] = [
  {
    id: 'name',
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
];

export default function VendorsTable() {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const { get, loading } = useApiRequest('secure/admin/vendors');
  const { displayError } = useNotifications();

  const onPagePropsChange = async (
    page: number,
    rowsPerPage: number,
    order: Order,
    orderBy: keyof Vendor,
    searchText: string
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
    console.log({ response, vendors });
    setVendors(vendors);
    setTotal(total);
  };

  return (
    <SortTable
      data={vendors}
      total={total}
      headCells={headCells}
      initialOrderBy="name"
      loading={loading}
      Actions={<AddVendorDialog />}
      onPagePropsChange={onPagePropsChange}
    >
      {(item) => {
        return (
          <TableRow hover tabIndex={-1} key={item.id}>
            <TableCell>
              <Link href={`/admin/vendors/${item.id}`}>{item.name}</Link>
            </TableCell>
            <TableCell>{item.address}</TableCell>
          </TableRow>
        );
      }}
    </SortTable>
  );
}
