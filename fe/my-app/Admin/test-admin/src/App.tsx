import { Admin, Resource, ListGuesser, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import PersonIcon from "@mui/icons-material/Person";
import { HomePage } from "./homepage";
import { authProvider } from "./authProvider";
import { RecipeList } from "./pages/recipes/RecipesList";
import { RecipeShow } from "./pages/recipes/RecipeShow";
import { RecipeEdit } from "./pages/recipes/RecipeEdit";
import { UserList } from "./pages/users/UserList";
import { QueryClient } from "@tanstack/react-query";
import "./mylogout.css";

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
      <Resource
        icon={PersonIcon}
        name="users"
        list={UserList}
        show={ShowGuesser} />
      <Resource
        name="recipes"
        list={RecipeList}
        show={RecipeShow} 
        edit={RecipeEdit}
        />
    </Admin>
  );
}