import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Typography, Avatar, 
  IconButton, AppBar, Toolbar, useMediaQuery, useTheme 
} from '@mui/material';
import { LayoutDashboard, Music2, Users2, CalendarRange, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const drawerWidth = 260;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAppStore();

  const menuItems = [
    { text: 'Início', icon: <LayoutDashboard size={20} />, path: '/' },
    { text: 'Músicas', icon: <Music2 size={20} />, path: '/musicas' },
    { text: 'Escalas', icon: <CalendarRange size={20} />, path: '/escalas' },
    { text: 'Equipe', icon: <Users2 size={20} />, path: '/membros' },
    { text: 'Insights', icon: <BarChart3 size={20} />, path: '/analytics' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#818cf8', letterSpacing: -1 }}>TrackIECS</Typography>
        {isMobile && <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}><X /></IconButton>}
      </Box>
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => { navigate(item.path); if(isMobile) setMobileOpen(false); }}
                sx={{ borderRadius: 3, bgcolor: active ? 'rgba(129, 140, 248, 0.1)' : 'transparent', color: active ? '#818cf8' : 'rgba(255,255,255,0.6)' }}
              >
                <ListItemIcon sx={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.4)', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#818cf8' }}>{user?.nome?.[0]}</Avatar>
        <Typography variant="caption" sx={{ flex: 1 }}>{user?.nome}</Typography>
        <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.3)' }}><LogOut size={18}/></IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#020617' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#818cf8' }}>TrackIECS</Typography>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}><Menu /></IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', bgcolor: '#0f172a' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, pt: { xs: 10, md: 4 }, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
}