import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

function StatusBadge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Feather name={icon as any} size={14} color={Colors.textMuted} />
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

function TabBar({ tabs, active }: { tabs: string[]; active: number }) {
  return (
    <View style={s.tabBar}>
      {tabs.map((t, i) => (
        <TouchableOpacity key={t} style={[s.tab, i === active && s.tabActive]} activeOpacity={0.7}>
          <Text style={[s.tabText, i === active && s.tabTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const TABS = ['Overview', 'Players', 'Results', 'Schedule', 'Announcements'];

function TournamentHero({ status, statusBg, statusFg }: { status: string; statusBg: string; statusFg: string }) {
  return (
    <View>
      <Image
        source={{ uri: 'https://picsum.photos/seed/tbilisi-chess/1200/400' }}
        style={{ width: '100%' as any, height: 180, borderRadius: 0 }}
        resizeMode="cover"
      />
      <View style={s.heroContent}>
        <StatusBadge label={status} bg={statusBg} fg={statusFg} />
        <Text style={s.heroTitle}>Tbilisi Open 2025</Text>
        <View style={s.heroMeta}>
          <View style={s.heroMetaItem}>
            <Feather name="map-pin" size={14} color={Colors.textMuted} />
            <Text style={s.heroMetaText}>Tbilisi, Georgia</Text>
          </View>
          <View style={s.heroMetaItem}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.heroMetaText}>June 14-21, 2025</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TournamentDetails() {
  return (
    <View style={s.detailsSection}>
      <View style={s.commissarRow}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/commissar-giorgi/200/200' }}
          style={{ width: 36, height: 36, borderRadius: 18 }}
          resizeMode="cover"
        />
        <View>
          <Text style={s.commissarLabel}>Commissar</Text>
          <Text style={s.commissarName}>Giorgi Beridze</Text>
        </View>
      </View>
      <Text style={s.description}>
        The Tbilisi Open 2025 is a prestigious classical chess tournament held in the historic capital of Georgia. Open to players of all FIDE ratings, this 7-round Swiss system event offers a unique opportunity to compete while exploring one of the world's oldest cities.
      </Text>
      <View style={s.infoBlock}>
        <InfoRow icon="dollar-sign" label="Entry Fee" value={'\u20AC50'} />
        <InfoRow icon="clock" label="Time Control" value="Classical 90+30" />
        <InfoRow icon="users" label="Capacity" value="87 / 120 players" />
        <InfoRow icon="layers" label="Format" value="7-round Swiss" />
      </View>
    </View>
  );
}

// STATE: DEFAULT
function DefaultState() {
  return (
    <View style={s.page}>
      <TournamentHero status="OPEN" statusBg={Colors.statusSuccessBg} statusFg={Colors.eloPositive} />
      <TournamentDetails />
      <TouchableOpacity style={s.registerBtn} activeOpacity={0.85}>
        <Text style={s.registerBtnText}>Register for this Tournament</Text>
        <Feather name="arrow-right" size={16} color={Colors.primary} />
      </TouchableOpacity>
      <TabBar tabs={TABS} active={0} />
      <View style={s.tabContent}>
        <Text style={s.sectionTitle}>About the Tournament</Text>
        <Text style={s.bodyText}>
          The Tbilisi Open features 7 rounds of classical chess played over 8 days. The tournament is FIDE-rated and follows standard FIDE regulations. Prizes are awarded to the top 10 finishers as well as category prizes for juniors, seniors, and women.
        </Text>
      </View>
    </View>
  );
}

// STATE: REGISTERED
function RegisteredState() {
  return (
    <View style={s.page}>
      <View style={s.successBanner}>
        <Feather name="check-circle" size={16} color={Colors.eloPositive} />
        <Text style={s.successBannerText}>You are registered for this tournament</Text>
      </View>
      <TournamentHero status="OPEN" statusBg={Colors.statusSuccessBg} statusFg={Colors.eloPositive} />
      <TournamentDetails />
      <View style={s.registeredBtn}>
        <Feather name="check" size={16} color={Colors.eloPositive} />
        <Text style={s.registeredBtnText}>Registered</Text>
      </View>
      <TabBar tabs={TABS} active={0} />
    </View>
  );
}

// STATE: IN_PROGRESS
function InProgressState() {
  return (
    <View style={s.page}>
      <TournamentHero status="IN PROGRESS" statusBg={Colors.statusInfoBg} statusFg={Colors.primary} />
      <TournamentDetails />
      <View style={s.roundInfo}>
        <Feather name="activity" size={16} color={Colors.gold} />
        <Text style={s.roundInfoText}>Round 3 of 7 is currently in progress</Text>
      </View>
      <TouchableOpacity style={s.liveBtn} activeOpacity={0.85}>
        <Feather name="radio" size={14} color={Colors.background} />
        <Text style={s.liveBtnText}>View Live Results</Text>
      </TouchableOpacity>
      <TabBar tabs={TABS} active={2} />
    </View>
  );
}

// STATE: COMPLETED
function CompletedState() {
  return (
    <View style={s.page}>
      <TournamentHero status="COMPLETED" statusBg={Colors.backgroundAlt} statusFg={Colors.textMuted} />
      <View style={s.winnerBanner}>
        <Feather name="award" size={20} color={Colors.gold} />
        <View>
          <Text style={s.winnerLabel}>Tournament Winner</Text>
          <Text style={s.winnerName}>Magnus Eriksson (2156)</Text>
        </View>
      </View>
      <TournamentDetails />
      <Text style={s.sectionTitle}>Final Standings</Text>
      {[
        { rank: 1, name: 'Magnus Eriksson', elo: 2156, pts: '6.0/7' },
        { rank: 2, name: 'Armen Petrosyan', elo: 2089, pts: '5.5/7' },
        { rank: 3, name: 'Piotr Kowalski', elo: 2045, pts: '5.0/7' },
      ].map(p => (
        <View key={p.rank} style={s.standingRow}>
          <Text style={s.standingRank}>{p.rank}.</Text>
          <Text style={s.standingName}>{p.name}</Text>
          <Text style={s.standingElo}>{p.elo}</Text>
          <Text style={s.standingPts}>{p.pts}</Text>
        </View>
      ))}
      <TabBar tabs={TABS} active={2} />
    </View>
  );
}

// STATE: LOADING
function LoadingState() {
  return (
    <View style={s.page}>
      <View style={{ height: 180, backgroundColor: Colors.border }} />
      <View style={{ padding: Spacing.lg, gap: Spacing.md }}>
        <View style={{ height: 20, width: 80, backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 28, backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 14, width: '60%', backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 14, width: '45%', backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm }} />
        <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 14, width: '70%', backgroundColor: Colors.border, borderRadius: 4 }} />
        <View style={{ height: 44, backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.md }} />
      </View>
    </View>
  );
}

// STATE: REGISTRATION_FORM
function RegistrationFormState() {
  const [fideId, setFideId] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={s.page}>
      <TournamentHero status="OPEN" statusBg={Colors.statusSuccessBg} statusFg={Colors.eloPositive} />
      <View style={s.modalOverlay}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Register for Tournament</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="x" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={s.modalSubtitle}>Tbilisi Open 2025 -- {'\u20AC'}50 entry fee</Text>
          <View style={s.formGroup}>
            <Text style={s.formLabel}>FIDE ID</Text>
            <TextInput
              style={s.formInput}
              placeholder="Enter your FIDE ID"
              placeholderTextColor={Colors.textMuted}
              value={fideId}
              onChangeText={setFideId}
            />
          </View>
          <View style={s.formGroup}>
            <Text style={s.formLabel}>Country</Text>
            <TouchableOpacity style={s.formSelect} activeOpacity={0.7}>
              <Text style={s.formSelectText}>Select country</Text>
              <Feather name="chevron-down" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.checkboxRow} activeOpacity={0.7} onPress={() => setAgreed(!agreed)}>
            <View style={[s.checkbox, agreed && s.checkboxChecked]}>
              {agreed && <Feather name="check" size={12} color={Colors.background} />}
            </View>
            <Text style={s.checkboxText}>I agree to the tournament rules and regulations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
            <Text style={s.payBtnText}>Pay {'\u20AC'}50 and Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// STATE: PAYMENT_PENDING
function PaymentPendingState() {
  return (
    <View style={s.page}>
      <TournamentHero status="OPEN" statusBg={Colors.statusSuccessBg} statusFg={Colors.eloPositive} />
      <View style={s.modalOverlay}>
        <View style={s.modal}>
          <Text style={s.modalTitle}>Payment</Text>
          <View style={s.amountRow}>
            <Text style={s.amountLabel}>Amount</Text>
            <Text style={s.amountValue}>{'\u20AC'}50.00</Text>
          </View>
          <View style={s.formGroup}>
            <Text style={s.formLabel}>Card Number</Text>
            <TextInput style={s.formInput} placeholder="1234 5678 9012 3456" placeholderTextColor={Colors.textMuted} />
          </View>
          <View style={s.formRow}>
            <View style={[s.formGroup, { flex: 1 }]}>
              <Text style={s.formLabel}>Expiry</Text>
              <TextInput style={s.formInput} placeholder="MM/YY" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={[s.formGroup, { flex: 1 }]}>
              <Text style={s.formLabel}>CVV</Text>
              <TextInput style={s.formInput} placeholder="123" placeholderTextColor={Colors.textMuted} />
            </View>
          </View>
          <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
            <Feather name="lock" size={14} color={Colors.primary} />
            <Text style={s.payBtnText}>Pay {'\u20AC'}50.00</Text>
          </TouchableOpacity>
          <Text style={s.secureText}>
            Secured by Stripe. Your payment details are encrypted.
          </Text>
        </View>
      </View>
    </View>
  );
}

// STATE: REGISTERED_FULL
function RegisteredFullState() {
  return (
    <View style={s.page}>
      <View style={s.warningBanner}>
        <Feather name="alert-circle" size={16} color={Colors.statusWarningText} />
        <Text style={s.warningBannerText}>Registration is closed - capacity reached (120/120)</Text>
      </View>
      <TournamentHero status="OPEN" statusBg={Colors.statusWarningBg} statusFg={Colors.statusWarningText} />
      <TournamentDetails />
      <View style={s.disabledBtn}>
        <Text style={s.disabledBtnText}>Registration Closed</Text>
      </View>
      <TabBar tabs={TABS} active={0} />
    </View>
  );
}

// STATE: CANCELLED
function CancelledState() {
  return (
    <View style={s.page}>
      <View style={s.errorBanner}>
        <Feather name="x-circle" size={16} color={Colors.error} />
        <View>
          <Text style={s.errorBannerTitle}>Tournament Cancelled</Text>
          <Text style={s.errorBannerText}>This tournament has been cancelled by the organizer. All registered players will receive a full refund within 5-7 business days.</Text>
        </View>
      </View>
      <TournamentHero status="CANCELLED" statusBg={Colors.statusErrorBg} statusFg={Colors.error} />
      <TournamentDetails />
      <View style={s.refundInfo}>
        <Feather name="credit-card" size={16} color={Colors.textMuted} />
        <Text style={s.refundText}>Refund of {'\u20AC'}50 is being processed</Text>
      </View>
    </View>
  );
}

export default function TournamentDetailStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Tournament detail page - open for registration">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <DefaultState />
              </View>
</StateSection>

      <StateSection title="REGISTERED" description="User is registered, confirmation banner">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <RegisteredState />
              </View>
</StateSection>

      <StateSection title="IN_PROGRESS" description="Tournament is live, round 3 of 7">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <InProgressState />
              </View>
</StateSection>

      <StateSection title="COMPLETED" description="Tournament finished, winner announced">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <CompletedState />
              </View>
</StateSection>

      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <LoadingState />
              </View>
</StateSection>

      <StateSection title="REGISTRATION_FORM" description="Registration form overlay">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <RegistrationFormState />
              </View>
</StateSection>

      <StateSection title="PAYMENT_PENDING" description="Payment form with card fields">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <PaymentPendingState />
              </View>
</StateSection>

      <StateSection title="REGISTERED_FULL" description="Capacity reached, registration closed">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <RegisteredFullState />
              </View>
</StateSection>

      <StateSection title="CANCELLED" description="Tournament cancelled with refund info">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <CancelledState />
              </View>
</StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
  },
  heroContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  heroMetaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  commissarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  commissarLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  commissarName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  infoBlock: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    width: 90,
  },
  infoValue: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    flex: 1,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 4,
  },
  registerBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  registeredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.eloPositive,
  },
  registeredBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.eloPositive,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.gold,
  },
  tabText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  tabTextActive: {
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  tabContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  bodyText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg,
    padding: Spacing.md,
  },
  successBannerText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.eloPositive,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusWarningBg,
    padding: Spacing.md,
  },
  warningBannerText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.statusWarningText,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.statusErrorBg,
    padding: Spacing.md,
  },
  errorBannerTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginBottom: 4,
  },
  errorBannerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    lineHeight: 18,
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusWarningBg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: Spacing.md,
    borderRadius: 8,
  },
  roundInfoText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.statusWarningText,
  },
  liveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 4,
  },
  liveBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.background,
  },
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.statusWarningBg,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  winnerLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  winnerName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  standingRank: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    width: 28,
  },
  standingName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    flex: 1,
  },
  standingElo: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    width: 50,
    textAlign: 'right',
  },
  standingPts: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    width: 50,
    textAlign: 'right',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  modalSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  formGroup: {
    gap: Spacing.xs,
  },
  formLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  formSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  formSelectText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  checkboxText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: 4,
  },
  payBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: 8,
  },
  amountLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  amountValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
  },
  secureText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  disabledBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabledBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  refundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
  },
  refundText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
});
