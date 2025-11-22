import React from 'react';
import ToggleButton, {
  toggleButtonClasses,
  ToggleButtonOwnProps,
} from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
  ToggleButtonGroupProps,
} from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(2),
  boxShadow: 'none !important',
  background: 'none !important',
  fontSize: 16,
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopRightRadius: theme.vars?.shape.borderRadius,
    borderBottomRightRadius: theme.vars?.shape.borderRadius,
    border: 'none',
  },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopLeftRadius: theme.vars?.shape.borderRadius,
    borderBottomLeftRadius: theme.vars?.shape.borderRadius,
    border: 'none',
  },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      border: 'none',
    },
}));

export interface IToogleButtonListProps extends ToggleButtonGroupProps {
  items?: ToggleButtonOwnProps[];
}

const ToogleButtonList: React.FC<IToogleButtonListProps> = ({ items, ...groupProps }) => {
  if (items?.length === 0) return null;

  return (
    <StyledToggleButtonGroup {...groupProps}>
      {items?.map((props, index) => (
        <ToggleButton
          key={index}
          {...props}
          sx={{ padding: '8px 12px', fontWeight: 600, ...props.sx }}
        />
      ))}
    </StyledToggleButtonGroup>
  );
};

export default ToogleButtonList;
