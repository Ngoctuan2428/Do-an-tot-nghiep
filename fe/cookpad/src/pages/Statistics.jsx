import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Loader2,
  ChefHat,
  ArrowRight,
  Eye,
  Heart,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getMyStats, getMyChart } from '../services/statsApi';
import { getMyRecipes } from '../services/recipeApi';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes, recipesRes] = await Promise.all([
          getMyStats(),
          getMyChart(),
          getMyRecipes(),
        ]);

        setStats(statsRes.data.data);

        const formattedChart = (chartRes.data.data || []).map((item) => {
          const date = new Date(item.date);
          return {
            ...item,
            displayDate: `${date.getDate()}/${date.getMonth() + 1}`,
          };
        });
        setChartData(formattedChart);
        setRecipes(recipesRes.data.data.rows || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-orange-500" /> Thống kê Bếp
          </h1>
        </div>

        {/* --- PHẦN 1: TỔNG QUAN --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Tổng lượt xem</p>
            <h3 className="text-3xl font-bold">{stats?.total_views || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Tổng lượt thích</p>
            <h3 className="text-3xl font-bold">{stats?.total_likes || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Lượt lưu</p>
            <h3 className="text-3xl font-bold">
              {stats?.total_favorites || 0}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Bình luận</p>
            <h3 className="text-3xl font-bold">{stats?.total_comments || 0}</h3>
          </div>
        </div>

        {/* Biểu đồ tổng quan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="font-bold mb-4 flex gap-2">
            <TrendingUp size={20} /> Tổng lượt xem tuần qua
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- PHẦN 2: DANH SÁCH MÓN ĂN --- */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              {/* ✅ ChefHat được sử dụng ở đây */}
              <ChefHat size={20} className="text-orange-500" />
              Chi tiết từng món ăn
            </h2>
          </div>

          <div className="divide-y">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe.image_url}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border bg-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {recipe.title}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {recipe.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} /> {recipe.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/statistics/recipes/${recipe.id}`}
                    className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 flex items-center gap-1"
                  >
                    Xem biểu đồ <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Bạn chưa có món ăn nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
