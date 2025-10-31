import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    required,
  } from 'react-admin';
  
  export const RecipeEdit = () => (
    <Edit>
      <SimpleForm>
        {/* Chúng ta thường disable trường 'id'
          hoặc dùng <TextField source="id" /> 
        */}
        <TextInput source="id" disabled />
  
        <TextInput source="title" validate={required()} fullWidth />
        <TextInput source="slug" fullWidth />
        <TextInput source="description" multiline fullWidth />
        <TextInput source="image_url" fullWidth />
        <TextInput source="servings" />
  
        {/* Dùng <ArrayInput> để xử lý mảng object
          Đây là phần quan trọng nhất
        */}
        <ArrayInput source="ingredients" label="Ingredients">
          <SimpleFormIterator>
            <TextInput source="name" label="Tên nguyên liệu" />
            <TextInput source="amount" label="Số lượng" />
          </SimpleFormIterator>
        </ArrayInput>
  
        <ArrayInput source="steps" label="Steps">
          <SimpleFormIterator>
            <NumberInput source="step" label="Bước số" />
            <TextInput source="instruction" label="Hướng dẫn" multiline fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
  
        {/* Các trường còn lại */}
        <SelectInput
          source="difficulty"
          choices={[
            { id: 'Dễ', name: 'Dễ' },
            { id: 'Trung bình', name: 'Trung bình' },
            { id: 'Khó', name: 'Khó' },
          ]}
        />
        
        <SelectInput
          source="status"
          choices={[
            { id: 'public', name: 'Public' },
            { id: 'private', name: 'Private' },
            { id: 'draft', name: 'Draft' },
          ]}
        />
        
        <ReferenceInput source="user_id" reference="users">
          {/* Giả sử bạn có resource "users" */}
          <SelectInput optionText="username" disabled />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );