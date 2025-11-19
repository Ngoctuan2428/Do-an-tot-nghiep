import { useNavigate } from 'react-router-dom';

const InteractionItem = ({ user, action, time }) => {
  const navigate = useNavigate();

  return (
    <li className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
        <div className="p-2">
          <p className="text-sm font-medium text-gray-900">{user}</p>
          <p className="text-sm text-gray-600">{action}</p>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </li>
  );
};

export default InteractionItem;
