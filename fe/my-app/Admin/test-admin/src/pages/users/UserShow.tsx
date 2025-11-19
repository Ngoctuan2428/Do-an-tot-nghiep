import { DateField, EmailField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="avatar_url" />
            <TextField source="bio" />
            <TextField source="role" />
            <TextField source="provider" />
            <ReferenceField source="provider_id" reference="providers" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
        </SimpleShowLayout>
    </Show>
);