import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
// Import component xử lý mới
import LoginSuccessHandler from './components/LoginSuccessHandler'; 
// ... các imports khác ...
import RecipesLayout from './pages/Recipes/RecipesLayout';
import AllRecipes from './pages/Recipes/AllRecipes';
import SavedRecipes from './pages/Recipes/SavedRecipes';
// ... (Các imports khác giữ nguyên)
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import SearchDetail from './pages/SearchDetail';
import Statistics from './pages/Statistics';
import User from './pages/User';
import Interactions from './pages/Interactions';
import DetailInteraction from './pages/DetailInteraction';
import Premium from './pages/Premium';
import Challenges from './pages/Challenges';
import RecipeDetail from './pages/RecipeDetail';
import UserProfileEmpty from './pages/UserProfileEmpty';
import CreateRecipe from './pages/CreateRecipe';
import Setting from './pages/Setting';
import AllSetting from './pages/Settings/AllSetting';
import Account from './pages/Settings/Account';
import Blocked from './pages/Settings/Blocked';
import DeleteAccount from './pages/Settings/DeleteAccount';
import Notification from './pages/Settings/Notification';
import Policy from './pages/Settings/Policy';
import Faq from './pages/Settings/Faq';
import Feedback from './pages/Settings/Feedback';
import Sidebar from './components/Sidebar';
import DraftRecipes from './pages/Recipes/DraftRecipes';
import MyRecipes from './pages/Recipes/MyRecipes';
import PublishedRecipes from './pages/Recipes/PublishedRecipes';
import CookedRecipes from './pages/Recipes/CookedRecipes';


function App() {
  return (
    <Router>
      <div className="flex flex-col-reverse md:flex-col lg:flex-row min-h-screen bg-gray-50 relative">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full lg:w-auto min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* ✅ ROUTE MỚI ĐỂ XỬ LÝ TOKEN SAU KHI ĐĂNG NHẬP GOOGLE */}
            <Route path="/login-success" element={<LoginSuccessHandler />} /> 
            
            <Route path="/search" element={<Search />} />
            <Route path="/search/:query" element={<SearchDetail />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/detail-interaction" element={<DetailInteraction />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/profile" element={<UserProfileEmpty />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            
            <Route path="/setting" element={<Setting />}>
              <Route index path="" element={<AllSetting />} />
              <Route path="account" element={<Account />} />
              <Route path="blocked" element={<Blocked />} />
              <Route path="delete-account" element={<DeleteAccount />} />
              <Route path="notification" element={<Notification />} />
              <Route path="policy" element={<Policy />} />
              <Route path="faq" element={<Faq />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="drafts" element={<DraftRecipes />} />
            </Route>

            <Route path="/recipes" element={<RecipesLayout />}>
              <Route index path="all" element={<AllRecipes />} />
              <Route path="saved" element={<SavedRecipes />} />
              <Route path="cooked" element={<CookedRecipes />} />
              <Route path="mine" element={<MyRecipes />} />
              <Route path="published" element={<PublishedRecipes />} />
              <Route path="drafts" element={<DraftRecipes />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;