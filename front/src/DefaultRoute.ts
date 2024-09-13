import { lazy } from 'react';

import OrderDetails from '@/views/OrderDetails';

const Add = lazy(() => import('@/views/Add'));
const Admin = lazy(() => import('@/views/Admin'));
// const CreatePage = lazy(() => import( '@/views/CreatePage'));
// const Db = lazy(() => import( '@/views/Db'));
const Home = lazy(() => import('@/views/Home'));
// const HomeDb = lazy(() => import( '@/views/Home_db'));
const Product = lazy(() => import('@/views/Product'));
const Login = lazy(() => import('@/views/Login'));
const Contacts = lazy(() => import('@/views/Contacts'));
const Order = lazy(() => import('@/views/Order'));
const Chat = lazy(() => import('@/views/Chat'));
const Entities = lazy(() => import('@/views/Entities'));
const Page = lazy(() => import('@/views/Page'));
const Profile = lazy(() => import('@/views/Profile'));
const MyOrders = lazy(() => import('@/views/MyOrders'));
const Transaction = lazy(() => import('@/views/Transaction'));
const DynamicPage = lazy(() => import('@/views/DynamicPage'));
const Checkout = lazy(() => import('@/views/Checkout'));
const Post = lazy(() => import('@/views/Post'));
const TitlesPage = lazy(() => import('@/views/TitlesPage'));
const DefaultLayout = lazy(() => import('@/layouts/Default'));
const Nohf = lazy(() => import('@/layouts/Nohf'));

const DefaultRoute = [
  {
    path: '/add/:_id',
    element: Add,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/post/:_id',
    element: Post,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/post/:_id/:slug',
    element: Post,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/page/:_id',
    element: Page,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/product/:_id/:_slug',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/product/:_id',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/p/:_id',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/login',
    element: Login,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/transaction/:method',
    element: Transaction,
    layout: Transaction,
    exact: true,
  },
  {
    path: '/transaction',
    element: Transaction,
    layout: Transaction,
    exact: true,
  },
  {
    path: '/login/:_state',
    element: Login,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/checkout',
    element: Checkout,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/chat',
    element: Chat,
    layout: Nohf,
    exact: true,
  },
  {
    path: '/chat/:user_id',
    element: Chat,
    layout: Nohf,
    exact: true,
  },
  {
    path: '/contacts',
    element: Contacts,
    layout: Nohf,
    exact: true,
  },

  {
    path: '/profile',
    element: Profile,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/my-orders',
    layout: DefaultLayout,
    element: MyOrders,
  },
  {
    path: '/order-details/:_id',
    layout: DefaultLayout,
    element: OrderDetails,
  },
  {
    path: '/order/:_id',
    layout: DefaultLayout,
    element: Order,
  },
  {
    path: '/a/:_entity/:_id/:_slug',
    element: Entities,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/:_id',
    element: Page,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/title/:_id',
    element: TitlesPage,
    layout: DefaultLayout,
    exact: true,
  },
];

export default function createRoutes(themeRoutes) {
  const routes = DefaultRoute;
  themeRoutes.forEach((e, j) => {
    if (e.element === 'Admin') e.element = Admin;
    else if (e.element === 'Home') e.element = Home;
    else if (e.element === 'Checkout') e.element = Checkout;
    else if (e.element === 'DynamicPage') e.element = DynamicPage;

    if (e.layout === 'Nohf') e.layout = Nohf;
    else if (e.layout === 'Transaction') e.layout = Transaction;
    else if (e.layout === 'DefaultLayout') e.layout = DefaultLayout;

    if (e.layout && e.element && e.path) routes.push(e);
  });
  return routes;
}
