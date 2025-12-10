// src/pages/RecipeStatistics.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getRecipeStats, getRecipeChart } from "../services/statsApi";

export default function RecipeStatistics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          getRecipeStats(id),
          getRecipeChart(id),
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
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  if (!stats)
    return <div className="text-center p-10">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <button
        onClick={() => navigate("/statistics")}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-4 transition"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="flex items-center gap-4 mb-8">
        <img
          src={stats.image_url}
          alt=""
          className="w-16 h-16 rounded-lg object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{stats.title}</h1>
          <p className="text-gray-500">Thống kê chi tiết</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Eye}
          label="Lượt xem"
          value={stats.total_views}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={Heart}
          label="Lượt thích"
          value={stats.total_likes}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          icon={Bookmark}
          label="Lượt lưu"
          value={stats.total_favorites}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          icon={MessageCircle}
          label="Bình luận"
          value={stats.total_comments}
          color="text-green-600"
          bg="bg-green-50"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Hiệu suất 7 ngày qua
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
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
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
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${bg} ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);
