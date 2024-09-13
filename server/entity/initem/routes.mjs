import controller from './controller.mjs';
export default [
  {
    path: '/',
    method: 'get',
    access: 'admin_user,admin_shopManager',
    controller: controller.getAll,
  },
  {
    path: '/count',
    method: 'get',
    access: 'admin_user,admin_shopManager',
  },
  {
    path: '/:offset/:limit',
    method: 'get',
    access: 'admin_user,admin_shopManager,customer_user',
    controller: controller.getAll,

    // "access": "customer_user",
  },
  {
    path: '/:offset/:limit/:search',
    method: 'get',
    controller: controller.getAll,
    access: 'admin_user,admin_shopManager,customer_user',

    // "access": "admin_user,admin_shopManager,customer_all",
  },

  {
    path: '/:id',
    method: 'get',
    access: 'admin_user,admin_shopManager,customer_user',
    controller: controller.viewOne,

    // "controller":()=>{
    //     console.log('hi')
    // }
  },
  {
    path: '/',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.createByAdmin,
  },
  {
    path: '/importFromLatest',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.importFromLatest,
  },
  {
    path: '/importFromMojavez',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.importFromMojavez,
  },
  {
    path: '/importFromOlaviat',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.importFromOlaviat,
  },
  {
    path: '/rewriteItems',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.rewriteItems,
  },
    {
    path: '/exporter/:offset/:limit',
    method: 'post',
    access: 'admin_user,admin_shopManager',
    controller: controller.exporter,
  },
  // {
  //   "path": "/rewriteProductsImages",
  //   "method": "post",
  //   "access": "admin_user,admin_shopManager",
  //   "controller": controller.rewriteProductsImages,
  // },
  {
    path: '/:id',
    method: 'put',
    access: 'admin_user,admin_shopManager',
    controller: controller.editByAdmin,
  },
  {
    path: '/:id',
    method: 'delete',
    access: 'admin_user,admin_shopManager',
    controller: controller.destroy,
  },
];
