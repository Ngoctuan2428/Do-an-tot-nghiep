// src/components/MyBarSide.tsx
import { AppBar, TitlePortal, UserMenu, AppBarProps } from "react-admin";
import { Box } from "@mui/material";
import { MyLogoutMenuItem } from "./MyLogoutButon";

export const MyAppBar = (props: AppBarProps) => (
  <AppBar className={props.className} color="inherit" userMenu={false}>
    <TitlePortal />
    <Box flex="1" />
    <UserMenu>
      <MyLogoutMenuItem />
    </UserMenu>
  </AppBar>
);
