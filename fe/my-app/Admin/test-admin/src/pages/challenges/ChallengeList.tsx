import {
    List,
    Datagrid,
    TextField,
    DateField,
    SelectField,
    EditButton,
    DeleteButton,
  } from 'react-admin';
  
  const challengeStatusChoices = [
      { id: 'upcoming', name: 'Sắp diễn ra' },
      { id: 'active', name: 'Đang diễn ra' },
      { id: 'ended', name: 'Đã kết thúc' },
  ];
  
  export const ChallengeList = () => (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" label="Tên thử thách" />
        <TextField source="description" label="Mô tả" />
        <DateField source="start_date" label="Ngày bắt đầu" showTime />
        <DateField source="end_date" label="Ngày kết thúc" showTime />
        <SelectField 
          source="status" 
          label="Trạng thái" 
          choices={challengeStatusChoices} 
        />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );