import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/commissars', label: 'Commissars' },
  { href: '/ratings', label: 'Ratings' },
];

export default function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  return (
    <View style={styles.headerWrap}>
      {/* Top row: logo + hamburger/auth */}
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/')} style={styles.logoBtn}>
            <Text style={styles.logoIcon}>{'♔'}</Text>
            <Text style={styles.logoText}>{title || 'ChesTourism'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightSection}>
          {user ? (
            <View style={styles.authRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name || user.email.split('@')[0]}
              </Text>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.hamburger}
          >
            <Text style={styles.hamburgerText}>{menuOpen ? 'X' : '='}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nav links row */}
      <View style={styles.navRow}>
        {NAV_LINKS.map((link) => (
          <TouchableOpacity
            key={link.href}
            onPress={() => {
              router.push(link.href as any);
              setMenuOpen(false);
            }}
            style={[styles.navLink, isActive(link.href) && styles.navLinkActive]}
          >
            <Text
              style={[
                styles.navLinkText,
                isActive(link.href) && styles.navLinkTextActive,
              ]}
            >
              {link.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Collapsible mobile menu (for dashboard links when logged in) */}
      {menuOpen && user && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity
            onPress={() => {
              router.push('/(dashboard)' as any);
              setMenuOpen(false);
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: '#F2E8E0',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 48,
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: Colors.brandPrimary,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  logoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  logoText: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    maxWidth: 120,
  },
  logoutBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  logoutText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  loginBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  loginText: {
    color: '#ffffff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  hamburger: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerText: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  // Navigation row
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.lg,
  },
  navLink: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  navLinkActive: {
    borderBottomColor: Colors.brandPrimary,
  },
  navLinkText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  navLinkTextActive: {
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.semibold,
  },
  // Mobile menu
  mobileMenu: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  menuItem: {
    paddingVertical: Spacing.md,
  },
  menuItemText: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
