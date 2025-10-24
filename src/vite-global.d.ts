// 全局类型
interface IResType<D = unknown> {
  success: boolean;
  message?: string;
  code: number;
  data?: D;
}

interface IResPaginationType<D = unknown> extends IResType {
  data?: {
    list: D[];
    total: number;
  };
}

interface IReqPaginationParams {
  start: number;
  end: number;
  order?: SorterEnum;
}
