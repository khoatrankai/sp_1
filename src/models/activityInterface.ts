
import { IGetContract } from "./contractInterface";
import { InfoUser } from "./userInterface";

export const STATUS_TAGS_ACTIVITY = {
  not_started: { label: "Chưa bắt đầu", color: "default" },
  pending: { label: "Đang chờ xử lý", color: "orange" },
  in_progress: { label: "Đang tiến hành", color: "blue" },
  on_hold: { label: "Tạm dừng", color: "purple" },
  awaiting_review: { label: "Chờ kiểm tra", color: "gold" },
  requires_revision: { label: "Yêu cầu sửa đổi", color: "red" },
  completed: { label: "Hoàn thành", color: "green" },
  delivered: { label: "Đã bàn giao", color: "cyan" },
  canceled: { label: "Đã hủy", color: "volcano" },
  not_feasible: { label: "Không thực hiện được", color: "magenta" },
};

export interface IGetActivity {
  activity_id: string;
  type: IGetTypeActivity; // type_activity_id
  status: IGetStatusActivity; // status_activity_id
  name: string;
  description?: string;
  contract?: IGetContract;
  created_at: Date;
  updated_at: Date;
  time_end: Date;
  time_start: Date;
  picture_urls?: IGetPictureActivity[];
  list_code_product?: IGetListCodeProduct[];
  works?: IGetWork[];
}

export interface ICreateActivity {
  type: string; // type_activity_id
  status: string; // status_activity_id
  name: string;
  description?: string;
  contract?: string;
  picture_urls?: File[];
  picture_url_type?: string[];
}

export interface IUpdateActivity {
  type?: string;
  status?: string;
  name?: string;
  description?: string;
  contract?: string;
  picture_urls?: File[];
  time_end?: Date;
  time_start?: Date;
  picture_url_type?: string[];
  picture_url_delete?: string[];
}

export interface IGetListCodeProduct {
  list_id: string;
  code_product: string;
  activity: IGetActivity; // activity_id
  created_at: Date;
  updated_at: Date;
}

export interface ICreateListCodeProduct {
  code_product: string;
  activity: string; // activity_id
}

export interface IUpdateListCodeProduct {
  list_id: string;
  code_product?: string;
  activity?: string;
}

export interface IGetListUser {
  list_id: string;
  user: string;
  work: IGetWork; // work_id
  created_at: Date;
  updated_at: Date;
}

export interface ICreateListUser {
  user: string;
  work: string; // work_id
}

export interface IUpdateListUser {
  list_id: string;
  user?: string;
  work?: string;
}

export interface IGetPictureActivity {
  picture_id: string;
  url: string;
  activity: IGetActivity; // activity_id
  type: "start" | "end";
  created_at: Date;
  updated_at: Date;
}

export interface ICreatePictureActivity {
  activity: string;
  url: File;
  type: "start" | "end";
}

export interface IUpdatePictureActivity {
  picture_id: string;
  url?: string;
  activity?: string;
  type?: "start" | "end";
}

export interface IGetPictureWork {
  picture_id: string;
  url: string;
  work: IGetWork; // work_id
  type: "start" | "end";
  created_at: Date;
  updated_at: Date;
}

export interface IGetPictureTask {
  picture_id: string;
  url: string;
  task: IGetTask; // work_id
  type: "start" | "end";
  created_at: Date;
  updated_at: Date;
}

export interface ICreatePictureWork {
  work: string;
  url: File;
  type: "start" | "end";
}

export interface IUpdatePictureWork {
  picture_id: string;
  url?: string;
  work?: string; // work_id
  type?: "start" | "end";
}
export interface IGetTypeWork {
  type_work_id: string;
  name: string;
  name_tag: string;
  work?: IGetWork[]; // Mảng chứa các `work_id` liên kết (nếu cần)
  status?: IGetStatusWork[]; // Mảng chứa các `status_work_id` liên kết (nếu cần)
}

export interface ICreateTypeWork {
  name: string;
  name_tag: string;
}
export interface IUpdateTypeWork {
  type_work_id: string; // Dùng để xác định bản ghi cần cập nhật
  name?: string;
  name_tag?: string;
}

export interface IGetStatusWork {
  status_work_id: string;
  name: string;
  name_tag: string;
  type_work?: IGetTypeWork; // ID của TypeWork liên kết
  work: IGetWork[]; // Mảng chứa các `work_id` liên kết (nếu cần)
}

export interface ICreateStatusWork {
  name: string;
  name_tag: string;
  type_work: string; // ID của TypeWork mà StatusWork liên kết
}
export interface IUpdateStatusWork {
  status_work_id: string; // Dùng để xác định bản ghi cần cập nhật
  name?: string;
  name_tag?: string;
  type_work?: string; // Cho phép thay đổi liên kết với TypeWork nếu cần
}

export interface IGetWork {
  work_id: string;
  type: IGetTypeWork; // type_work_id
  status: IGetStatusWork; // status_work_id
  name: string;
  description?: string;
  activity?: IGetActivity; // activity_id
  time_start: Date;
  time_end: Date;
  created_at: Date;
  updated_at: Date;
  urgent: boolean;
  tasks?: IGetTask[];
  picture_urls?: IGetPictureWork[];
  user_create?:InfoUser
  list_user?: {
    list_id: string;
    user: string;
    created_at: Date;
    updated_at: Date;
  }[];
  date?: string;
}

