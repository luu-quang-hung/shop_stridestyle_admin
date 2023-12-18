import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilSpeedometer,
  cilStar,
  cilClipboard,
  cilAddressBook,
  cilCart,
  cilPaw,
  cibEleventy,
  cilBank
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import "./scss/_nav.scss"
const _nav = [
  {
    component: CNavItem,
    name: 'Thống kê',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Bán hàng',
  },
  {
    component: CNavItem,
    name: 'Bán hàng tại quầy',
    to: '/sale-counter',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavTitle,
    name: 'Quản lý',
  },
  //management

  {
    component: CNavItem,
    name: 'Sản phẩm',
    to: '/management/product',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Danh mục',
    to: '/management/trademark',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Màu sắc',
    to: '/management/property',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Sự kiện',
    to: '/management/event',
    icon: <CIcon icon={cibEleventy} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Đơn hàng',
    to: '/management/order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Tài khoản',
    to: '/management/customer',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" ></CIcon>
  },



]

export default _nav
