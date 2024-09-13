import controller from "./controller.mjs";

export default [
  {
    path: "/",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.getAllAdmin,
  },
  {
    path: "/count",
    method: "get",
    access: "admin_user,admin_shopManager",
  },
  {
    path: "/myAds/mine/:offset/:limit",
    method: "get",
    access: "customer_user",
    controller: controller.myAds,
  },
  {
    path: "/allads/:offset/:limit",
    method: "get",
    // "access": "admin_user,admin_shopManager",
    // "controller": controller.getAllAdmin,
    controller: controller.getAll,
    access: "customer_all",
  },

  {
    path: "/view/:id",
    method: "post",
    access: "customer_all",
    controller: controller.viewAd,
  },
  {
    path: "/view/:id",
    method: "get",
    access: "customer_user",
    controller: controller.getView,
  },

  {
    path: "/:offset/:limit",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.getAllAdmin,
  },
  {
    path: "/:offset/:limit/:search",
    method: "get",
    // "controller": controller.getAll,
    access: "admin_user,admin_shopManager",
    controller: controller.getAllAdmin,
    // "access": "customer_all",

    // "access": "admin_user,admin_shopManager,customer_all",
  },

  {
    path: "/:id",
    method: "get",
    access: "customer_all",
    controller: controller.viewOne,
  },
  {
    path: "/",
    method: "post",
    access: "admin_user,admin_shopManager",
    controller: controller.createByAdmin,
  },
  {
    path: "/myad/mine",
    method: "post",
    access: "customer_user",
    controller: controller.createByCustomer,
  },
  {
    path: "/fileUpload",
    method: "post",
    access: "admin_user,admin_shopManager,customer_user",
    controller: controller.fileUpload,
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
