import React from 'react';
import List, { type ListProps } from '@mui/material/List';
import ConversationItem from '@/pages/React/ChatRoom/components/ConversationItem';
import { Badge } from '@mui/material';

const list = [...new Array(10).fill(undefined)].map((item) => ({
  id: 'bdc6ee20-4dc8-44b5-b153-d4bbd3c80378',
  nickName: '测试账号',
  mobilePhone: '15927922787',
  email: 'dongbb99@163.com',
  avatar:
    'https://minio.api.dongbibo.top:443/blog-bucket-dev/public/users/bdc6ee20-4dc8-44b5-b153-d4bbd3c80378/imgs/1761038503214.能链logo.png',
  gender: 0,
  remark: null,
  locale: null,
  badges: { notification: 1, message: 0 },
}));

const ConversationList = () => {
  return (
    <List dense disablePadding sx={{ gap: 0.5 }}>
      {list?.map((data) => (
        <ConversationItem
          data={data}
          extra={
            <Badge
              badgeContent={10}
              color='error'
              sx={{ pr: 2 }}
              anchorOrigin={{ horizontal: 'left' }}
            ></Badge>
          }
        />
      ))}
    </List>
  );
};

export default React.memo(ConversationList);
