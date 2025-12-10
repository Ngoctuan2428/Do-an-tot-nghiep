// src/components/Layout.tsx
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  LayoutProps,
} from "react-admin";
import { MyAppBar } from "./MyBarSide";

export const Layout = (props: LayoutProps) => (
  <RALayout
    {...props} // Truyền tất cả props (như menu, title) vào
    appBar={MyAppBar} // Chỉ định dùng AppBar tùy chỉnh
  >
    {props.children}
    <CheckForApplicationUpdate />
  </RALayout>
);
