import React from 'react';

export enum SorterEnum {
  DESC = -1,
  ASC = 1,
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

export interface RouteObjectHandle {
  icon?: React.ReactNode;
  name?: string;
  hideInMenu?: boolean;
  to?: string;
}
