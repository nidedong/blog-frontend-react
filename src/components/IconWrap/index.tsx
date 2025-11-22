import CircularProgress from '@mui/material/CircularProgress';
import { SvgIconProps } from '@mui/material/SvgIcon';
import React, { JSXElementConstructor } from 'react';

const IconWrap: React.ForwardRefRenderFunction<
  SVGSVGElement | null,
  SvgIconProps & { loading?: boolean; element: JSXElementConstructor<SvgIconProps> }
> = ({ loading, element: Icon, ...resProps }, ref) => {
  if (loading) return <CircularProgress size={24} sx={resProps.sx} />;

  return <Icon ref={ref} {...resProps} />;
};

export default React.forwardRef(IconWrap);
