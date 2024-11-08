export interface IProduct {
  id: number;
  code: string;
  name: string;
  description: string;
  discounts: any | null;
  price: number;
  discount_price: number | null;
  is_new: boolean;
  amount: number;
  category: number;
  totalItems: number;
  images: {
    id: number;
    image: string;
  }[];
}

export interface ICategory {
  id: number;
  name: string;
  parent: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  errMessage: string | null;
  errorCode: string | null;
  data: T;
}

export interface ProductsResponse {
  items: IProduct[];
  totalItems: number;
}

export interface CategoriesResponse {
  categories: ICategory[];
}


export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  cashback_balance: number;
  date_of_birth: string;
  gender: string;
  is_active: boolean;
}

export interface LoginResponse {
  success: boolean;
  errMessage: string | null;
  errorCode: number | null;
  data: {
    token: {
      access: string;
      refresh: string;
    };
  };
}

export interface UserResponse {
  success: boolean;
  errMessage: string | null;
  errorCode: number | null;
  data: {
    user: User;
  };
}

export interface CartItem {
  id: number;
  product: {
    id: number;
    code: string;
    name: string;
    description: string;
    discounts: null | any;
    price: number;
    discount_price: number | null;
    is_new: boolean;
    amount: number;
    category: number;
    images: Array<{ id: number; image: string }>;
  };
  quantity: number;
  cartItems:number;
}


 export interface CartData {
  cart: CartItem[];
  total: number;
  cartItems:number;
}
export interface CardCreationResponse {
  success: boolean;
  errMessage: string | null;
  errorCode: string | null;
  data: {
    card: {
      number: string;
      expire: string;
      token: string;
      recurrent: boolean;
      verify: boolean;
      type: string;
    };
  };
}

export interface CardCreationData {
  card_number: string;
  expire_date: string;
}
