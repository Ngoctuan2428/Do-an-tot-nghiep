import {
    Edit,
    SimpleForm,
    TextInput,
    DateTimeInput,
    SelectInput,
    required,
  } from 'react-admin';
  
  // Dùng lại choices từ List
  const challengeStatusChoices = [
      { id: 'upcoming', name: 'Sắp diễn ra' },
      { id: 'active', name: 'Đang diễn ra' },
      { id: 'ended', name: 'Đã kết thúc' },
  ];
  
  export const ChallengeEdit = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="title" label="Tên thử thách" validate={required()} fullWidth />
        <TextInput source="description" label="Mô tả" multiline fullWidth />
        <DateTimeInput source="start_date" label="Ngày bắt đầu" />
        <DateTimeInput source="end_date" label="Ngày kết thúc" />
        <SelectInput 
          source="status" 
          label="Trạng thái" 
          choices={challengeStatusChoices} 
          validate={required()}
        />
      </SimpleForm>
    </Edit>
  );