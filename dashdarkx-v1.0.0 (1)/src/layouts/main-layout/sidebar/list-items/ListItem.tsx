import { useMemo } from 'react';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';
import { useLocation } from 'react-router-dom';

const ListItem = ({ subheader, icon, path }: MenuItem) => {
  const location = useLocation();
  const isActive = useMemo(() => {
    if (!path || path === '#!') {
      return false;
    }

    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname, path]);

  return (
    <ListItemButton
      component={Link}
      href={path}
      selected={isActive}
      sx={{
        opacity: isActive ? 1 : 0.78,
        bgcolor: isActive ? 'info.dark' : 'transparent',
      }}
    >
      <ListItemIcon>
        {icon && (
          <IconifyIcon
            icon={icon}
            sx={{
              color: isActive ? 'primary.main' : null,
            }}
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={subheader}
        sx={{
          '& .MuiListItemText-primary': {
            color: isActive ? 'text.primary' : null,
            fontWeight: isActive ? 600 : 500,
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
