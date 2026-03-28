import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Typography, Avatar, 
  IconButton, AppBar, Toolbar, useMediaQuery, useTheme 
} from '@mui/material';
import { LayoutDashboard, Music2, Users2, CalendarRange, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const drawerWidth = 280;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAppStore(state => state.user);

  const menuItems = [
    { text: 'Início', icon: <LayoutDashboard size={22} />, path: '/' },
    { text: 'Repertório', icon: <Music2 size={22} />, path: '/musicas' },
    { text: 'Equipe', icon: <Users2 size={22} />, path: '/membros' },
    { text: 'Escalas', icon: <CalendarRange size={22} />, path: '/escalas' },
    { text: 'Insights', icon: <BarChart3 size={22} />, path: '/analytics' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#818cf8' }}>TrackIECS</Typography>
        {isMobile && <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}><X /></IconButton>}
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => { navigate(item.path); if(isMobile) setMobileOpen(false); }}
                sx={{ borderRadius: 3, bgcolor: active ? 'rgba(129, 140, 248, 0.15)' : 'transparent', color: active ? '#818cf8' : 'rgba(255,255,255,0.6)' }}
              >
                <ListItemIcon sx={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.4)', minWidth: 45 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#818cf8' }}>{user?.nome?.[0] || 'A'}</Avatar>
        <Typography variant="body2" fontWeight={700}>{user?.nome || 'Admin'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#020617' }}>
      {/* HEADER MOBILE */}
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#818cf8' }}>TrackIECS</Typography>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}><Menu /></IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* DRAWER (SIDEBAR) */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', bgcolor: '#0f172a' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 4 }, 
        pt: { xs: 10, md: 4 }, // Espaço para o AppBar no mobile
        width: { md: `calc(100% - ${drawerWidth}px)` },
        backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,12%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(225,39%,15%,1) 0, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}