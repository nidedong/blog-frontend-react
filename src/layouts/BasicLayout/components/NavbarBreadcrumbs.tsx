import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useMatches, useNavigate } from 'react-router';
import { RouteObjectHandle } from '@/types';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const matches = useMatches().filter((match) => !!(match.handle as RouteObjectHandle).name);
  const navigate = useNavigate();

  return (
    <StyledBreadcrumbs separator={<NavigateNextRoundedIcon fontSize='small' />}>
      {matches?.map((match, index) => {
        const handle = match.handle as RouteObjectHandle;
        if (index === matches.length - 1 || !handle.to) {
          return (
            <Typography variant='body1' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {handle.name}
            </Typography>
          );
        }
        return (
          <Typography
            component='a'
            sx={{ cursor: 'pointer' }}
            variant='body1'
            onClick={() => navigate(handle.to!)}
          >
            {handle.name}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
}
