import { DataTable, List, ReferenceField } from 'react-admin';

const TodoList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users" />
            </DataTable.Col>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
        </DataTable>
    </List>
);

export default TodoList;