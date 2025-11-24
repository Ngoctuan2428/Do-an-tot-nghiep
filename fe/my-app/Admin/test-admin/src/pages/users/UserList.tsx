import { DataTable, DateField, EmailField, List, ReferenceField } from 'react-admin';

export const UserList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="username" />
            <DataTable.Col source="email">
                <EmailField source="email" />
            </DataTable.Col>
            <DataTable.Col source="avatar_url" />
            <DataTable.Col source="bio" />
            <DataTable.Col source="role" />
            <DataTable.Col source="provider" />
            <DataTable.Col source="provider_id">
                <ReferenceField source="provider_id" reference="providers" />
            </DataTable.Col>
            <DataTable.Col source="created_at">
                <DateField source="created_at" />
            </DataTable.Col>
            <DataTable.Col source="updated_at">
                <DateField source="updated_at" />
            </DataTable.Col>
        </DataTable>
    </List>
);