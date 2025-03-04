import { IGetProject } from "./projectInterface";
import { InfoUser } from "./userInterface";

export interface ICreatePriceQuote {
  project: string;
  date_start: Date;
  date_expired: Date;
  status?: "draff" | "send" | "open" | "edit" | "refuse" | "accept"; // Có thể để mặc định
  type_money?: "vnd" | "usd"; // Mặc định là 'vnd'
  reference_code: string;
  user_support?: string | null;
  opportunity?: string | null;
  customer?: string | null;
  type_vat?: "none" | "before" | "after"; // Mặc định là 'none'
  type_discount?: "percent" | "money"; // Mặc định là 'percent'
  discount?: number; // Mặc định là 0
  description?: string | null;
  parts: ICreateListPartProduct[];
}

export interface ICreateListDetailProduct {
  description: string;
  price: number; // Price of the product
  quantity: number; // Quantity of the product
  unit: string; // Unit of measurement for the product (e.g., kg, pcs)
}
export interface IUpdateListDetailProduct {
  description?: string;
  price?: number; // Optional: Update price of the product
  quantity?: number; // Optional: Update quantity of the product
  unit?: string; // Optional: Update unit of measurement
}

export interface IGetListDetailProduct {
  detail_id: string; // Unique identifier for the detail product
  PQ_product: string; // Reference to the ListProduct
  price: number; // Price of the product
  quantity: number; // Quantity of the product
  unit: string; // Unit of measurement
  created_at: Date; // Timestamp of creation
  updated_at: Date; // Timestamp of last update
}

export interface FilterPriceQuote {
  project?: string;
  type_date?: string;
  customer?: string;
  status?: string;
  date_start?: string;
  date_expired?: string;
  user_support?: string;
}

export interface IUpdatePriceQuote {
  project?: string;
  date_start?: Date;
  date_expired?: Date;
  status?: "draff" | "send" | "open" | "edit" | "refuse" | "accept";
  type_money?: "vnd" | "usd";
  reference_code?: string;
  user_support?: string | null;
  customer?: string | null;
  opportunity?: string | null;
  type_vat?: "none" | "before" | "after";
  type_discount?: "percent" | "money";
  discount?: number;
  description?: string | null;
  products?: IUpdatePriceQuoteProduct[];
}

export interface IGetPriceQuote {
  price_quote_id: string;
  project: IGetProject;
  date_start: Date;
  date_expired: Date;
  status: "draff" | "send" | "open" | "edit" | "refuse" | "accept";
  type_money: "vnd" | "usd";
  reference_code: string;
  user_support: InfoUser;
  type_vat: "none" | "before" | "after";
  type_discount: "percent" | "money";
  discount: number;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  parts: IGetPartProduct[];
}

export interface IExportPriceQuote {
  price_quote_id: string;
  project?: {
    project_id: string;
    name: string;
    status: string;
    price: number;
    time_job: number;
    user_support: string;
    customer: {
      info_id: string;
      name_company: string;
      tax_code: string;
      province: string;
      opportunity: string;
      phone_number: string;
      website: string;
      type_money: string;
      status_active: string;
      date_establish: string;
      address_payment: string;
      address_delivery: string;
      province_payment: string;
      province_delivery: {
        province_id: string;
        name_province: string;
      };
      staff_support: string;
      created_at: string;
      updated_at: string;
      group_customer: {
        group_id: string;
        name_group: string;
        count: number;
      };
    };
    start_date: string;
    end_date: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  customer?: {
    info_id: string;
    name_company: string;
    tax_code: string;
    province: string;
    opportunity: string;
    phone_number: string;
    website: string;
    type_money: string;
    status_active: string;
    date_establish: string;
    address_payment: string;
    address_delivery: string;
    province_payment: string;
    province_delivery: {
      province_id: string;
      name_province: string;
    };
    staff_support: string;
    created_at: string;
    updated_at: string;
    group_customer: {
      group_id: string;
      name_group: string;
      count: number;
    };
  };
  date_start: string;
  date_expired: string;
  status: string;
  type_money: string;
  reference_code: string;
  user_support: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    picture_url: string;
    phone_number: string;
  };
  type_vat: string;
  type_discount: string;
  discount: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  parts: {
    part_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    products: {
      product_id: string;
      code_original: string | null;
      name: string;
      price: number;
      description: string;
      vat: string;
      profit: {
        profit_id: string;
        type_profit: number;
      };
      type_profit: number;
      quantity: number;
      status: string;
      type_product: {
        type_product_id: string;
        name: string;
      };
      unit_product: {
        unit_id: string;
        name_unit: string;
      };
      code_product: {
        code_product_id: string;
        code: string;
        status: string;
        created_at: string;
        updated_at: string;
      }[];
      brand: {
        brand_id: string;
        name: string;
      };
      original: {
        original_id: string;
        name: string;
      };
      list_detail: {
        detail_id: string;
        description: string;
        quantity: number;
        unit: string;
        price: number;
        created_at: Date;
        updated_at: Date;
      }[];
    }[];
  }[];
}

export interface ICreatePriceQuoteProduct {
  product: string;
  price: number;
  quantity: number;
  vat?: string | null;
  profit?: string | null;
  list_detail?: ICreateListDetailProduct[];
}

export interface ICreateListPartProduct {
  title?: string;
  products: ICreatePriceQuoteProduct[];
}

export interface IUpdatePriceQuoteProduct {
  product?: string;
  price?: number;
  quantity?: number;
  vat?: string | null;
  profit?: string | null;
}

export interface IDeletePriceQuoteProduct {
  PQ_product_id: string;
}

export interface IGetPriceQuoteProduct {
  PQ_product_id: string;
  price_quote: string; // Quan hệ với `PriceQuote` chỉ giữ `price_quote_id` hoặc đối tượng đầy đủ nếu cần
  product: string;
  price: number;
  profit: string;
  quantity: number;
  vat: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface IGetPartProduct {
  part_id: string;
  title: string;
  products: IGetPriceQuoteProduct[];
  created_at: Date;
  updated_at: Date;
  type_package?: ITypePackage;
}

export interface ITypePackage {
  package_id: string;
  name_package: string;
  parts?: IGetPartProduct[];
}
