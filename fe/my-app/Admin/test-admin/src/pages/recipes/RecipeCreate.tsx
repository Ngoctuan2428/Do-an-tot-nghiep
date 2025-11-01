import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    required,
  } from 'react-admin';
  
  export const RecipeCreate = () => (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={required()} fullWidth />
        <TextInput source="description" multiline fullWidth />
        <TextInput source="image_url" fullWidth />
        <TextInput source="servings" />
  
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
  
        <SelectInput
          source="difficulty"
          defaultValue="Dễ" // Đặt giá trị mặc định
          choices={[
            { id: 'Dễ', name: 'Dễ' },
            { id: 'Trung bình', name: 'Trung bình' },
            { id: 'Khó', name: 'Khó' },
          ]}
        />
        
        <SelectInput
          source="status"
          defaultValue="draft" // Đặt giá trị mặc định
          choices={[
            { id: 'public', name: 'Public' },
            { id: 'private', name: 'Private' },
            { id: 'draft', name: 'Draft' },
          ]}
        />
      </SimpleForm>
    </Create>
  );