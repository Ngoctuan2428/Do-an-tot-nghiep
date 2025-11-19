import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractionItem from '../components/InteractionItem';

const interactions = [
  { id: 1, user: 'Nguyen Van A', action: 'Thích món Phở', time: '2h ago' },
  { id: 2, user: 'Tran Thi B', action: 'Bình luận: Ngon quá!', time: '5h ago' },
  { id: 3, user: 'Le Van C', action: 'Đã lưu công thức', time: '1d ago' },
];

export default function Interactions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Interactions Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Tương tác</h2>
          <ul className="space-y-4">
            {interactions.map((interaction) => (
              <InteractionItem
                key={interaction.id}
                user={interaction.user}
                action={interaction.action}
                time={interaction.time}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
