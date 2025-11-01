// import type { ReactNode } from "react"; // Không cần nữa
import { Layout as RALayout, CheckForApplicationUpdate, LayoutProps } from "react-admin";
import { MyAppBar } from './MyBarSide'; // ✨ 1. Import AppBar tùy chỉnh

// ✨ 2. Sửa props từ { children } thành props: LayoutProps
export const Layout = (props: LayoutProps) => (
  <RALayout
    {...props}          // ✨ 3. Truyền tất cả props (như menu, title) vào
    appBar={MyAppBar}   // ✨ 4. Chỉ định dùng AppBar tùy chỉnh
  >
    {props.children}    {/* Lấy children từ props */}
    <CheckForApplicationUpdate />
  </RALayout>
);