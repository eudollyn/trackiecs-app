import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, IconButton, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { LayoutDashboard, Music2, Users2, CalendarRange, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const drawerWidth = 260;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppStore();

  const menuItems = [
    { text: 'Início', icon: <LayoutDashboard size={22}/>, path: '/' },
    { text: 'Músicas', icon: <Music2 size={22}/>, path: '/musicas' },
    { text: 'Escalas', icon: <CalendarRange size={22}/>, path: '/escalas' },
    { text: 'Equipe', icon: <Users2 size={22}/>, path: '/membros' },
    { text: 'Insights', icon: <BarChart3 size={22}/>, path: '/analytics' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', bgcolor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={900} color="#818cf8">TrackIECS</Typography>
        {isMobile && <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}><X /></IconButton>}
      </Box>
      <List sx={{ px: 1.5, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton key={item.text} onClick={() => { navigate(item.path); setMobileOpen(false); }} sx={{ borderRadius: 3, mb: 0.5, bgcolor: location.pathname === item.path ? 'rgba(129, 140, 248, 0.1)' : 'transparent' }}>
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#818cf8' : 'rgba(255,255,255,0.4)', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#818cf8' }}>{user?.nome?.[0]}</Avatar>
        <Typography variant="body2" sx={{ flex: 1, fontWeight: 700 }}>{user?.nome}</Typography>
        <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.2)' }}><LogOut size={18}/></IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#020617', maxWidth: '100vw', overflowX: 'hidden' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: '#020617', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={900} color="#818cf8">TrackIECS</Typography>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}><Menu /></IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant={isMobile ? "temporary" : "permanent"} open={isMobile ? mobileOpen : true} onClose={() => setMobileOpen(false)} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', bgcolor: '#0f172a' } }}>
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, pt: { xs: 11, md: 4 }, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <Outlet />
      </Box>
    </Box>
  );
}