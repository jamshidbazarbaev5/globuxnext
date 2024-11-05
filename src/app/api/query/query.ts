'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/app/api/axios/axios'
import { ApiResponse, CartData, CategoriesResponse, ICategory, IProduct } from '@/app/models/models'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'

interface ProductsResponse {
  items: IProduct[]
}

interface ProductResponse {
  items: IProduct
}



export function useProducts(categoryId?: number) {
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm)

  return useQuery<ApiResponse<ProductsResponse>, Error>({
    queryKey: ['products', categoryId, searchTerm], 
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (categoryId && categoryId !== 0) {
        params.append('category', categoryId.toString())
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const url = `/products${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await api.get<ApiResponse<ProductsResponse>>(url)
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.errMessage || 'Failed to fetch products')
      }
    },
  })
}




export function useProduct(productId: number) {
  return useQuery<IProduct, Error>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductResponse>>(`/products/${productId}`)
      if (response.data.success) {
        return response.data.data.items
      } else {
        throw new Error(response.data.errMessage || 'Failed to fetch product')
      }
    },
    enabled: !!productId,
  })
}


export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CategoriesResponse>>('/categories');
      return response.data.data.categories;
    },
  });
};

export const useCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      if (categoryId === 0) return null;
      const response = await api.get<ApiResponse<ICategory>>(`/categories/${categoryId}`);
      return response.data.data;
    },
    enabled: categoryId > 0,
  });
};

export const  useCart = ()=>{
  return useQuery<CartData,Error>({
    queryKey: ['cart'],
    queryFn:async ()=>{
      const response = await api.get<ApiResponse<CartData>>('/cart')
      return response.data.data
    }
  })
}
export const useAddToCart = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:async ({productId,quantity}:{productId:number,quantity:number})=>{
      const response = await api.post<ApiResponse<CartData>>('/cart',{product:productId,quantity})
      return response.data.data

    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['cart']})
    }
  })
  
}

export const useUpdateCartItem =()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:async({quantity,productId}:{cartItemId:number,quantity:number,productId:number})=>{
      try{
        const response = await api.put<ApiResponse<CartData>>('/cart',{quantity,product:productId})
        return response.data.data
      }catch(error){
        if(error instanceof Error){
          throw new Error(error.message)
        }

      }
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['cart']})
    },
    onError:(error)=>{
      if(error instanceof Error){
        throw new Error(error.message)
      }
    }
  })
}

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartItemId: number) => {
      await api.delete(`/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useDeleteAllCartItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete('/cart/delete-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await api.post('/token/refresh', { refresh: refreshToken });
        const { access } = response.data.data.token;
        localStorage.setItem('token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { phone: string; password: string }) => {
      const response = await api.post('/token', credentials);
      return response.data;
    },
  });
};




export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data.data.user;
    },
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['currentUser'] });
    },
  });
};


