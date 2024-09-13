import { useCallback } from 'react';
import {
  AutocompleteInput,
  CreateButton,
  Datagrid,
  EditButton,
  ExportButton,
  FilterButton,
  FunctionField,
  ListContextProvider,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
  NumberInput,
  TopToolbar,
  useListContext,
  useTranslate,
  Link,
  ShowButton,
} from 'react-admin';
import { Chip, Divider, Tab, Tabs } from '@mui/material';
import moment from 'jalali-moment';
import jsonExport from 'jsonexport/dist';
import { useSelector } from 'react-redux';
import { downloadCSV } from 'react-admin';

import {
  List,
  OrderPaymentStatus,
  OrderTabs,
  ReactAdminJalaliDateInput,
} from '@/components';
import { dateFormat } from '@/functions';

const exporter = (posts) => {
  
  let allpros = [];
  const postsForExport = posts.map((post, i) => {
    const { backlinks, author, ...postForExport } = post; // omit backlinks and author

    postForExport._id = post._id; // add a field
    // console.log(post.title)

    // if (post.title)
    // postForExport.title = post.title.fa; // add a field
    // postForExport.type = post.type; // add a field
    // console.log("i", i);
    // postForExport.combinations = post.combinations; // add a field

    allpros.push({
      _id: post._id,
      orderNumber: post.slug,
      paymentStatus: post.paymentStatus,
      status: post.status,
      sum: post.sum,
      amount: post.amount,
      gateway: post.gateway,
      orderCount:
        post.customer && post.customer.orderCount
          ? post.customer.orderCount
          : null,
      firstName:
        post.customer && post.customer.firstName
          ? post.customer.firstName
          : null,
      lastName:
        post.customer && post.customer.lastName ? post.customer.lastName : null,
      phoneNumber:
        post.customer && post.customer.phoneNumber
          ? post.customer.phoneNumber
          : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  });
  console.log('postsForExport', allpros);
  jsonExport(
    allpros,
    {
      headers: [
        '_id',
        'orderNumber',
        'orderCount',
        'firstName',
        'lastName',
        'phoneNumber',
        'amount',
        'sum',
        'createdAt',
        'updatedAt',
        'status',
        'paymentStatus',
      ], // order fields in the export
    },
    (err, csv) => {
      console.log('ForExport', allpros);
      const BOM = '\uFEFF';
      downloadCSV(`${BOM} ${csv}`, 'orders'); // download as 'posts.csv` file
    }
  );
};
const ListActions = (props) => {
  // All configuration options are optional
  const config = {
    // Enable logging
    logging: true,
    // Disable "import new" button
    // disableImportNew: false,
    // Disable "import overwrite" button
    // disableImportOverwrite: false,
    // // A function to translate the CSV rows on import
    // preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
    // // A function to handle row errors after import
    // postCommitCallback?: (error: any) => void;
    // Transform rows before anything is sent to dataprovider
    transformRows: (csvRows) => {
      console.log('csvRows', csvRows);
      // let update = [], create = [];
      let array = [];
      const postsForExport = csvRows.map((row) => {
        console.log('row', row);

        row._id = row[' _id'];
        if (row._id)
          array.push({
            _id: row._id,
          });
        // else
        // delete row.photos;
        delete row[' _id'];
        delete row['id'];
        delete row.firstCategory_name_ru;
        delete row.secondCategory_name_ru;
        delete row.thirdCategory_name_ru;
        row.title = {
          en: row.title_en,
          fa: row.title_fa,
          ru: row.title_ru,
          uz: row.title_uz,
        };
        delete row.title_en;
        delete row.title_ru;
        delete row.title_uz;
        delete row.createdAt;
        delete row.updatedAt;
        // if (row._id) {
        //     update.push(row);
        // } else {
        //     create.push(row);
        // }
        // if()

        return row;
      });
      console.log('ForImport', postsForExport);
      // API.post('/product/importproductsfromcsv', JSON.stringify(postsForExport))
      //     .then(({data = {}}) => {
      // const refresh = useRefresh();
      // refresh();
      // alert('it is ok');
      // window.location.reload();
      // if (data.success) {
      //     values = [];
      //     valuess = [];
      // }
      // })
      // .catch((err) => {
      //     console.log('error', err);
      // });
    },
    validateRow: async (row) => {
      console.log('row', row);
      if (row.id) {
        // throw new Error("AAAA");
      }
    },
    postCommitCallback: (reportItems) => {
      console.log('reportItems', { reportItems });
    },
    // Async function to Validate a row, reject the promise if it's not valid
    parseConfig: {
      dynamicTyping: true,
      // complete: function(results, file) {
      //     console.log("Parsing complete:", results, file);
      // },
      // preview:1
    },
  };
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton maxResults={1000} />
      {/*<CreateButton basePath={basePath} />*/}
      {/*<ImportButton {...props} {...config} />*/}
      {/* Add your custom actions */}
      {/*<Button*/}
      {/*onClick={() => {*/}
      {/*alert('Your custom action');*/}
      {/*}}*/}
      {/*label="Show calendar"*/}
      {/*>*/}
      {/*<IconEvent/>*/}
      {/*</Button>*/}
    </TopToolbar>
  );
};
export default function OrderList(props) {
  return (
    <List
      actions={<ListActions />}
      filters={[
        <SelectInput
          source="paymentStatus"
          label="resources.order.paymentStatus"
          emptyValue=""
          choices={OrderPaymentStatus()}
          alwaysOn
        />,
        <ReactAdminJalaliDateInput
          fullWidth
          source="date_gte"
          label="resources.order.date_gte"
          format={(formValue) =>
            moment.from(formValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
          }
          parse={(inputValue) =>
            moment.from(inputValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
          }
        />,
        <TextInput
          fullWidth
          source="date_gte"
          label="resources.order.date_gte"
        />,
        <ReactAdminJalaliDateInput
          fullWidth
          source="date_lte"
          label="resources.order.date_lte"
          format={(formValue) =>
            moment.from(formValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
          }
          parse={(inputValue) =>
            moment.from(inputValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
          }
        />,
        <TextInput
          fullWidth
          source="date_lte"
          label="resources.order.date_lte"
        />,
        <NumberInput
          fullWidth
          source="orderCount"
          label="resources.order.orderCount"
        />,
        <TextInput
          fullWidth
          source="orderNumber"
          label="resources.order.orderNumber"
        />,
        <ReferenceInput
          label="resources.order.customer"
          source="customer"
          reference="customer">
          <AutocompleteInput
            optionText={(r) =>
              `${r.firstName ? r.firstName : ''} ${
                r.lastName ? r.lastName : ''
              }`
            }
          />
        </ReferenceInput>,
      ]}
      exporter={exporter}>
      <TabbedDatagrid />
    </List>
  );
}

const TabbedDatagrid = (props) => {
  const listContext = useListContext();
  const { filterValues, setFilters, displayedFilters } = listContext;
  const t = useTranslate();

  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const totals = 0;

  const handleChange = useCallback(
    (e, v) => {
      setFilters({ ...filterValues, status: v }, displayedFilters);
    },
    [displayedFilters, filterValues, setFilters]
  );

  return (
    <>
      <Tabs
        variant="fullWidth"
        centered
        value={filterValues.status}
        indicatorColor="primary"
        onChange={handleChange}>
        {OrderTabs().map((choice) => (
          <Tab
            key={choice.id}
            label={
              totals[choice.name]
                ? `${choice.name} (${totals[choice.name]})`
                : choice.name
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider />

      <ListContextProvider value={listContext}>
        <Datagrid {...props} optimized>
          <TextField source="orderNumber" label="resources.order.orderNumber" />
          <FunctionField
            label="resources.order.customerData"
            render={(record) => (
              <div>
                {record.customer && (
                  <div>
                    {record.customer.firstName && (
                      <div>{record.customer.firstName}</div>
                    )}

                    {record.customer.lastName && (
                      <div>{record.customer.lastName}</div>
                    )}
                    {record.customer.phoneNumber && (
                      <Link
                        to={`/customer/${record.customer._id}/show`}
                        target="_blank">
                        {record.customer.phoneNumber}
                      </Link>
                    )}

                    <div>
                      <span>{t('resources.order.orderCount') + ':'}</span>
                      {record.customer?.orderCount}
                    </div>
                  </div>
                )}

                {!record.customer && record.customer_data && (
                  <div>
                    {record.customer_data.firstName && (
                      <div>{record.customer_data.firstName}</div>
                    )}
                    {record.customer_data.lastName && (
                      <div>{record.customer_data.lastName}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          />
          <FunctionField
            label="resources.order.sum"
            render={(record) => {
              return (
                record &&
                record.sum &&
                record.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                  ' ' +
                  t(themeData.currency)
              );
            }}
          />
          <FunctionField
            label="resources.order.amount"
            render={(record) => {
              return (
                record &&
                record.amount &&
                record.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                  ' ' +
                  t(themeData.currency)
              );
            }}
          />

          <FunctionField
            label="resources.order.status"
            render={(record) => (
              <Chip
                className={record.status}
                label={t('pos.OrderStatus.' + record.status)}
              />
            )}
          />

          <FunctionField
            label="resources.order.paymentStatus"
            render={(record) => (
              <Chip
                className={record.paymentStatus}
                label={t('pos.OrderPaymentStatus.' + record.paymentStatus)}
              />
            )}
          />
          {/*<SelectField source="status" choices={OrderStatus()}*/}
          {/*label="resources.order.status' optionText={<StatusField/>}*/}
          {/*/>*/}
          {/*<SelectField source="paymentStatus" choices={OrderPaymentStatus()}*/}
          {/*label="resources.order.paymentStatus' optionText={<PaymentStatusField/>}*/}
          {/*/>*/}

          <FunctionField
            label="resources.order.date"
            render={(record) => (
              <>
                <div>
                  {t('resources.order.createdAt') +
                    ': ' +
                    `${dateFormat(record.createdAt)}`}
                  <br />
                  {t('resources.order.updatedAt') +
                    ': ' +
                    `${dateFormat(record.updatedAt)}`}
                </div>
              </>
            )}
          />

          <EditButton />
          <ShowButton />
        </Datagrid>
      </ListContextProvider>
    </>
  );
};
