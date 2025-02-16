import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Avatar, Container } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../utils/languageSwitcher.tsx';
import appLogo from '../../assets/logo.png';
import routes from '../../constants/routes.json';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';


const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen mode:', error);
    }
  };

  const { t } = useTranslation();
  // Retrieve user info from sessionStorage/localStorage
  const firstname = sessionStorage.getItem('firstName') || 'User';
  const lastname = sessionStorage.getItem('lastName') || '';
  const role = sessionStorage.getItem('role') || '';

  const pages = [
    { name: t('Services'), route: routes.SERVICES },
    { name: t('Bookings'), route: routes.BOOKING_HISTORY },
    { name: t('Profile'), route: routes.PROFILE },
  ];

  const pagesServiceProvider = [
    { name: t('Dashboard'), route: routes.SERVICE_PROVIDER_DASHBOARD },
    { name: t('Profile'), route: routes.PROFILE },
  ];

  // Generate initials from firstname and lastname
  const userInitials = `${firstname[0] || ''}${lastname[0] || ''}`.toUpperCase();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('AUTH_ACCESS_TOKEN');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('firstname');
    sessionStorage.removeItem('lastname');
    sessionStorage.removeItem('id');
    navigate(routes.LOGIN, { replace: true });
  };

  const navigateHome=()=>{
    if(role?.toLowerCase()==='customer'){
      navigate(routes.CUSTOMER_HOME);
    }else{
      navigate(routes.SERVICE_PROVIDER_DASHBOARD);
    }
  };

  const handleOnProfileClick = () => {
    navigate(routes.PROFILE);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#09285c' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2, cursor: 'pointer' }} onClick={() => navigateHome()}>
            <img
              src={appLogo}
              alt="App Logo"
              style={{ height: '70px', cursor: 'pointer' }}

            />
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {role?.toLowerCase()=='customer' ? pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  navigate(page.route);
                  handleCloseNavMenu();
                }}
                sx={{
                  my: 2,
                  mx: 1,
                  color: location.pathname === page.route ? '#FFEB3B' : 'white',
                  display: 'block',
                  fontWeight: location.pathname === page.route ? 'bold' : 'normal',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#FFEB3B',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page.name}
              </Button>
            )):
            pagesServiceProvider.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  navigate(page.route);
                  handleCloseNavMenu();
                }}
                sx={{
                  my: 2,
                  mx: 1,
                  color: location.pathname === page.route ? '#FFEB3B' : 'white',
                  display: 'block',
                  fontWeight: location.pathname === page.route ? 'bold' : 'normal',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#FFEB3B',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mr: 2, cursor: 'pointer' }} onClick={() => navigate(routes.CUSTOMER_HOME)}>
              <img
                src={appLogo}
                alt="App Logo"
                style={{ height: '70px', cursor: 'pointer' }}
              />
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    navigate(page.route);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: location.pathname === page.route ? 'bold' : 'normal',
                    }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Fullscreen Toggle */}
          <Tooltip title={isFullscreen?"Restore Down":"Maximize"} placement="bottom">
            <IconButton sx={{ padding: 0 }} color="inherit" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Profile */}
          <Box sx={{ flexGrow: 0, marginLeft: '20px' }}>
            <Tooltip title={`${firstname} ${lastname}`}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ size: '35px' }} alt={`${firstname} ${lastname}`}>{userInitials}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) =>
                setting === 'Logout' ? (
                  <MenuItem key={setting} onClick={handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem key={setting} onClick={handleOnProfileClick}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
