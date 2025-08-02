import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Achats', icon: '📦' },
  { to: '/admin?tab=reclamations', label: 'Réclamations', icon: '📝' },
  { to: '/admin?tab=users', label: 'Utilisateurs', icon: '👤' },
  { to: '/admin/products', label: 'Produits', icon: '🛒' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside style={{
      minWidth: 200,
      background: 'var(--color-card)',
      borderRadius: 16,
      padding: '32px 0',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: '100%',
      position: 'sticky',
      top: 32
    }}>
      {sidebarLinks.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            fontWeight: 600,
            fontSize: 17,
            color: isActive ? 'white' : 'var(--color-primary)',
            background: isActive ? 'linear-gradient(90deg, #a13e97 0%, #7c3aed 100%)' : 'transparent',
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            margin: '0 12px'
          })}
          end={link.to === '/admin'}
        >
          <span style={{ fontSize: 20 }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}; 