import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { pages } from '../../../constants/pageRegistry';
import ProtoLayout from '../../../components/proto/ProtoLayout';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── State components ─────────────────────────────────────────────────────────
import OverviewStates from '../../../components/proto/states/OverviewStates';
import LandingStates from '../../../components/proto/states/LandingStates';
import TournamentsStates from '../../../components/proto/states/TournamentsStates';
import TournamentDetailStates from '../../../components/proto/states/TournamentDetailStates';
import CommissarsStates from '../../../components/proto/states/CommissarsStates';
import CommissarProfileStates from '../../../components/proto/states/CommissarProfileStates';
import UserProfileStates from '../../../components/proto/states/UserProfileStates';
import RatingsStates from '../../../components/proto/states/RatingsStates';
import EloHistoryStates from '../../../components/proto/states/EloHistoryStates';
import OrgApplyStates from '../../../components/proto/states/OrgApplyStates';
import CertVerifyStates from '../../../components/proto/states/CertVerifyStates';
import PaymentSuccessStates from '../../../components/proto/states/PaymentSuccessStates';
import LoginStates from '../../../components/proto/states/LoginStates';
import OtpStates from '../../../components/proto/states/OtpStates';
import DashboardStates from '../../../components/proto/states/DashboardStates';
import ProfileStates from '../../../components/proto/states/ProfileStates';
import MyRegistrationsStates from '../../../components/proto/states/MyRegistrationsStates';
import WatchlistStates from '../../../components/proto/states/WatchlistStates';
import NotificationsStates from '../../../components/proto/states/NotificationsStates';
import PaymentStates from '../../../components/proto/states/PaymentStates';
import CommissionerCabinetStates from '../../../components/proto/states/CommissionerCabinetStates';
import CommissionerEditStates from '../../../components/proto/states/CommissionerEditStates';
import MyTournamentsStates from '../../../components/proto/states/MyTournamentsStates';
import CreateTournamentStates from '../../../components/proto/states/CreateTournamentStates';
import TournamentHubStates from '../../../components/proto/states/TournamentHubStates';
import TournamentEditStates from '../../../components/proto/states/TournamentEditStates';
import TournamentRegistrationsStates from '../../../components/proto/states/TournamentRegistrationsStates';
import TournamentResultsStates from '../../../components/proto/states/TournamentResultsStates';
import TournamentPhotosStates from '../../../components/proto/states/TournamentPhotosStates';
import TournamentRoundsStates from '../../../components/proto/states/TournamentRoundsStates';
import TournamentScheduleStates from '../../../components/proto/states/TournamentScheduleStates';
import TournamentAnnouncementsStates from '../../../components/proto/states/TournamentAnnouncementsStates';
import AdminStates from '../../../components/proto/states/AdminStates';
import AdminUsersStates from '../../../components/proto/states/AdminUsersStates';
import AdminTournamentsStates from '../../../components/proto/states/AdminTournamentsStates';
import AdminOrganizationsStates from '../../../components/proto/states/AdminOrganizationsStates';
import AdminModerationStates from '../../../components/proto/states/AdminModerationStates';
import AdminFinancesStates from '../../../components/proto/states/AdminFinancesStates';
import AdminDisputesStates from '../../../components/proto/states/AdminDisputesStates';
import AdminWebhooksStates from '../../../components/proto/states/AdminWebhooksStates';
import AdminWebhookDetailStates from '../../../components/proto/states/AdminWebhookDetailStates';

