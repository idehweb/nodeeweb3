import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '#c/components/table/DataTable';
import Login from '#c/components/admin/Login';
import Logout from '#c/components/admin/Logout';
import Dashboard from '#c/components/admin/Dashboard';
// import Db from '#c/components/admin/Db';
import { toast } from 'react-toastify';

import { Col, Row } from 'shards-react';
// Import Swiper styles
import {
  enableAdmin,
  enableAgent,
  enableSell,
  getPosts,
  getPostsByCat,
  getTheData,
  setCountry,
} from '#c/functions/index';
import store from '#c/functions/store';

import { withTranslation } from 'react-i18next';
import MainSidebarNavItems from '#c/components/layout/MainSidebar/MainSidebarNavItems';
import Delete from '#c/components/Delete';
import Edit from '#c/components/Edit';
import Create from '#c/components/Create';
import { useSelector } from 'react-redux';
import MainNavbar from '#c/components/layout/MainNavbar/MainNavbar';
import MainMobileNavbar from '#c/components/layout/MainNavbar/MainMobileNavbar';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';

const Admin = (props) => {
  let { match, location, history, t } = props;
  const themeData = useSelector((st) => st.store.themeData);
  if (!themeData) return <></>;
  let st = store.getState().store;
  let admin_token = null;
  if (st.admin && st.admin.admin_token) {
    admin_token = st.admin.admin_token;
  }
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  let models = [];
  if (themeData.models)
    themeData.models.forEach((mod, m) => {
      let childs = [];
      ['List', 'Create'].forEach((ch, c) => {
        childs.push({
          _id: mod + ch,
          title: { fa: t(ch), en: ch },
          slug: mod.toLowerCase(),
          onClick: () => {},
          parent: null,
          to: ch.toLowerCase(),
        });
      });
      models.push({
        _id: mod,
        title: { fa: t(mod), en: mod },
        slug: mod.toLowerCase(),
        onClick: () => {},
        parent: null,
        to: '',
        child: childs,
      });
    });

  //
  // if (themeData.rules)
  //   themeData.rules.forEach((rul, r) => {
  //     let childs = [];
  //
  //   });
  let params = useParams();
  let _id = params._id;
  let action = params.action || 'dashboard';
  let model = params.model;
  let rules = themeData.rules;
  
  // console.log('action', action, params.action, params.model);
  // console.log('themeData.rules[',model,']',themeData.rules)
  if (params.model) {
    action = params.action || 'list';
  }
  if (params.model === 'dashboard') {
    action = 'dashboard';
  }
  if (params.model === 'logout') {
    action = 'logout';
  }
  if (params.model === 'login') {
    action = 'login';
  }
  console.log('admin_token', admin_token);
  if (!admin_token) {
    action = 'login';
  }
  // console.log('models', models);
  // useEffect(() => {
  //   // setSelectedCats(items)
  //   if (action == 'list')
  //     getData();
  //   console.log('model,action', model, action)
  // }, [model, action]);
  const renewData = (offset) => {
    getData(offset);
  };
  useEffect(() => {
    // setSelectedCats(items)
    console.log('model', model);
    if (action == 'list') getData();
    console.log('model,action', model, action, themeData);
  }, [model, action, themeData]);
  const getData = (offset = 0) => {
    // console.clear()
    // setData([]);

    //   const { t } = this.props;
    let headers = {
      fields: [],
    };
    // console.log('themeData.rules[model]',themeData.rules)
    if (
      themeData.rules &&
      themeData.rules[model] &&
      themeData.rules[model].list &&
      themeData.rules[model].list.header
    ) {
      console.log('rules', rules[model]);
      themeData.rules[model].list.header.forEach((l) => {
        headers['fields'].push(l.name);
      });
      // headers['fields'] = themeData.rules[model].list.header
    }
    console.log("headers['fields']", headers['fields']);
    // return;
    getTheData('admin', model, headers, offset).then(
      ({ data = [], headers }) => {
        console.log('data', data);
        if (data.success == false) {
          toast(data.message, {
            type: 'error',
          });
        } else {
          setData([...data]);
          if (headers['x-total-count']) {
            setCount(headers['x-total-count']);
          }
        }
      }
    );
  };
  // if(!data)
  let headCells = [];
  if (
    themeData.rules &&
    themeData.rules[model] &&
    themeData.rules[model].list &&
    themeData.rules[model].list.header
  ) {
    headCells = [];
    themeData.rules[model].list.header.forEach((l) => {
      headCells.push({
        ...l,
        id: l.name,
        numeric: false,
        disablePadding: true,
        label: l.name,
        type: l.type || 'string',
        edit: l.edit || false,
        delete: l.delete || false,
        pageBuilder: l.pageBuilder || false,
        button_text: l.button_text || t('edit'),
      });
    });
  }
  let menu = [
    {
      child: [],
      onClick: () => {},
      parent: null,
      slug: 'dashboard',
      title: {
        fa: t('Dashboard'),
        en: 'Dashboard',
      },
      to: '',
      _id: 'Dashboard',
    },
    ...models,
    {
      child: [],
      onClick: () => {},
      parent: null,
      slug: 'logout',
      title: {
        fa: t('Logout'),
        en: 'Logout',
      },
      to: '',
      _id: 'Logout',
    },
  ];
  console.log('menu', menu);
  return (
    <>
      {action == 'logout' && <Logout />}
      {action == 'login' && <Login />}

      {action !== 'login' && action !== 'logout' && (
        <Row className={'m-0'}>
          {/*<MainNavbar />*/}
          {/*{JSON.stringify(menu)}*/}
          <MainSidebar>
            <MainSidebarNavItems items={menu} />
          </MainSidebar>
          <MainMobileNavbar search={false} />
          <Col
            tag="aside"
            lg={{ size: 3 }}
            md={{ size: 4 }}
            className={'sidebar white mobilenone'}>
            <Row className={''}>
              <Col lg={{ size: 12 }} md={{ size: 12 }}>
                <MainSidebarNavItems items={menu} />
              </Col>
            </Row>
          </Col>
          <Col
            className="main-content iuytfghj"
            lg={{ size: 9 }}
            md={{ size: 8 }}
            sm="12"
            tag="main">
            <Row className={'mt-3 juytrfvbh pr-15'}>
              <Col
                // className="ghjhtgfrdsfg bg-color-full bg-right"
                lg={{ size: 12 }}
                md={{ size: 12 }}
                sm="12">
                {action == 'dashboard' && <Dashboard />}

                {action == 'list' && data && model && rules && (
                  <Table
                    base={model + '/'}
                    data={data}
                    count={count}
                    model={model}
                    renewData={renewData}
                    rules={rules[model] ? rules[model].list : {}}
                    headCells={headCells}
                    newText={t('No records found. Please create one')}
                    buttonText={t('create new')}
                  />
                )}
                {action == 'create' && model && rules && (
                  <Row>
                    <Create
                      model={model}
                      rules={rules[model] ? rules[model].create : {}}
                    />
                  </Row>
                )}
                {action == 'edit' && model && rules && (
                  <Row>
                    <Edit
                      model={model}
                      _id={_id}
                      rules={rules[model] ? rules[model].edit : {}}
                    />
                  </Row>
                )}

                {action == 'delete' && model && rules && (
                  <Row>
                    <Delete
                      model={model}
                      _id={_id}
                      rules={rules[model] ? rules[model].delete : {}}
                    />
                  </Row>
                )}

                {/*{_id}*/}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default withTranslation()(Admin);
