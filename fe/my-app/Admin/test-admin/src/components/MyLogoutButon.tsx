// src/components/MyLogoutButon.tsx (hoặc đổi tên thành MyLogoutMenuItem.tsx)

import * as React from 'react';
import { MenuItem } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useLogout } from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';

// Dùng forwardRef để React Admin có thể truyền props vào
export const MyLogoutMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<typeof MenuItem>
>((props, ref) => {
  const queryClient = useQueryClient();
  const logout = useLogout();

  const handleClick = () => {
    // 1. HỦY TẤT CẢ CÁC API ĐANG CHẠY (Fix lỗi 401)
    queryClient.cancelQueries();
    
    // 2. SAU ĐÓ MỚI GỌI LOGOUT
    logout({}, undefined, false); 
  };

  return (
    // Đây là một MenuItem, không phải Button
    <MenuItem
      onClick={handleClick}
      ref={ref}
      {...props} // Truyền props (như onClick của UserMenu)
    >
      <ExitToAppIcon sx={{ marginRight: 1 }} />
      Logout
    </MenuItem>
  );
});