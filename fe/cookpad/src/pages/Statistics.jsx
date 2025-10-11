import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Statistics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto px-4">
        {/* Stats Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan</h2>
          <div className="space-y-4">
            {/* Mockup Chart - Thay bằng canvas/chart lib (Chart.js) nếu cần */}
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Biểu đồ nấu ăn (Thống kê số món nấu, thời gian, v.v.)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cookpad-orange/10 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Tổng món nấu</p>
                <p className="text-lg font-bold text-cookpad-orange">45</p>
              </div>
              <div className="bg-cookpad-orange/10 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Thời gian trung bình</p>
                <p className="text-lg font-bold text-cookpad-orange">30 phút</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
