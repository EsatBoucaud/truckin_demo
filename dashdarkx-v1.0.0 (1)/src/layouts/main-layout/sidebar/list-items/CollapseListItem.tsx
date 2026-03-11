import { useEffect, useMemo, useState } from 'react';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';
import { useLocation } from 'react-router-dom';

const CollapseListItem = ({ subheader, items, icon }: MenuItem) => {
  const location = useLocation();
  const hasActiveChild = useMemo(
    () =>
      Boolean(
        items?.some((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)),
      ),
    [items, location.pathname],
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {icon && (
            <IconifyIcon
              icon={icon}
              sx={{
                color: hasActiveChild ? 'primary.main' : null,
              }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={subheader}
          sx={{
            '& .MuiListItemText-primary': {
              color: hasActiveChild ? 'text.primary' : null,
              fontWeight: hasActiveChild ? 600 : 500,
            },
          }}
        />
        <IconifyIcon
          icon="iconamoon:arrow-right-2-duotone"
          color="neutral.dark"
          sx={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items?.map((route) => {
            return (
              <ListItemButton
                key={route.pathName}
                component={Link}
                href={route.path}
                sx={{
                  pl: 1.75,
                  borderLeft: 2,
                  borderStyle: 'solid',
                  borderColor:
                    location.pathname === route.path || location.pathname.startsWith(`${route.path}/`)
                      ? 'primary.main'
                      : 'transparent !important',
                  bgcolor:
                    location.pathname === route.path || location.pathname.startsWith(`${route.path}/`)
                      ? 'info.dark'
                      : 'info.darker',
                }}
              >
                <ListItemText
                  primary={route.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color:
                        location.pathname === route.path || location.pathname.startsWith(`${route.path}/`)
                          ? 'text.primary'
                          : 'text.secondary',
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default CollapseListItem;
