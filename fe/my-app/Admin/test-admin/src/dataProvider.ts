import {
  DataProvider,
  fetchUtils,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
} from 'react-admin';

const apiUrl = 'http://localhost:8000/api'; 
const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem('token');

  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

const getResourceUrl = (resource: string, id: string | number | null = null) => {
  let url = `${apiUrl}`;

  if (resource === 'users') {
    url += '/admin/users';
  } else {
    url += `/${resource}`;
  }

  if (id) {
    url += `/${id}`;
  }

  return url;
};

interface ListResponse<T> {
  status?: string;
  data: {
    count: number;
    rows: T[];
  };
}

interface SingleResponse<T> {
  status?: string;
  data: T;
}

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};

    const query = {
      page,
      limit: perPage,
      _sort: field,
      _order: order,
      ...params.filter,
    };

    const baseUrl = getResourceUrl(resource); 
    const url = `${baseUrl}?${fetchUtils.queryParameters(query)}`;

    const { json } = await httpClient(url);
    const res = json as ListResponse<any>;
    return {
      data: res.data?.rows ?? [],
      total: res.data?.count ?? 0,
    };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const url = getResourceUrl(resource, params.id); 
    const { json } = await httpClient(url); 
    const res = json as SingleResponse<any>;
    return { data: res.data };
  },

  create: async (resource: string, params: CreateParams) => {
    const url = getResourceUrl(resource); 
    const options = {
      method: 'POST',
      body: JSON.stringify(params.data),
    };
    const { json } = await httpClient(url, options); 
    const res = json as SingleResponse<any>;
    return { data: res.data };
  },

  update: async (resource: string, params: UpdateParams) => {
    const url = getResourceUrl(resource, params.id); 
    const options = {
      method: 'PATCH', 
      body: JSON.stringify(params.data),
    };
    const { json } = await httpClient(url, options); 
    const res = json as SingleResponse<any>;
    return { data: res.data };
  },

  delete: async (resource: string, params: DeleteParams) => {
    const url = getResourceUrl(resource, params.id);
    const options = { method: 'DELETE' };
    const { json } = await httpClient(url, options); 
    const res = json as SingleResponse<any> | null;
    return { data: res?.data || { id: params.id } };
  },

  getMany: async () => Promise.resolve({ data: [] }),
  getManyReference: async () => Promise.resolve({ data: [], total: 0 }),
  updateMany: async () => Promise.resolve({ data: [] }),
  deleteMany: async () => Promise.resolve({ data: [] }),
};