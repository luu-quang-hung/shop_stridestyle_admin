import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SaleCounter = React.lazy(() => import('./views/management/saleCounter/SaleCounterComponent'))

const Product = React.lazy(() => import('./views/management/product/ProductComponent'))

const Order = React.lazy(() => import('./views/management/order/OrderComponent'))
const Customer = React.lazy(() => import('./views/management/customer/CustomerComponent'))
const Trademark = React.lazy(() => import('./views/management/category/CategoryComponent'))
const Property = React.lazy(() => import('./views/management/property/PropertyComponent'))
const Event =  React.lazy(() => import('./views/management/event/EventComponent'))
const Invoice = React.lazy(() => import('./views/management/saleCounter/Invoice'))

const routes = [
  { path: '/', exact: true, name: 'Trang chủ' },
  { path: '/dashboard', name: 'Thống kê', element: Dashboard },
  { path: '/management', name: 'Quản lý', element:Product , exact: true },
  { path: '/sale-counter', name: 'Bán hàng tại quầy', element:SaleCounter , exact: true },

  //Management

  {path:'/management/product',name: 'Sản phẩm' , element: Product},
  {path:'/management/order',name: 'Đơn hàng' , element: Order},
  {path:'/management/customer',name: 'Khách hàng' , element: Customer},
  {path:'/management/trademark',name: 'Danh mục' , element: Trademark},
  {path:'/management/property',name: 'Màu sắc' , element: Property},
  {path:'/management/event',name: 'Sự kiện' , element: Event},
  {path: '/management/invoice', name: 'Hóa đơn', element: Invoice}

]

export default routes
