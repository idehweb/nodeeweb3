import { useCallback, useEffect, useState } from 'react';

import {
  useDataProvider,
  useEditContext,
  useShowContext,
  useTranslate,
} from 'react-admin';
import { DataGrid } from '@mui/x-data-grid';

const Transactions = ({ isEdit }) => {
  const hook = isEdit ? useEditContext : useShowContext;
  const { record = {} } = hook();

  const { phoneNumber, _id } = record || {};
  const [state, setState] = useState({
    orders: [],
  });
  // const version = useVersion();
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  const fetchOrders = useCallback(async () => {
    const { data: Data } = await dataProvider.get(
      phoneNumber
        ? 'transaction/0/10000?customer=' + _id
        : 'transaction/0/10000?order=' + _id,
      {}
    );

    setState((state) => ({
      ...state,
      orders: Data,
    }));
  }, [dataProvider]);
  useEffect(() => {
    fetchOrders();
  }, []);
  let { orders } = state;
  // const { data,isLoading } = useListContext();
  // let loaded = Boolean(data && data.length);
  // console.log("loaded", loaded,isLoading);
  // let objs=Object.keys(orders);
  const columns = [
    { field: '_id', headerName: 'ID', width: 100 },
    { field: 'message', headerName: 'message', width: 500 },
    {
      field: 'from',
      width: 250,
      headerName: 'from',
    },
    {
      field: 'status',
      width: 100,

      headerName: 'status',
    },
  ];
  if (!orders) {
    return <></>;
  }
  return (
    <div style={{ height: 400, width: '100%', minWidth: '100%' }}>
      <div className={'label-top-table'}>{translate('transactions')}</div>
      <DataGrid
        style={{ minWidth: '100%' }}
        getRowId={(row) => row._id}
        rows={orders}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5, 20, 100]}
        checkboxSelection={false}
        disableSelectionOnClick={true}
      />
    </div>
  );
  // return (
  //   <TableContainer component={Paper}>
  //     <div className={'label-top-table'}>{translate('transactions')}</div>

  //     <Table
  //       sx={{ minWidth: '100%', marginBottom: '20px' }}
  //       aria-label="simple table">
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>_id</TableCell>
  //           <TableCell align="right">from</TableCell>
  //           <TableCell align="right">message</TableCell>
  //           <TableCell align="right">status</TableCell>
  //           <TableCell align="right">updatedAt</TableCell>
  //           <TableCell align="right">createdAt</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {orders &&
  //           orders.map((item, i) => {
  //             return (
  //               <TableRow key={i}>
  //                 <TableCell component="th" scope="row">
  //                   {JSON.stringify(item._id)}
  //                 </TableCell>
  //                 <TableCell>{JSON.stringify(item.from)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.message)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.status)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.updatedAt)}</TableCell>
  //                 <TableCell>{JSON.stringify(item.createdAt)}</TableCell>
  //               </TableRow>
  //             );
  //           })}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
};

export default Transactions;
