import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavVariant } from '../../constants/pageRegistry';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ProtoNavProps {
  variant: NavVariant;
  activeTab?: string;
}

// ─── Public header (guest / landing) ─────────────────────────────────────────

function PublicNav() {
  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
        </View>
        <Text style={styles.logoText}>Chess</Text>
        <Text style={styles.logoGold}>Tourism</Text>
      </View>
      <View style={styles.navLinks}>
        {['Tournaments', 'Commissars', 'Rankings'].map((l) => (
          <TouchableOpacity key={l} activeOpacity={0.7}>
            <Text style={styles.navLink}>{l}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.signInBtn} activeOpacity={0.8}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Auth header (centered logo, no nav) ─────────────────────────────────────

function AuthNav() {
  return (
    <View style={[styles.header, styles.headerCentered]}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
          <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
        </View>
        <Text style={styles.logoText}>Chess</Text>
        <Text style={styles.logoGold}>Tourism</Text>
      </View>
    </View>
  );
}

// ─── Client header + bottom tab bar ──────────────────────────────────────────

const CLIENT_TABS = [
  { key: 'home',      icon: 'home',      label: 'Home' },
  { key: 'tournaments', icon: 'award',   label: 'Tournaments' },
  { key: 'cabinet',   icon: 'briefcase', label: 'Cabinet' },
  { key: 'profile',   icon: 'user',      label: 'Profile' },
];

function ClientNav({ activeTab }: { activeTab?: string }) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
          </View>
          <Text style={styles.logoText}>Chess</Text>
          <Text style={styles.logoGold}>Tourism</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <Feather name="bell" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomTab}>
        {CLIENT_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} activeOpacity={0.7}>
              <Feather
                name={tab.icon as any}
                size={20}
                color={active ? Colors.gold : Colors.textMuted}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ─── Admin header ─────────────────────────────────────────────────────────────

const ADMIN_TABS = [
  { key: 'dashboard',    icon: 'grid',       label: 'Dashboard' },
  { key: 'users',        icon: 'users',      label: 'Users' },
  { key: 'tournaments',  icon: 'award',      label: 'Tournaments' },
  { key: 'moderation',   icon: 'shield',     label: 'Moderation' },
  { key: 'finances',     icon: 'dollar-sign', label: 'Finances' },
];

function AdminNav({ activeTab }: { activeTab?: string }) {
  return (
    <>
      <View style={[styles.header, styles.adminHeader]}>
        <Text style={styles.adminTitle}>Admin Panel</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>
      <View style={styles.bottomTab}>
        {ADMIN_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} activeOpacity={0.7}>
              <Feather
                name={tab.icon as any}
                size={18}
                color={active ? '#e07070' : Colors.textMuted}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelAdmin]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProtoNav({ variant, activeTab }: ProtoNavProps) {
  if (variant === 'none') return null;
  if (variant === 'auth') return <AuthNav />;
  if (variant === 'client') return <ClientNav activeTab={activeTab} />;
  if (variant === 'admin') return <AdminNav activeTab={activeTab} />;
  return <PublicNav />;
}

// Top header only — for use in ProtoLayout (renders above the back bar)
export function ProtoNavTop({ variant }: Pick<ProtoNavProps, 'variant'>) {
  if (variant === 'none') return null;
  if (variant === 'auth') return <AuthNav />;
  if (variant === 'client') {
    return (
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.primary }]} />
            <View style={[styles.logoDot, { backgroundColor: Colors.gold }]} />
          </View>
          <Text style={styles.logoText}>Chess</Text>
          <Text style={styles.logoGold}>Tourism</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <Feather name="bell" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }
  if (variant === 'admin') {
    return (
      <View style={[styles.header, styles.adminHeader]}>
        <Text style={styles.adminTitle}>Admin Panel</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>
    );
  }
  return <PublicNav />;
}

// Bottom nav is rendered separately for client/admin — export for use in page wrappers
export function ProtoBottomNav({ variant, activeTab }: ProtoNavProps) {
  if (variant === 'client') {
    return (
      <View style={styles.bottomTab}>
        {CLIENT_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} activeOpacity={0.7}>
              <Feather name={tab.icon as any} size={20} color={active ? Colors.gold : Colors.textMuted} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  if (variant === 'admin') {
    return (
      <View style={styles.bottomTab}>
        {ADMIN_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} activeOpacity={0.7}>
              <Feather name={tab.icon as any} size={18} color={active ? '#e07070' : Colors.textMuted} />
              <Text style={[styles.tabLabel, active && styles.tabLabelAdmin]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCentered: {
    justifyContent: 'center',
  },
  adminHeader: {
    backgroundColor: '#0f1318',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoMark: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logoDot: {
    width: 10,
    height: 10,
  },
  logoText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  logoGold: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  navLink: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  signInBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
  },
  signInText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  notifBtn: {
    padding: Spacing.xs,
  },
  adminTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: '#e07070',
  },
  adminBadge: {
    backgroundColor: '#2d1a1a',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  adminBadgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: '#e07070',
    letterSpacing: 0.8,
  },
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.gold,
  },
  tabLabelAdmin: {
    color: '#e07070',
  },
});
