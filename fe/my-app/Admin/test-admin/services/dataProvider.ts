import {
  DataProvider,
  fetchUtils,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  DeleteManyParams,
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
  let url = `${apiUrl}`; // http://localhost:8000/api

  if (resource === 'users') {
    // TẤT CẢ các route cho 'users' đều nằm dưới '/admin'
    url += '/admin/users';
    if (id) {
      url += `/${id}`; // -> /api/admin/users/:id (cho getOne, update, delete)
    }
    // -> /api/admin/users (cho getList)
  } 
  else if (resource === 'recipes') {
    // TẤT CẢ các route cho 'recipes' đều nằm dưới '/'
    url += '/recipes';
    if (id) {
      url += `/${id}`; // -> /api/recipes/:id (cho getOne, create, update, delete)
    }
    // -> /api/recipes (cho getList, create)
  }
  else {
    // Logic dự phòng
    url += `/${resource}`;
    if (id) {
      url += `/${id}`;
    }
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
    let url = getResourceUrl(resource, params.id); 
    if (resource === 'users') {
      // Trỏ đến route public TỒN TẠI của backend
      url = `${apiUrl}/users/${params.id}`; 
    }
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

  // 1. Gọi httpClient nhưng không destructure 'json'
  //    Chúng ta cần lấy toàn bộ object 'response'
  //    (httpClient của bạn chính là fetchJson)
  const response = await httpClient(url, options);

  // 2. 'response' sẽ là một object { status, headers, body, json }
  //    Chúng ta kiểm tra 'status'
  
  if (response.status === 204) {
    // Nếu là 204 (No Content), đây LÀ XÓA THÀNH CÔNG.
    // Chúng ta phải trả về 'previousData' (bản ghi cũ)
    // để React Admin xác nhận việc xóa trên giao diện.
    return { data: params.previousData };
  }

  // 3. Nếu là 200 OK (hoặc mã khác có nội dung)
  //    Thì chúng ta mới đọc 'json'
  const res = response.json as SingleResponse<any> | null;
  return { data: res?.data || { id: params.id } };
},

  getMany: async () => Promise.resolve({ data: [] }),
  getManyReference: async () => Promise.resolve({ data: [], total: 0 }),
  updateMany: async () => Promise.resolve({ data: [] }),
  deleteMany: async (resource: string, params: DeleteManyParams) => {
    const { ids } = params;
    const token = localStorage.getItem('token');

    // Tạo một mảng các promise, mỗi promise là một lệnh 'fetch'
    const deletePromises = ids.map(async (id) => {
      const url = getResourceUrl(resource, id);
      
      // Chúng ta phải dùng 'fetch' trực tiếp,
      // vì 'httpClient' (fetchJson) sẽ lỗi với response 204
      const options: any = {
        method: 'DELETE',
        headers: new Headers({ 
          Accept: 'application/json' 
        }),
      };
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
      }
      
      const response = await fetch(url, options);
      // Nếu có lỗi (4xx, 5xx), ném lỗi
      if (!response.ok) {
        throw new Error(`Failed to delete item ${id}: ${response.statusText}`);
      }
      // Nếu thành công (200 hoặc 204), trả về id
      return id;
    });

    // Chờ tất cả các lệnh xoá hoàn thành
    const results = await Promise.all(deletePromises);
    
    // Trả về mảng các ID đã bị xoá thành công
    return { data: results };
  },
};