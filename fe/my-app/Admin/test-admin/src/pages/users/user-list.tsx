import { DataTable, EmailField, List } from 'react-admin';

const UserList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="username" />
            <DataTable.Col source="email">
                <EmailField source="email" />
            </DataTable.Col>
            <DataTable.Col source="address.street" />
            <DataTable.Col source="phone" />
            <DataTable.Col source="company.name" />
        </DataTable>
    </List>
);

export default UserList;