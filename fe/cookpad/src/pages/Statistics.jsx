// src/pages/Statistics.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Loader2,
  ChefHat,
  ArrowRight,
  Eye,
  Heart,
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
import { getMyStats, getMyChart } from "../services/statsApi";
import { getMyRecipes } from "../services/recipeApi";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format số (VD: 1000 -> 1.000)
  const formatNumber = (num) => {
    return (num || 0).toLocaleString("vi-VN");
  };

  // Helper: Tự động điền dữ liệu cho 7 ngày gần nhất (để biểu đồ luôn đẹp)
  const fillMissingDays = (apiData = []) => {
    const days = [];
    const today = new Date();
    
    // Tạo map để tra cứu nhanh dữ liệu từ API
    const dataMap = {};
    apiData.forEach((item) => {
      const d = new Date(item.date);
      // Key dạng: "7/1", "8/1"...
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      dataMap[key] = item.count; 
    });

    // Tạo mảng 7 ngày ngược về quá khứ
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;

      days.push({
        displayDate: key,     
        count: dataMap[key] || 0, // Nếu không có dữ liệu thì mặc định là 0
        rawDate: d            
      });
    }
    return days;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes, recipesRes] = await Promise.all([
          getMyStats(),
          getMyChart(),
          getMyRecipes(),
        ]);

        setStats(statsRes.data.data);

        // 1. Xử lý biểu đồ: Dùng hàm fillMissingDays
        const rawChartData = chartRes.data.data || [];
        const fullWeekData = fillMissingDays(rawChartData);
        setChartData(fullWeekData);

        // 2. Xử lý danh sách món
        const listRecipes = recipesRes.data.data.rows || [];
        
        // LOG KIỂM TRA: Bạn mở F12 xem dòng này để biết tên chính xác của biến lượt xem là gì
        if (listRecipes.length > 0) {
            console.log("Check dữ liệu món ăn đầu tiên:", listRecipes[0]);
        }
        
        setRecipes(listRecipes);

      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
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
            <h3 className="text-3xl font-bold">
              {formatNumber(stats?.total_views)}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Tổng lượt thích</p>
            <h3 className="text-3xl font-bold">
              {formatNumber(stats?.total_likes)}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Lượt lưu</p>
            <h3 className="text-3xl font-bold">
              {formatNumber(stats?.total_favorites)}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Bình luận</p>
            <h3 className="text-3xl font-bold">
              {formatNumber(stats?.total_comments)}
            </h3>
          </div>
        </div>

        {/* --- PHẦN 2: BIỂU ĐỒ --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="font-bold mb-6 flex gap-2 items-center text-gray-800">
            <TrendingUp size={20} className="text-orange-500" /> 
            Tổng lượt xem 7 ngày qua
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#ea580c", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Lượt xem"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                  activeDot={{ r: 6, fill: "#ea580c", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- PHẦN 3: DANH SÁCH MÓN ĂN --- */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <ChefHat size={20} className="text-orange-500" />
              Chi tiết từng món ăn
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe.image_url || "https://placehold.co/100x100?text=No+Image"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=Error";
                      }}
                      alt={recipe.title}
                      className="w-16 h-16 rounded-lg object-cover border bg-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {recipe.title}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        
                        {/* --- SỬA LỖI HIỂN THỊ VIEW Ở ĐÂY --- */}
                        <span className="flex items-center gap-1" title="Lượt xem">
                          <Eye size={14} /> 
                          {/* Kiểm tra nhiều trường hợp tên biến: view_count, views, total_views */}
                          {formatNumber(recipe.view_count || recipe.views || recipe.total_views || 0)}
                        </span>

                        <span className="flex items-center gap-1" title="Lượt thích">
                          <Heart size={14} /> 
                          {formatNumber(recipe.likes || recipe.total_likes || 0)}
                        </span>

                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/statistics/recipes/${recipe.id}`}
                    className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 flex items-center gap-1 transition-colors"
                  >
                    Xem biểu đồ <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                <ChefHat className="w-12 h-12 text-gray-300 mb-2" />
                <p>Bạn chưa đăng tải món ăn nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}