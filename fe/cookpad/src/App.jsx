import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import RecipesLayout from "./pages/Recipes/RecipesLayout";
import AllRecipes from "./pages/Recipes/AllRecipes";
import SavedRecipes from "./pages/Recipes/SavedRecipes";
import CookedRecipes from "./pages/Recipes/CookedRecipes";
import MyRecipes from "./pages/Recipes/MyRecipes";
import PublishedRecipes from "./pages/Recipes/PublishedRecipes";
import DraftRecipes from "./pages/Recipes/DraftRecipes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SearchDetail from "./pages/SearchDetail";
import Statistics from "./pages/Statistics";
import User from "./pages/User";
import Interactions from "./pages/Interactions";
import Premium from "./pages/Premium";
import Challenges from "./pages/Challenges";
import RecipeDetail from "./pages/RecipeDetail";
import UserProfile from "./pages/UserProfile";
import CreateRecipe from "./pages/CreateRecipe";
import Sidebar from "./components/Sidebar";
import ChallengeDetail from "./components/ChallengeDetail";
import Chatbox from "./components/Chatbox";
import LoginCallback from "./pages/LoginCallback";
import { RecipeCountProvider } from "./contexts/RecipeCountContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CooksnapList from "./pages/CooksnapList";
import CooksnapDetail from "./pages/CooksnapDetail"; // ✅ Import trang mới
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RecipeStatistics from "./pages/RecipeStatistics"; // Import

function App() {
  return (
    <RecipeCountProvider>
      <Router>
        <div className="flex flex-col-reverse md:flex-col lg:flex-row min-h-screen bg-gray-50 relative">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full lg:w-auto min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:query" element={<SearchDetail />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:hashtag" element={<ChallengeDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/interactions" element={<Interactions />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/setting/account" element={<UserProfile />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/recipes/:id/cooksnaps" element={<CooksnapList />} />
              <Route path="/cooksnaps/:id" element={<CooksnapDetail />} />
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/login-success" element={<LoginCallback />} />
              <Route path="/recipes" element={<RecipesLayout />}>
                <Route index path="all" element={<AllRecipes />} />
                <Route path="saved" element={<SavedRecipes />} />
                <Route path="cooked" element={<CookedRecipes />} />
                <Route path="mine" element={<MyRecipes />} />
                <Route path="published" element={<PublishedRecipes />} />
                <Route path="drafts" element={<DraftRecipes />} />
              </Route>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:id/:token"
                element={<ResetPassword />}
              />
              <Route path="/statistics" element={<Statistics />} />
              <Route
                path="/statistics/recipes/:id"
                element={<RecipeStatistics />}
              />
            </Routes>
            <Footer />
          </div>
        </div>
        <Chatbox />
      </Router>
    </RecipeCountProvider>
  );
}

export default App;
