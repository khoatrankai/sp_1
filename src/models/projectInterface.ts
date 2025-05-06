import { UploadFile } from "antd";
import { CustomerInfo } from "./customerInterface";
import { InfoUser } from "./userInterface";
import { IGetPictureWork } from "./activityInterface";

export interface IGetProject {
    project_id: string;
    name?: string;
    status: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    type?:ITypeProject
    time_job?: number;
    user_support?: string;
    progress:{total:number,completed:number,pause:number,cancel:number,process:number,waiting:number}
    attach:IGetPictureWork[]
    user_participants?:InfoUser[]
    customer?: CustomerInfo;
    start_date?: Date;
    end_date?: Date;
    description?: string;
    picture_url?:string
    created_at: Date;
    updated_at: Date;
  }

  export interface ITypeProject {
    type_id: string;
      name_type: string;
      projects?:IGetProject[]
  }

  export interface ICreateProject {
    name: string;
    status: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    type?:string;
    time_job?: number;
    user_support?: string;
    customer: string;
    start_date?: Date;
    end_date?: Date;
    description?: string; 
    picture_url?: UploadFile[];
  }

  export interface IUpdateProject {
    name?: string;
    status?: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    time_job?: number;
    type?:string;
    user_support?: string;
    customer?: string;
    start_date?: Date;
    end_date?: Date;
    description?: string; 
    picture_url?: UploadFile[];
  }

  export interface ICreateNotify {
    description: string;
    url:string;
    project:string;
  }

  export interface IGetNotify {
    notify_id: string;
    description: string;
    user_create:InfoUser;
    url:string;
    created_at: Date;
    updated_at: Date;
  }
  
  