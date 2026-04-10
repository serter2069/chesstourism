import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: Colors.border, borderRadius: 6, marginBottom: mb }} />;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const WATCHLIST = [
  { id: 1, name: 'Oslo Rapid Cup', date: 'Jul 3-5, 2025', country: 'Norway', city: 'Oslo', fee: 'EUR 80', timeControl: 'Rapid' },
  { id: 2, name: 'Baku Open', date: 'Oct 5-12, 2025', country: 'Azerbaijan', city: 'Baku', fee: 'EUR 40', timeControl: 'Classical' },
  { id: 3, name: 'Prague Masters', date: 'Sep 1-8, 2025', country: 'Czech Republic', city: 'Prague', fee: 'EUR 90', timeControl: 'Classical' },
];

// ─── Watchlist Card ──────────────────────────────────────────────────────────

function WatchCard({
  name,
  date,
  city,
  country,
  fee,
  timeControl,
  onRegister,
}: {
  name: string;
  date: string;
  city: string;
  country: string;
  fee: string;
  timeControl: string;
  onRegister?: () => void;
}) {
  return (
    <View style={s.card}>
      <View style={s.cardBody}>
        <View style={s.cardLeft}>
          <Text style={s.cardName}>{name}</Text>
          <View style={s.metaRow}>
            <Feather name="calendar" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>{date}</Text>
          </View>
          <View style={s.metaRow}>
            <Feather name="map-pin" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>{city}, {country}</Text>
          </View>
          <View style={s.tagRow}>
            <View style={s.feePill}>
              <Text style={s.feeText}>{fee}</Text>
            </View>
            <View style={s.typePill}>
              <Text style={s.typeText}>{timeControl}</Text>
            </View>
          </View>
        </View>
        <View style={s.cardRight}>
          <TouchableOpacity style={s.registerBtn} activeOpacity={0.85} onPress={onRegister}>
            <Text style={s.registerBtnText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.removeBtn} activeOpacity={0.7}>
            <Feather name="trash-2" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Register Modal ──────────────────────────────────────────────────────────

function RegisterModal() {
  const t = WATCHLIST[0];
  return (
    <View style={s.modalOverlay}>
      <View style={s.modal}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitle}>Confirm Registration</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="x" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={s.modalBody}>
          <Text style={s.modalTournament}>{t.name}</Text>
          <View style={s.metaRow}>
            <Feather name="calendar" size={13} color={Colors.textMuted} />
            <Text style={s.modalMeta}>{t.date}</Text>
          </View>
          <View style={s.metaRow}>
            <Feather name="map-pin" size={13} color={Colors.textMuted} />
            <Text style={s.modalMeta}>{t.city}, {t.country}</Text>
          </View>
          <View style={s.modalDivider} />
          <View style={s.modalPriceRow}>
            <Text style={s.modalPriceLabel}>Entry Fee</Text>
            <Text style={s.modalPrice}>{t.fee}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.confirmBtn} activeOpacity={0.85}>
          <Text style={s.confirmBtnText}>Confirm & Pay {t.fee}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelModalBtn} activeOpacity={0.7}>
          <Text style={s.cancelModalText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Default ─────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="tournaments" />
      <View style={s.content}>
        <Text style={s.heading}>My Watchlist</Text>
        <Text style={s.subheading}>{WATCHLIST.length} tournaments saved</Text>
        {WATCHLIST.map((t) => (
          <WatchCard key={t.id} {...t} />
        ))}
      </View>
    </View>
  );
}

// ─── Register Modal State ────────────────────────────────────────────────────

function ModalState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="tournaments" />
      <View style={s.content}>
        <Text style={s.heading}>My Watchlist</Text>
        <Text style={s.subheading}>{WATCHLIST.length} tournaments saved</Text>
        {WATCHLIST.map((t) => (
          <WatchCard key={t.id} {...t} />
        ))}
      </View>
      <RegisterModal />
    </View>
  );
}

// ─── Loading ─────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="tournaments" />
      <View style={s.content}>
        <Skeleton h={24} w={180} mb={Spacing.sm} />
        <Skeleton h={14} w={140} mb={Spacing.lg} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={[s.card, { gap: Spacing.sm, padding: Spacing.md }]}>
            <Skeleton h={18} w="60%" />
            <Skeleton h={14} w="45%" />
            <Skeleton h={14} w="50%" />
            <Skeleton h={28} w={80} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="tournaments" />
      <View style={s.content}>
        <Text style={s.heading}>My Watchlist</Text>
        <View style={s.emptyWrap}>
          <Feather name="bookmark" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>Your watchlist is empty</Text>
          <Text style={s.emptyDesc}>Save tournaments you are interested in and register later</Text>
          <TouchableOpacity style={s.ctaBtn} activeOpacity={0.85}>
            <Feather name="search" size={16} color={Colors.primary} />
            <Text style={s.ctaBtnText}>Browse Tournaments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function WatchlistStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="3 tournaments in watchlist with Register and Remove actions">
        <DefaultState />
      </StateSection>

      <StateSection title="REGISTER_MODAL" description="Registration confirmation modal overlay">
        <ModalState />
      </StateSection>

      <StateSection title="LOADING" description="Skeleton list loading">
        <LoadingState />
      </StateSection>

      <StateSection title="EMPTY" description="Empty watchlist with Browse Tournaments CTA">
        <EmptyState />
      </StateSection>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    maxWidth: 430,
    position: 'relative',
  },
  content: {
    padding: Spacing.md,
  },
  heading: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  subheading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  cardName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 3,
  },
  metaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  feePill: {
    backgroundColor: Colors.statusWarningBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  feeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarningText,
  },
  typePill: {
    backgroundColor: Colors.statusInfoBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusInfoText,
  },
  registerBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  registerBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  // Modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,27,62,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  modalTournament: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  modalMeta: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPriceLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  modalPrice: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  confirmBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confirmBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  cancelModalBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelModalText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  emptyDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  ctaBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
});
