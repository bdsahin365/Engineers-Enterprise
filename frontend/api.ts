
import { Product, Order, Customer, BlogPost, CategoryItem, HomepageData, GlobalData } from './types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || '';
const API_BASE = `${STRAPI_URL}/api`;

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
};


/**
 * Utility to flatten Strapi v4/v5 response structure
 * From { id, attributes: { ... } } to { id, ...attributes }
 */
const flattenData = (data: any): any => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map(item => flattenData(item));
  }

  const id = data.id;
  const attributes = data.attributes || data;

  const flattened: any = { id: id ? id.toString() : undefined };

  for (const key in attributes) {
    const value = attributes[key];

    // Handle nested data structures (like images or relations)
    if (value && typeof value === 'object' && 'data' in value) {
      if (Array.isArray(value.data)) {
        flattened[key] = value.data.map((item: any) => {
          // Special case for Strapi images
          if (item.attributes?.url) {
            const url = item.attributes.url;
            return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
          }
          return flattenData(item);
        });
      } else if (value.data !== null) {
        // Single media field (like logo, heroImage)
        if (value.data.attributes?.url) {
          const url = value.data.attributes.url;
          flattened[key] = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
        } else {
          flattened[key] = flattenData(value.data);
        }
      } else {
        flattened[key] = null;
      }
    }
    // Handle already-flattened media (Strapi sometimes returns flat objects with url property)
    else if (value && typeof value === 'object' && value.url && typeof value.url === 'string') {
      // This is an already-flattened image object
      const url = value.url;
      flattened[key] = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    }
    else {
      flattened[key] = value;
    }
  }

  return flattened;
};

export const api = {
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${STRAPI_URL}/admin`, { method: 'HEAD' });
      // HEAD might not work for all setups due to CORS, but GET to root or admin usually gives something.
      // Better yet, try a public API endpoint if available, but /admin check is a reasonable proxy for "server up".
      // Alternatively, just checking if fetch throws a network error is enough for "is running".
      return response.ok || response.status === 200 || response.status === 401 || response.status === 403;
    } catch (e) {
      return false;
    }
  },

  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload file');
    const json = await response.json();
    const uploadedFile = json[0];

    // Return full URL
    return uploadedFile.url.startsWith('http')
      ? uploadedFile.url
      : `${STRAPI_URL}${uploadedFile.url}`;
  },

  uploadFileAndGetId: async (file: File): Promise<number> => {
    const formData = new FormData();
    formData.append('files', file);

    const headers: HeadersInit = {};
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }
    // Note: Do not set Content-Type for FormData, browser sets it with boundary

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload file');
    }
    const json = await response.json();
    return json[0].id;
  },



  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products?populate=*`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const json = await response.json();
    const flattened = flattenData(json.data);
    console.log('Products from API:', flattened); // DEBUG
    return flattened;
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: product }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create product');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data: product }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update product');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const headers = getHeaders();
    // @ts-ignore
    delete headers['Content-Type']; // DELETE usually doesn't have body/content-type

    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: headers
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete product');
    }
  },

  getBlogs: async (): Promise<BlogPost[]> => {
    const response = await fetch(`${API_BASE}/blog-posts?populate=*`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    const json = await response.json();
    return flattenData(json.data);
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE}/blog-posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: post }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create blog post');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  updateHomepage: async (data: Partial<HomepageData>): Promise<HomepageData> => {
    const response = await fetch(`${API_BASE}/homepage`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update homepage');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  updateGlobal: async (data: Partial<GlobalData>): Promise<GlobalData> => {
    const response = await fetch(`${API_BASE}/global`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update global settings');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  createCategory: async (category: Partial<CategoryItem>): Promise<CategoryItem> => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: category }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create category');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  updateCategory: async (id: string, category: Partial<CategoryItem>): Promise<CategoryItem> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: category }),
    });
    if (!response.ok) throw new Error('Failed to update category');
    const json = await response.json();
    return flattenData(json.data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete category');
  },

  getCategories: async (): Promise<CategoryItem[]> => {
    const response = await fetch(`${API_BASE}/categories?populate=*`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const json = await response.json();
    return flattenData(json.data);
  },

  getHomepage: async (): Promise<HomepageData> => {
    const response = await fetch(`${API_BASE}/homepage?populate=*`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch homepage data');
    const json = await response.json();
    return flattenData(json.data);
  },

  getGlobal: async (): Promise<GlobalData> => {
    const response = await fetch(`${API_BASE}/global?populate=*`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch global data');
    const json = await response.json();
    return flattenData(json.data);
  },

  getCustomers: async (): Promise<Customer[]> => {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    const json = await response.json();
    return flattenData(json.data);
  },

  createCustomer: async (customer: Partial<Customer>): Promise<Customer> => {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: customer }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create customer');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders?populate=*`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const json = await response.json();
    return flattenData(json.data);
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: order }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create order');
    }
    const json = await response.json();
    return flattenData(json.data);
  },

  getDraftContent: async (contentType: string, id: string): Promise<any> => {
    // contentType is like "api::homepage.homepage" or "api::product.product"
    // We need to extract the plural name
    let endpoint = contentType.split('.').pop() || '';
    if (endpoint === 'homepage') endpoint = 'homepage'; // Single type names stay the same
    if (endpoint === 'global') endpoint = 'global';

    // Strapi 4/5 draft fetching
    const url = `${API_BASE}/${endpoint}?publicationState=preview&populate=*`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to fetch draft for ${contentType}`);
    const json = await response.json();
    return flattenData(json.data);
  },
};
