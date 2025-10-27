// RecipesLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

export default function RecipesLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      {/* <aside className="w-64 p-4 border-r">
        <h2 className="font-bold mb-4">Kho Món Ngon Của Bạn</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/recipes" end>
            {' '}
            Tất cả{' '}
          </NavLink>
          <NavLink to="/recipes/saved"> Đã Lưu </NavLink>
          <NavLink to="/recipes/cooked"> Đã Nấu </NavLink>
          <NavLink to="/recipes/mine"> Món Của Tôi </NavLink>
          <NavLink to="/recipes/published"> Đã Lên Sóng </NavLink>
          <NavLink to="/recipes/drafts"> Món Nháp </NavLink>
        </nav>
      </aside> */}

      {/* Nội dung trang con */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
