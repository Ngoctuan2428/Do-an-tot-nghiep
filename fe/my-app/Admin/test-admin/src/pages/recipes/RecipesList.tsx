import {
    List,
    Datagrid,
    TextField,
    NumberField,
    UrlField,
    DateField,
    ReferenceField,
  } from "react-admin";
  
  // Hàm nhỏ giúp hiển thị mảng dạng chuỗi
  const ArrayToStringField = ({ source, record = {} }: any) => {
    const value = record[source];
    if (!value) return null;
  
    try {
      const arr = typeof value === "string" ? JSON.parse(value) : value;
      return <span>{Array.isArray(arr) ? arr.join(", ") : String(arr)}</span>;
    } catch {
      return <span>{String(value)}</span>;
    }
  };
  
  export const RecipeList = () => (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="slug" />
        <TextField source="description" />
  
        <NumberField source="servings" />
  
        <UrlField source="image_url" />
  
        <NumberField source="likes" />
        <NumberField source="views" />
  
        <TextField source="difficulty" />
        <TextField source="status" />
  
        <DateField source="created_at" showTime />
        <DateField source="updated_at" showTime />
  
        <TextField source="User.username" label="User" />
      </Datagrid>
    </List>
  );
  