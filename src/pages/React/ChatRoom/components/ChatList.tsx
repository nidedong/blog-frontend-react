import React from 'react';
import List, { type ListProps } from '@mui/material/List';
import ConversationItem from './ConversationItem';

const list = [...new Array(10).fill(undefined)].map((item, index) => ({
  id: index,
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

const ChatList: React.FunctionComponent<ListProps> = (props) => {
  return (
    <List dense disablePadding sx={{ gap: 0.5 }} {...props}>
      {list?.map((data) => (
        <ConversationItem key={data.id} data={data} />
      ))}
    </List>
  );
};

export default React.memo(ChatList);
