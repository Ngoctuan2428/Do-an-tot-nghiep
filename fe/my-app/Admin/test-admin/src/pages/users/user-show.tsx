import { EmailField, Show, SimpleShowLayout, TextField } from 'react-admin';

const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="phone" />
            <TextField source="company.name" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;