import { Admin, Resource, CustomRoutes } from "react-admin"; // Import CustomRoutes
import { Layout } from "./components/Layout";
import { dataProvider } from "../services/dataProvider";
import PersonIcon from "@mui/icons-material/Person";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import { HomePage } from "./pages/HomePage";
import { authProvider } from "../services/authProvider";
import { RecipeList } from "./pages/recipes/RecipesList";
import { RecipeShow } from "./pages/recipes/RecipeShow";
import { RecipeEdit } from "./pages/recipes/RecipeEdit";
import { UserList } from "./pages/users/UserList";
import { QueryClient } from "@tanstack/react-query";
import "./mylogout.css";
import { UserEdit } from "./pages/users/UserEdit";
import { UserShow } from "./pages/users/UserShow";
import { RecipeCreate } from "./pages/recipes/RecipeCreate";
import { ChallengeList } from "./pages/challenges/ChallengeList";
import { ChallengeCreate } from "./pages/challenges/ChallengeCreate";
import { ChallengeEdit } from "./pages/challenges/ChalengeEdit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { Route } from "react-router-dom"; // Import Route
import { LoginSSO } from "./pages/LoginSSO"; // Import trang vừa tạo

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error.status === 401 || error.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
export const App = () => {
  return (
    <Admin
      layout={Layout}
      dataProvider={dataProvider}
      dashboard={HomePage}
      authProvider={authProvider}
      queryClient={queryClient}
    >
      <CustomRoutes noLayout>
        <Route path="/login-sso" element={<LoginSSO />} />
      </CustomRoutes>
      <Resource
        icon={PersonIcon}
        name="users"
        list={UserList}
        show={UserShow}
        edit={UserEdit}
      />
      <Resource
        icon={InventoryTwoToneIcon}
        name="recipes"
        list={RecipeList}
        show={RecipeShow}
        edit={RecipeEdit}
        create={RecipeCreate}
      />
      <Resource
        icon={EmojiEventsIcon}
        name="challenges"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
      />
    </Admin>
  );
};
