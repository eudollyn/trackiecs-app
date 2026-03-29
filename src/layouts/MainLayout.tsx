import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Typography, Avatar, 
  IconButton, AppBar, Toolbar, useMediaQuery, useTheme,
  BottomNavigation, BottomNavigationAction, Paper
} from '@mui/material';
import { LayoutDashboard, Music2, Users2, CalendarRange, BarChart3, Menu, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const drawerWidth = 260;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuth } = useAppStore();

  const menuItems = [
    { text: 'Início', icon: <LayoutDashboard size={20} />, path: '/' },
    { text: 'Músicas', icon: <Music2 size={20} />, path: '/musicas' },
    { text: 'Escalas', icon: <CalendarRange size={20} />, path: '/escalas' },
    { text: 'Equipe', icon: <Users2 size={20} />, path: '/membros' },
    { text: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#020617' }}>
      
      {/* SIDEBAR PARA PC */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.05)', color: 'white' },
          }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={900} sx={{ color: '#818cf8', letterSpacing: -1 }}>TrackIECS</Typography>
          </Box>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 3, mb: 0.5, bgcolor: location.pathname === item.path ? 'rgba(129, 140, 248, 0.1)' : 'transparent' }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#818cf8' : 'rgba(255,255,255,0.4)', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ mt: 'auto', p: 3, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#818cf8' }}>{user?.nome?.[0]}</Avatar>
            <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>{user?.nome}</Typography>
            <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.3)' }}><LogOut size={18}/></IconButton>
          </Box>
        </Drawer>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 5 }, 
        pb: { xs: 12, md: 5 }, // Espaço extra para a BottomBar no mobile
        width: '100%'
      }}>
        <Outlet />
      </Box>

      {/* NAVEGAÇÃO DE BAIXO PARA MOBILE (MODERNO) */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.05)' }} elevation={3}>
          <BottomNavigation
            showLabels
            value={location.pathname}
            onChange={(_, newValue) => navigate(newValue)}
            sx={{ bgcolor: 'transparent', height: 70 }}
          >
            <BottomNavigationAction label="Início" value="/" icon={<LayoutDashboard size={22}/>} sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#818cf8' } }} />
            <BottomNavigationAction label="Músicas" value="/musicas" icon={<Music2 size={22}/>} sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#818cf8' } }} />
            <BottomNavigationAction label="Escalas" value="/escalas" icon={<CalendarRange size={22}/>} sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#818cf8' } }} />
            <BottomNavigationAction label="Analytics" value="/analytics" icon={<BarChart3 size={22}/>} sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#818cf8' } }} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}