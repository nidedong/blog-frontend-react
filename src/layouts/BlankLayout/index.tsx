import React from 'react';
import styles from './index.module.less';
import { Outlet, useNavigate } from 'react-router';
import { setNavigate } from '@/utils';

const BlankLayout: React.FC = () => {
  const navigate = useNavigate();

  setNavigate(navigate);

  return (
    <div className={styles.blankLayout}>
      <Outlet />
    </div>
  );
};

export default BlankLayout;
