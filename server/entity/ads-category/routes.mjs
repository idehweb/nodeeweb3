import controller from "./controller.mjs";

export default [
  {
    path: "/",
    method: "get",
    access: "admin_user,admin_shopManager,customer_all",
    controller: controller.getAll,
  },
  {
    path: "/level",
    method: "get",
    access: "customer_all",
    controller: controller.level,
  },
  {
    path: "/level/:catId",
    method: "get",
    access: "customer_all",
    controller: controller.level,
  },
  {
    path: "/:offset/:limit",
    method: "get",
    controller: controller.getAll,
    access: "customer_all",
  },
  {
    path: "/:offset/:limit/:search",
    method: "get",
    controller: controller.getAll,
    access: "customer_all",
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
