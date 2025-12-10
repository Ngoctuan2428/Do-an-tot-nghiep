// src/pages/users/UserEdit.tsx
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  SelectInput,
} from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      {/* Hiển thị ID nhưng không cho sửa */}
      <TextInput source="id" disabled />
      <TextInput source="username" validate={required()} />

      <SelectInput
        source="role"
        validate={required()}
        choices={[
          { id: "admin", name: "Admin" },
          { id: "user", name: "User" },
        ]}
      />

      <TextInput source="bio" multiline fullWidth />
    </SimpleForm>
  </Edit>
);
