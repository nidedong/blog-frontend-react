import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';

const MultipleEllipsis: React.FC<TypographyProps & { lines?: number }> = ({
  lines = 1,
  ...props
}) => (
  <Typography
    {...props}
    sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...(lines === 1
        ? { whiteSpace: 'nowrap' }
        : {
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
          }),
      ...props.sx,
    }}
  />
);

export default MultipleEllipsis;
