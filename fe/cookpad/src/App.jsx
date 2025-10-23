import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import RecipesLayout from './pages/Recipes/RecipesLayout';
import AllRecipes from './pages/Recipes/AllRecipes';
import SavedRecipes from './pages/Recipes/SavedRecipes';
import CookedRecipes from './pages/Recipes/CookedRecipes';
import MyRecipes from './pages/Recipes/MyRecipes';
import PublishedRecipes from './pages/Recipes/PublishedRecipes';
import DraftRecipes from './pages/Recipes/DraftRecipes';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import SearchDetail from './pages/SearchDetail';
import Statistics from './pages/Statistics';
import User from './pages/User';
import Interactions from './pages/Interactions';
import Premium from './pages/Premium';
import Challenges from './pages/Challenges';
import RecipeDetail from './pages/RecipeDetail';
import UserProfileEmpty from './pages/UserProfileEmpty';
import CreateRecipe from './pages/CreateRecipe';
import Sidebar from './components/Sidebar';
import ChallengeDetail from './components/ChallengeDetail';

function App() {
  return (
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
            <Route
              path="/challenge/:challengeSlug"
              element={<ChallengeDetail />}
            />

            <Route path="/premium" element={<Premium />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/profile" element={<UserProfileEmpty />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
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
