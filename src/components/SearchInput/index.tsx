import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import React from 'react';

const SearchInput: React.ForwardRefRenderFunction<TextFieldProps['ref'], TextFieldProps> = (
  props,
  ref
) => {
  const { t } = useTranslation();

  return (
    <TextField
      ref={ref as any}
      placeholder={t('action.search')}
      fullWidth
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: <SearchIcon />,
          ...props.slotProps?.input,
        },
      }}
      sx={{
        '& .MuiInputBase-root': { py: 0 },
        '& .MuiInputBase-input': { height: 44 },
        ...props.sx,
      }}
    />
  );
};

export default React.forwardRef(SearchInput);
