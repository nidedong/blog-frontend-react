export enum SorterEnum {
  DESC = -1,
  ASC = 1,
}

export interface IResType<D = unknown> {
  success: boolean;
  message?: string;
  code: number;
  data?: D;
}

export interface IResPaginationType<D = unknown> extends IResType {
  data?: {
    list: D[];
    total: number;
  };
}

export interface IReqPaginationParams {
  start: number;
  end: number;
  order?: SorterEnum;
}

export enum FileStatus {
  pending,
  finished,
}

export interface IFileEntity {
  id: string;
  status: FileStatus;
  originalName: string;
  bucketName: string;
  objectName: string;
  signUrl?: string;
  isPublic?: boolean;
  mimeType?: string;
  uploaderId: string;
  metaData?: string;
  expireAt?: number;
}
