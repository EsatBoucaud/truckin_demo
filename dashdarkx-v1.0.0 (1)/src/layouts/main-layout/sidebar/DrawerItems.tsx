import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Image from 'components/base/Image';
import IconifyIcon from 'components/base/IconifyIcon';
import CollapseListItem from './list-items/CollapseListItem';
import ProfileListItem from './list-items/ProfileListItem';
import ListItem from './list-items/ListItem';
import LogoImg from 'assets/images/Logo.png';
import { topListData, bottomListData, profileListData } from 'data/sidebarListData';

const DrawerItems = () => {
  return (
    <>
      <Stack
        px={3}
        py={3}
        alignItems="center"
        justifyContent="flex-start"
        borderBottom={1}
        borderColor="neutral.darker"
      >
        <ButtonBase component={Link} href="/" disableRipple>
          <Image src={LogoImg} alt="logo" height={24} width={24} sx={{ mr: 1 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            Truckin
          </Typography>
        </ButtonBase>
      </Stack>

      <Box px={3} py={2}>
        <TextField
          variant="filled"
          size="small"
          placeholder="Search"
          sx={{ width: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon={'mingcute:search-line'} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List component="nav" sx={{ px: 2, py: 0.5 }}>
        {topListData.map((route, index) => {
          return <ListItem key={index} {...route} />;
        })}
      </List>

      <Divider />

      <List component="nav" sx={{ px: 2, py: 0.5 }}>
        {bottomListData.map((route) => {
          if (route.items) {
            return <CollapseListItem key={route.id} {...route} />;
          }
          return <ListItem key={route.id} {...route} />;
        })}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      <List component="nav" sx={{ px: 2, py: 1.5 }}>
        {profileListData && <ProfileListItem {...profileListData} />}
      </List>
    </>
  );
};

export default DrawerItems;
