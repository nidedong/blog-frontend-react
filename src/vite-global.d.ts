// 全局类型
interface IResType<D = unknown> {
  success: boolean;
  message?: string;
  code: number;
  data?: D;
}

interface IResPaginationData<D = unknown> {
  list: D[];
  total: number;
}
interface IResPaginationType<D = unknown> extends IResType {
  data?: IResPaginationData<D>;
}

interface IReqPaginationParams {
  start: number;
  end: number;
  order?: SorterEnum;
}
