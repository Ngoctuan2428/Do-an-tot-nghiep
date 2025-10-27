import { BooleanField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

const TodoShow = () => (
    <Show>
        <SimpleShowLayout>
            <ReferenceField source="userId" reference="users" />
            <TextField source="id" />
            <TextField source="title" />
            <BooleanField source="completed" />
        </SimpleShowLayout>
    </Show>
);
export default TodoShow;