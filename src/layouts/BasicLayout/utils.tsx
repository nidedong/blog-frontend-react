import { RouteObject } from 'react-router';
import { MenuDataItem } from '@ant-design/pro-components';

export const routeObj2MenuDataItem = (route: RouteObject | undefined): MenuDataItem => {
  return {
    path: route?.path,
    ...route?.handle,
    routes: route?.children?.map((child) => routeObj2MenuDataItem(child)),
  };
};
