import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import PostList from "./pages/posts/post-list";
import PostEdit from "./pages/posts/post-edit";
import PostCreate from "./pages/posts/post-create";
import PostShow from "./pages/posts/post-show";
import TodoList from "./pages/todos/todo-list";
import TodoShow from "./pages/todos/todo-show";
import UserShow from "./pages/users/user-show";
import UserList from "./pages/users/user-list";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import { HomePage } from "./homepage";
import { authProvider } from "./authProvider";
import "./mylogout.css";

export const App = () => {
  return (
    <Admin
      layout={Layout}
      dataProvider={dataProvider}
      dashboard={HomePage}
      authProvider={authProvider}
    >
      <Resource
        icon={PersonIcon}
        name="users"
        list={UserList}
        show={UserShow} />
      <Resource
        name="recipes"
        list={TodoList}
        show={TodoShow} />
    </Admin>
  );
}