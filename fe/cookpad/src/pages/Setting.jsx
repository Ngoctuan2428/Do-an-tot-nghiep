import SettingItem from '../components/SettingItem';
// import { useNavigate } from 'react-router-dom';
import { Outlet, NavLink } from 'react-router-dom';

export default function Setting() {
  return (
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  );
}
