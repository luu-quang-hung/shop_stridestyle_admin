import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Product = React.lazy(() => import('./views/management/product/ProductComponent'))

const Order = React.lazy(() => import('./views/management/order/OrderComponent'))
const Customer = React.lazy(() => import('./views/management/customer/CustomerComponent'))
const Trademark = React.lazy(() => import('./views/management/category/CategoryComponent'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/management', name: 'Management', element:Product , exact: true },

  //Management

  {path:'/management/product',name: 'Product' , element: Product},
  {path:'/management/order',name: 'Order' , element: Order},
  {path:'/management/customer',name: 'Customer' , element: Customer},
  {path:'/management/trademark',name: 'Trademark' , element: Trademark}


]

export default routes
