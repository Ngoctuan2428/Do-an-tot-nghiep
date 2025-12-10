import {
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  SelectInput,
  required,
} from "react-admin";

const challengeStatusChoices = [
  { id: "upcoming", name: "Sắp diễn ra" },
  { id: "active", name: "Đang diễn ra" },
  { id: "ended", name: "Đã kết thúc" },
];

export const ChallengeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="title"
        label="Tên thử thách"
        validate={required()}
        fullWidth
      />
      <TextInput
        source="hashtag"
        label="Hashtag (vd: #monngon)"
        validate={required()}
        fullWidth
      />
      <TextInput source="description" label="Mô tả" multiline fullWidth />
      <TextInput source="image_url" label="Link ảnh bìa" fullWidth />
      <DateTimeInput source="start_date" label="Ngày bắt đầu" />
      <DateTimeInput source="end_date" label="Ngày kết thúc" />
      <SelectInput
        source="status"
        label="Trạng thái"
        choices={challengeStatusChoices}
        defaultValue="upcoming"
        validate={required()}
      />
    </SimpleForm>
  </Create>
);
