import controller from "./controller.mjs";

export default [
  {
    path: "/:offset/:limit",
    method: "get",
    controller: controller.getAll,
    // "access": "customer_user",
    access: "admin_user,admin_shopManager,customer_user",

    // "access": "admin_user,admin_shopManager,customer_all",
  },
  {
    path: "/:offset/:limit/:search",
    method: "get",
    controller: controller.getAll,
    // "access": "customer_user",
    access: "admin_user,admin_shopManager,customer_user",

    // "access": "admin_user,admin_shopManager,customer_all",
  },

  {
    path: "/:id",
    method: "get",
    // "access": "customer_user",
    access: "admin_user,admin_shopManager,customer_user",

    controller: controller.viewOne,

    // "controller":()=>{
    //     console.log('hi')
    // }
  },
  {
    path: "/",
    method: "post",
    access: "admin_user,admin_shopManager",
    controller: controller.createByAdmin,
  },
  {
    path: "/importFromLatest",
    method: "post",
    access: "admin_user,admin_shopManager",
    controller: controller.importFromLatest,
  },
  {
    path: "/rewriteItems",
    method: "post",
    access: "admin_user,admin_shopManager",
    controller: controller.rewriteItems,
  },
  // {
  //   "path": "/rewriteProductsImages",
  //   "method": "post",
  //   "access": "admin_user,admin_shopManager",
  //   "controller": controller.rewriteProductsImages,
  // },
  {
    path: "/:id",
    method: "put",
    access: "admin_user,admin_shopManager",
    controller: controller.editByAdmin,
  },
  {
    path: "/:id",
    method: "delete",
    access: "admin_user,admin_shopManager",
    controller: controller.destroy,
  },
];
