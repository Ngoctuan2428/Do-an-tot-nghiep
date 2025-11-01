// src/MyBarSide.tsx

import { AppBar, TitlePortal, UserMenu, AppBarProps } from 'react-admin'; // 1. Import AppBarProps
import { Box } from '@mui/material';
import { MyLogoutMenuItem } from './MyLogoutButon'; // Đường dẫn import này đã đúng

// Tạo một AppBar tùy chỉnh
export const MyAppBar = (props: AppBarProps) => (
  // 2. XÓA {...props}
  // Chỉ truyền 'className' (để giữ layout) và 'color'
  <AppBar className={props.className} color="inherit" userMenu={false}>
    <TitlePortal />
    <Box flex="1" />
    <UserMenu>
      <MyLogoutMenuItem />
    </UserMenu>
  </AppBar>
);