// ─── Registry ─────────────────────────────────────────────────────────────────
const STATE_COMPONENTS: Record<string, React.ComponentType> = {
  // Overview (meta)
  overview: OverviewStates,
  // Public
  landing: LandingStates,
  tournaments: TournamentsStates,
  'tournament-detail': TournamentDetailStates,
  commissars: CommissarsStates,
  'commissar-profile': CommissarProfileStates,
  'user-profile': UserProfileStates,
  ratings: RatingsStates,
  'elo-history': EloHistoryStates,
  'org-apply': OrgApplyStates,
  'cert-verify': CertVerifyStates,
  'payment-success': PaymentSuccessStates,
  // Auth
  login: LoginStates,
  otp: OtpStates,
  // Dashboard
  dashboard: DashboardStates,
  profile: ProfileStates,
  'my-registrations': MyRegistrationsStates,
  watchlist: WatchlistStates,
  notifications: NotificationsStates,
  payment: PaymentStates,
  // Commissioner
  'commissioner-cabinet': CommissionerCabinetStates,
  'commissioner-edit': CommissionerEditStates,
  'my-tournaments': MyTournamentsStates,
  'create-tournament': CreateTournamentStates,
  'tournament-hub': TournamentHubStates,
  'tournament-edit': TournamentEditStates,
  'tournament-registrations': TournamentRegistrationsStates,
  'tournament-results': TournamentResultsStates,
  'tournament-photos': TournamentPhotosStates,
  'tournament-rounds': TournamentRoundsStates,
  'tournament-schedule': TournamentScheduleStates,
  'tournament-announcements': TournamentAnnouncementsStates,
  // Admin
  admin: AdminStates,
  'admin-users': AdminUsersStates,
  'admin-tournaments': AdminTournamentsStates,
  'admin-organizations': AdminOrganizationsStates,
  'admin-moderation': AdminModerationStates,
  'admin-finances': AdminFinancesStates,
  'admin-disputes': AdminDisputesStates,
  'admin-webhooks': AdminWebhooksStates,
  'admin-webhook-detail': AdminWebhookDetailStates,
};

// ─── WorkInProgress fallback ─────────────────────────────────────────────────

function WorkInProgress({ id, title, route, stateCount, nav }: {
  id: string; title: string; route: string; stateCount: number; nav: string;
}) {
  const router = useRouter();
  return (
    <View style={wip.root}>
      <View style={wip.iconWrap}>
        <Feather name="layers" size={32} color={Colors.primary} />
      </View>
      <Text style={wip.heading}>Not prototyped yet</Text>
      <Text style={wip.sub}>
        Create{' '}
        <Text style={wip.code}>components/proto/states/{id}States.tsx</Text>
        {' '}and register it in{' '}
        <Text style={wip.code}>[page].tsx</Text>
      </Text>

      <View style={wip.metaBlock}>
        <Row label="Route" value={route} />
        <Row label="Nav" value={nav} />
        <Row label="States" value={String(stateCount)} />
      </View>

      <TouchableOpacity style={wip.backBtn} onPress={() => router.push('/proto' as any)} activeOpacity={0.8}>
        <Feather name="arrow-left" size={14} color={Colors.gold} />
        <Text style={wip.backText}>Back to dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={wip.row}>
      <Text style={wip.label}>{label}</Text>
      <Text style={wip.value}>{value}</Text>
    </View>
  );
}

const wip = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    minHeight: 400,
  },
  iconWrap: {
    width: 64, height: 64,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
  },
  sub: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 420,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: Colors.border,
    color: Colors.gold,
  },
  metaBlock: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.lg,
    gap: Spacing.sm,
    minWidth: 280,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.xl },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  value: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.gold,
  },
});

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProtoStatePage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const pageDef = pages.find((p) => p.id === page);

  if (!pageDef) {
    return (
      <View style={[wip.root, { gap: Spacing.sm }]}>
        <Feather name="alert-circle" size={32} color={Colors.error} />
        <Text style={[wip.heading, { color: Colors.error }]}>Page not found</Text>
        <Text style={wip.sub}>"{page}" is not registered in pageRegistry.ts</Text>
      </View>
    );
  }

  const StatesComponent = STATE_COMPONENTS[pageDef.id];

  if (!StatesComponent) {
    return (
      <ProtoLayout title={pageDef.title} route={pageDef.route} nav={pageDef.nav}>
        <WorkInProgress
          id={pageDef.id}
          title={pageDef.title}
          route={pageDef.route}
          stateCount={pageDef.stateCount}
          nav={pageDef.nav}
        />
      </ProtoLayout>
    );
  }

  return (
    <ProtoLayout title={pageDef.title} route={pageDef.route} nav={pageDef.nav}>
      <StatesComponent />
    </ProtoLayout>
  );
}
