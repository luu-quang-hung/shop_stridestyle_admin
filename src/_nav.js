import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilSpeedometer,
  cilStar,
  cilClipboard,
  cilAddressBook,
  cilCart,
  cilPaw
} from '@coreui/icons';import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import "./scss/_nav.scss"
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Management',
  },

  //management

  {
    component: CNavItem,
    name: 'Product',
    to: '/management/product',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Trademark',
    to: '/management/trademark',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/management/order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" ></CIcon>
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/management/customer',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" ></CIcon>
  },


  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
]

export default _nav
