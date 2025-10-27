import { DataTable, List, ReferenceField, EditButton, TextInput, ReferenceInput } from 'react-admin';

const PostList = () => {
    const postFilter = [
        <TextInput source='q' label="Search" alwaysOn />,
        <ReferenceInput source='userId' label="User" reference='users' />,
    ];
    return (
        <List filters={postFilter}>
            <DataTable
                sx={{
                    '.RaDataTable-headerCell': {
                        padding: "16px",
                    }
                }}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="body" />
                <DataTable.Col source="userId">
                    <ReferenceField source="userId" reference="users" />
                </DataTable.Col>
                <DataTable.Col>
                    <EditButton />
                </DataTable.Col>
            </DataTable>
        </List>
    );
}
export default PostList;