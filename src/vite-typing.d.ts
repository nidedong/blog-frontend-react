import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig<> {
    /** 返回response.data.data，默认为true */
    flatData?: boolean;
    /** 返回response */
    origin?: boolean;
    /** 是否提示 */
    silent?: boolean;
    /** 是否携带token，用于部分外部请求方法 */
    useToken?: boolean;
  }
}
