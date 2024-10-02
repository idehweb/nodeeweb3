import { useEffect, lazy } from 'react';
import { Admin, CustomRoutes, Resource, useTranslate } from 'react-admin';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import _get from 'lodash/get';

import '@/assets/global.css';
import '@/assets/rtl.css';

import * as RSList from '@/resource';
import {
  authProvider,
  changeThemeData,
  changeThemeDataFunc,
} from '@/functions';
import dataProvider from '@/functions/dataProvider';
import Login from '@/layout/Login';
import { MainLayout } from '@/layout';

import { ExcludeList } from '@/data/models';
import englishMessages from '@/i18n/en';
import farsiMessages from '@/i18n/fa';

import MyTheme from './MuiTheme';

const PageBuilder = lazy(() => import('@/resource/pageBuilder'));

const messages = {
  fa: farsiMessages,
  en: englishMessages,
};

const localeMain = localStorage.getItem('locale');
const i18nProvider = polyglotI18nProvider((locale) => {
  if (localeMain) {
    locale = localeMain;
  }
  return messages[locale] ? messages[locale] : messages.en;
}, 'en');

export default function App() {
  const t = useTranslate();
  const dispatch = useDispatch();
  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  useEffect(() => {
    changeThemeDataFunc().then((e) => {
      dispatch(changeThemeData(e));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ModelList = _get(themeData, 'models', []) || [];

  return (
    <Admin
      title={t('websiteName')}
      disableTelemetry
      theme={MyTheme}
      loginPage={Login}
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={RSList.MainDashboard}
      layout={MainLayout}
      i18nProvider={i18nProvider}>
      <Resource
        name="accounting"
        options={{ label: 'pos.menu.accounting' }}
        {...RSList.Accounting}
      />
        <Resource
        name="attributes"
        options={{ label: 'pos.menu.attributes' }}
        {...RSList.Attributes}
      />
      <Resource
        name="productCategory"
        options={{ label: 'pos.menu.categories' }}
        {...RSList.ProductCategory}
      />
      <Resource
        name="customerGroup"
        options={{ label: 'pos.menu.customerGroups' }}
        {...RSList.CustomerGroup}
      />
      {/*<Resource name="customer-group" {...RSList.CustomerGroup} options={{label: translate('pos.menu.customerGroups')}}/>*/}
      <Resource
        name="discount"
        options={{ label: 'pos.menu.discounts' }}
        {...RSList.Discount}
      />
      <Resource
        name="product"
        options={{ label: 'pos.menu.products' }}
        {...RSList.Product}
      />
      <Resource
        name="post"
        options={{ label: 'pos.menu.posts' }}
        {...RSList.Post}
      />
      <Resource
        name="page"
        options={{ label: 'pos.menu.pages' }}
        {...RSList.Page}
      />
      <Resource
        name="gateway"
        options={{ label: 'pos.menu.gateways' }}
        {...RSList.Gateway}
      />
      <Resource
        name="customer"
        options={{ label: 'pos.menu.customers' }}
        {...RSList.Customer}
      />
      <Resource
        name="admin"
        options={{ label: 'pos.menu.users' }}
        {...RSList.User}
      />
      <Resource
        name="media"
        options={{ label: 'pos.menu.medias' }}
        {...RSList.Media}
      />
      <Resource
        name="document"
        options={{ label: 'pos.menu.documents' }}
        {...RSList.Document}
      />
      <Resource
        name="note"
        options={{ label: 'pos.menu.notes' }}
        {...RSList.Note}
      />
      <Resource
        name="task"
        options={{ label: 'pos.menu.tasks' }}
        {...RSList.Task}
      />
      <Resource
        name="menu"
        options={{ label: 'pos.menu.menu' }}
        {...RSList.Menu}
      />
      <Resource
        name="form"
        options={{ label: 'pos.menu.form' }}
        {...RSList.Form}
      />
      <Resource
        name="entry"
        options={{ label: 'pos.menu.entry' }}
        {...RSList.Entry}
      />
      <Resource
        name="order"
        options={{ label: 'pos.menu.orders' }}
        {...RSList.Order}
      />
      <Resource
        name="ordercart"
        options={{ label: 'pos.menu.cart' }}
        {...RSList.OrderCart}
      />
      <Resource
        name="transaction"
        options={{ label: 'pos.menu.transactions' }}
        {...RSList.Transaction}
      />
      <Resource
        name="template"
        options={{ label: 'pos.menu.template' }}
        {...RSList.Template}
      />
      <Resource
        name="notification"
        options={{ label: 'pos.menu.notification' }}
        {...RSList.Notification}
      />
        <Resource
        name="campaign"
        options={{ label: 'pos.menu.campaign' }}
        {...RSList.Campaign}
      />
        <Resource
        name="link"
        options={{ label: 'pos.menu.link' }}
        {...RSList.Link}
      />
      <Resource
        name="settings"
        options={{ label: 'pos.menu.settings' }}
        {...RSList.Settings}
      />
      <Resource
        name="action"
        options={{ label: 'pos.menu.actions' }}
        {...RSList.Action}
      />
      <Resource
        name="automation"
        options={{ label: 'pos.menu.automation' }}
        {...RSList.Automation}
      />
      <Resource
        name="AdsCategory"
        options={{ label: 'pos.menu.Adscategory' }}
        {...RSList.AdsCategory}
      />
      <Resource
        name="Add"
        options={{ label: 'pos.menu.Add' }}
        {...RSList.Advertise}
      />
      <Resource
        name="InItem"
        options={{ label: 'pos.menu.inItem' }}
        {...RSList.InItem}
      />
      {ModelList.map((i, idx) => {
        const modelName = i.toLowerCase();
        if (!ExcludeList.includes(modelName))
          return (
            <Resource
              key={`${modelName}-${idx}`}
              name={modelName}
              options={{ label: 'pos.menu.' + modelName }}
              {...RSList.Dynamic}
            />
          );

        return null;
      })}
      <CustomRoutes>
        <Route path="/plugins" element={<RSList.Plugins />} />
        <Route path="/plugins/:name" element={<RSList.Plugin />} />
        <Route path="/configuration" element={<RSList.Configuration />} />
        <Route path="/messages" element={<RSList.Messages />} />
        <Route path="/p-c" element={<RSList.PrivateConfiguration />} />
      </CustomRoutes>
      <CustomRoutes noLayout>
        <Route path="/logout" element={<RSList.Logout />} />
        <Route path="/builder/:model/:_id" element={<PageBuilder />} />
      </CustomRoutes>
    </Admin>
  );
}
