interface CreatePropose {
    name_propose?: string;
    type_related?: string;
    related_id?: string;
    date_start?: string; // ISO date format string
    date_end?: string; // ISO date format string
    type_money?: string;
    type_discount?: "before" | "after"; // If discount type is strictly "before" or "after"
    status?: "send" | "draft" | "approved" | "rejected"; // Add other statuses as needed
    price?: number;
    staff_support?: string;
    email?: string;
    phone_number?: string;
    send_to?: string;
    province?: string;
  }

interface GetPropose{
  propose_id: string;
  name_propose: string;
  send_to: string;
  price: number;
  date_start: string;
  date_end: string;
  created_at: string;
  status: string;
}

interface FilterPropose{
  type?:string;
  type_date?:string;
  status?:string;
  date_start?:string;
  date_end?:string;
  staff_support?:string;
}

  export type{CreatePropose,GetPropose,FilterPropose}