export interface IGetWork2 {
  work_id: string;
  type: IGetTypeWork; // type_work_id
  status: IGetStatusWork; // status_work_id
  name: string;
  description?: string;
  activity?: IGetActivity; // activity_id
  time_start: Date;
  time_end: Date;
  created_at: Date;
  urgent?: boolean;
  tasks?: IGetTask[];
  updated_at: Date;
  picture_urls?: IGetPictureWork[];
  user_create?:InfoUser
  list_user?: InfoUser[];
  folders?:IGetFolder[]
  date?: string;
}

export interface IGetTask {
  task_id: string;
  status: 'waitting'| 'fail'| 'success'; // status_work_id
  name: string;
  description?: string;
  work?: IGetWork2; // activity_id
  time_start: Date;
  time_end: Date;
  created_at: Date;
  urgent?: boolean;
  position:number
  updated_at: Date;
  picture_urls?: IGetPictureTask[];
}

export interface IGetReview {
  review_id: string;
  status: 'waitting'| 'fail'| 'success'; // status_work_id
  description?: string;
  quality?: 'excellent'| 'good'| 'satisfactory'|'fail'|'needs_improvement';
  work?: IGetWork2; // activity_id
  user_create?:InfoUser
  time_end?:Date
  created_at: Date;
  progress:number
  updated_at: Date;
}

export interface IGetComment {
  comment_id: string;
  description?: string;
  work?: IGetWork2; // activity_id
  user_create?:InfoUser
  created_at: Date;
  updated_at: Date;
}

export interface ICreateComment {
  description?: string;
  work?: string; // activity_id
  user_create?:InfoUser
}

export interface IUpdateComment {
  comment_id?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateWork {
  type: string; // type_work_id
  status: string; // status_work_id
  name: string;
  description?: string;
  activity: string; // activity_id
  time_start: Date;
  urgent?: boolean;
  time_end: Date;
  picture_urls?: File[];
  picture_url_type?: string[];
  list_users?: string[];
}

export interface ICreateTask {
  status: 'waitting'|'fail'|'success'; // status_work_id
  name: string;
  description?: string;
  work: string; 
  time_start: Date;
  urgent?: boolean;
  time_end: Date;
  picture_urls?: File[];
  picture_url_type?: string[];
}

export interface ICreateReview {
  status: 'waitting'| 'fail'| 'success'; // status_work_id
  description?: string;
  quality?: 'excellent'| 'good'| 'satisfactory'|'fail'|'needs_improvement';
  work?: string; // activity_id
  time_end?:Date
  user_create?:InfoUser
  progress:number
}

export interface IUpdateReview {
  review_id: string;
  status: 'waitting'| 'fail'| 'success'; // status_work_id
  description?: string;
  quality?: 'excellent'| 'good'| 'satisfactory'|'fail'|'needs_improvement';
  work?: IGetWork2; // activity_id
  user_create?:InfoUser
  time_end?:Date
  created_at: Date;
  progress:number
  updated_at: Date;
}
export interface IUpdateWork {
  work_id?: string;
  type?: string;
  status?: string;
  name?: string;
  urgent?: boolean;
  description?: string;
  activity?: string;
  time_start?: Date;
  time_end?: Date;
  list_users?: string[];
}

export interface IUpdateTask {
  task_id?: string;
  status?: 'waitting'|'fail'|'success';
  name?: string;
  urgent?: boolean;
  position?:number
  description?: string;
  work?: string;
  time_start?: Date;
  time_end?: Date;
}


export interface IGetStatusActivity {
  status_activity_id: string;
  name: string;
  name_tag: string;
  type_activity: IGetTypeActivity; // type_activity_id
  activity: IGetActivity[];
  created_at: Date;
  updated_at: Date;
}

export interface ICreateStatusActivity {
  name: string;
  name_tag: string;
  type_activity: string; // type_activity_id
}

export interface IUpdateStatusActivity {
  status_activity_id: string;
  name?: string;
  name_tag?: string;
  type_activity?: string;
}

export interface IGetTypeActivity {
  type_activity_id: string;
  name: string;
  name_tag: string;
  created_at: Date;
  updated_at: Date;
  status?: IGetStatusActivity[];
}

export interface ICreateTypeActivity {
  name: string;
  name_tag: string;
}

export interface IUpdateTypeActivity {
  type_activity_id: string;
  name?: string;
  name_tag?: string;
}


export interface ICreateFile {
  files?: {name?:string}[];
  url?: File[];
  folder?:string
}
export interface ICreateFolder {
  name?: string;
  description?: string;
  work?: string;
  files?:ICreateFile[]
  url?:File[]
}

export interface IGetFolder {
  folder_id:string
  name: string;
  description: string;
  work: string;
  files?:IGetFile[]
}

export interface IGetFile {
  file_id:string
  name: string;
  url: string;
}
