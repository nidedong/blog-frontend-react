import React from 'react';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';
import { useControllableValue } from 'ahooks';
import { omit } from 'lodash-es';

export type IActionIconProps = ButtonBaseProps & {
  actived?: boolean;
  onChange?: (actived: boolean) => void;
};

const ActiveIcon: React.ForwardRefRenderFunction<HTMLButtonElement, IActionIconProps> = (
  props,
  ref
) => {
  const [actived, setActived] = useControllableValue(props, {
    defaultValuePropName: 'actived',
    defaultValue: false,
  });

  const handleClick: ButtonBaseProps['onClick'] = (e) => {
    props.onClick?.(e);
    setActived((pre) => !pre);
  };

  return (
    <ButtonBase
      ref={ref}
      {...omit(props, 'actived', 'onChange')}
      onClick={handleClick}
      sx={[
        (theme) => ({
          color: actived ? undefined : theme.vars?.palette.action.disabled,
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

export default React.forwardRef(ActiveIcon);
