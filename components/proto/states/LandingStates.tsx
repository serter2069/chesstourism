import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { mockTournaments, mockRatings } from '../../../constants/protoMockData';

const BREAKPOINT = 900;

function useLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;
  const cols = isWide ? 4 : 2;
  const maxW = Math.min(width, 1200);
  return { isWide, cols, maxW, width };
}

import ProtoNav from '../ProtoNav';

// ─── Chess Logo Mark ──────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
  const half = size / 2;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap' }}>
      <View style={{ width: half, height: half, backgroundColor: Colors.gold }} />
      <View style={{ width: half, height: half, backgroundColor: Colors.primary }} />
      <View style={{ width: half, height: half, backgroundColor: Colors.primary }} />
      <View style={{ width: half, height: half, backgroundColor: Colors.gold }} />
    </View>
  );
}

// ─── Dark Nav (hero overlay variant — landing only) ───────────────────────────

const NAV_LINKS: { label: string; route: string }[] = [
  { label: 'Tournaments', route: '/proto/states/tournaments' },
  { label: 'Commissars', route: '/proto/states/commissars' },
  { label: 'Rankings', route: '/proto/states/ratings' },
];

function DarkNav() {
  const { isWide } = useLayout();
  const router = useRouter();
  return (
    <View style={navS.bar}>
      <TouchableOpacity style={navS.logoRow} activeOpacity={0.8}>
        <LogoMark size={24} />
        <Text style={navS.logoText}>Chess</Text>
        <Text style={navS.logoGold}>Tourism</Text>
      </TouchableOpacity>
      {isWide && (
        <View style={navS.links}>
          {NAV_LINKS.map((l) => (
            <TouchableOpacity key={l.label} style={navS.linkBtn} activeOpacity={0.7} onPress={() => router.push(l.route as any)}>
              <Text style={navS.linkText}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={navS.signInBtn} activeOpacity={0.8} onPress={() => router.push('/proto/states/login' as any)}>
        <Text style={navS.signInText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const navS = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    height: 60,
    backgroundColor: 'transparent',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoText: { fontFamily: Typography.fontFamilyHeading, fontSize: 17, fontWeight: '700', color: Colors.white },
  logoGold: { fontFamily: Typography.fontFamilyHeading, fontSize: 17, fontWeight: '700', color: Colors.gold },
  links: { flexDirection: 'row', gap: Spacing.xl },
  linkBtn: { paddingVertical: 4 },
  linkText: { fontSize: 14, fontFamily: Typography.fontFamilyMedium, color: 'rgba(255,255,255,0.65)' },
  signInBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  signInText: { fontSize: 13, fontFamily: Typography.fontFamilySemiBold, color: Colors.primary },
});

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const { isWide } = useLayout();
  const router = useRouter();
  return (
    <View style={heroS.root}>
      {/* Hero background — chess tournament hall */}
      <Image
        source={{ uri: 'https://picsum.photos/seed/chess-grand-hall/1200/600' }}
        style={{ ...StyleSheet.absoluteFillObject } as any}
        resizeMode="cover"
      />
      {/* Dark overlay */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,20,40,0.75)' }} />
      {/* Pattern overlay — thin gold lines */}
      <View style={heroS.patternOverlay} />

      <View style={[heroS.content, isWide && heroS.contentWide]}>
        {/* Label */}
        <View style={heroS.labelRow}>
          <View style={heroS.labelDot} />
          <Text style={heroS.labelText}>International Chess Tourism Association</Text>
        </View>

        <Text style={[heroS.h1, isWide && heroS.h1Wide]}>
          Play Chess.{'\n'}Explore the World.
        </Text>
        <Text style={[heroS.subtitle, isWide && heroS.subtitleWide]}>
          Discover FIDE-rated tournaments in 50+ countries. Register online,
          pay securely, and connect with commissars worldwide.
        </Text>

        <View style={heroS.btnRow}>
          <TouchableOpacity style={heroS.btnPrimary} activeOpacity={0.85} onPress={() => router.push('/proto/states/tournaments' as any)}>
            <Text style={heroS.btnPrimaryText}>Browse Tournaments</Text>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={heroS.btnGhost} activeOpacity={0.85} onPress={() => router.push('/proto/states/org-apply' as any)}>
            <Text style={heroS.btnGhostText}>Become a Commissar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom stats strip */}
      <View style={heroS.statsStrip}>
        {[
          { value: '2,400+', label: 'Registered Players' },
          { value: '50+', label: 'Countries' },
          { value: '180+', label: 'Tournaments Hosted' },
          { value: '12,000+', label: 'Games Played' },
        ].map((s, i) => (
          <View key={s.label} style={[heroS.statItem, i > 0 && heroS.statBorder]}>
            <Text style={heroS.statValue}>{s.value}</Text>
            <Text style={heroS.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const heroS = StyleSheet.create({
  root: { minHeight: 560, justifyContent: 'flex-end' },
  patternOverlay: { ...StyleSheet.absoluteFillObject },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing['3xl'], paddingBottom: Spacing['2xl'] },
  contentWide: { maxWidth: 700 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  labelDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  labelText: { fontSize: 12, fontFamily: Typography.fontFamilyMedium, color: Colors.gold, letterSpacing: 1, textTransform: 'uppercase' },
  h1: { fontFamily: Typography.fontFamilyHeading, fontSize: 40, lineHeight: 50, color: Colors.white, marginBottom: Spacing.md },
  h1Wide: { fontSize: 56, lineHeight: 68 },
  subtitle: { fontSize: 16, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.75)', lineHeight: 26, marginBottom: Spacing.xl, maxWidth: 520 },
  subtitleWide: { fontSize: 17 },
  btnRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, paddingVertical: 14, paddingHorizontal: Spacing.xl,
    borderRadius: 4,
  },
  btnPrimaryText: { fontSize: 15, fontFamily: Typography.fontFamilySemiBold, color: Colors.primary },
  btnGhost: {
    paddingVertical: 14, paddingHorizontal: Spacing.xl,
    borderRadius: 4, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  btnGhostText: { fontSize: 15, fontFamily: Typography.fontFamilySemiBold, color: Colors.white },
  statsStrip: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs },
  statBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.12)' },
  statValue: { fontSize: 20, fontFamily: Typography.fontFamilyHeading, color: Colors.gold, fontWeight: '700' },
  statLabel: { fontSize: 11, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.55)', marginTop: 2, textAlign: 'center' },
});

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub, linkLabel, linkRoute }: { title: string; sub?: string; linkLabel?: string; linkRoute?: string }) {
  const router = useRouter();
  return (
    <View style={shS.row}>
      <View style={{ flex: 1 }}>
        <Text style={shS.title}>{title}</Text>
        {sub && <Text style={shS.sub}>{sub}</Text>}
      </View>
      {linkLabel && (
        <TouchableOpacity style={shS.linkBtn} activeOpacity={0.7} onPress={() => linkRoute && router.push(linkRoute as any)}>
          <Text style={shS.linkText}>{linkLabel}</Text>
          <Feather name="chevron-right" size={14} color={Colors.gold} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const shS = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.lg },
  title: { fontFamily: Typography.fontFamilyHeading, fontSize: 26, color: Colors.text },
  sub: { fontFamily: Typography.fontFamily, fontSize: 14, color: Colors.textMuted, marginTop: 4, lineHeight: 20 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 13, fontFamily: Typography.fontFamilySemiBold, color: Colors.gold },
});

// ─── Tournament Cards ─────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: Colors.statusSuccessBg, text: Colors.eloPositive },
  in_progress: { label: 'In Progress', bg: Colors.statusInfoBg, text: Colors.primary },
  completed: { label: 'Completed', bg: Colors.backgroundAlt, text: Colors.textMuted },
  cancelled: { label: 'Cancelled', bg: Colors.statusErrorBg, text: Colors.error },
};

function TCard({ t }: { t: typeof mockTournaments[0] }) {
  const meta = STATUS_META[t.status] ?? STATUS_META.completed;
  const startY = new Date(t.startDate).getFullYear();
  const startM = new Date(t.startDate).toLocaleString('en', { month: 'short' });
  const startD = new Date(t.startDate).getDate();
  const router = useRouter();
  return (
    <TouchableOpacity style={tS.card} activeOpacity={0.85} onPress={() => router.push('/proto/states/tournament-detail' as any)}>
      {/* Tournament image — unique per city */}
      <View style={tS.imgWrap}>
        <Image
          source={{ uri: `https://picsum.photos/seed/chess-${t.city.toLowerCase()}/800/400` }}
          style={{ width: '100%' as any, height: 150 }}
          resizeMode="cover"
        />
        <View style={tS.imgOverlay} />
        {/* Date badge */}
        <View style={tS.dateBadge}>
          <Text style={tS.dateDay}>{startD}</Text>
          <Text style={tS.dateMon}>{startM} {startY}</Text>
        </View>
        {/* Status */}
        <View style={[tS.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={[tS.statusText, { color: meta.text }]}>{meta.label}</Text>
        </View>
      </View>
      <View style={tS.body}>
        <Text style={tS.title} numberOfLines={2}>{t.title}</Text>
        <View style={tS.infoRow}>
          <Feather name="map-pin" size={12} color={Colors.textMuted} />
          <Text style={tS.infoText}>{t.city}, {t.country}</Text>
        </View>
        <View style={tS.footer}>
          <View style={tS.feePill}>
            <Text style={tS.feeText}>{t.fee > 0 ? `€${t.fee}` : 'Free'}</Text>
          </View>
          <Text style={tS.control}>{t.timeControl}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const tS = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    // shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imgWrap: { height: 150, position: 'relative', overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  imgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,27,62,0.35)' },
  dateBadge: {
    position: 'absolute', top: Spacing.sm, left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderRadius: 4, alignItems: 'center',
  },
  dateDay: { fontSize: 16, fontFamily: Typography.fontFamilyBold, color: Colors.gold, lineHeight: 18 },
  dateMon: { fontSize: 9, fontFamily: Typography.fontFamilySemiBold, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: { fontSize: 10, fontFamily: Typography.fontFamilySemiBold, textTransform: 'uppercase', letterSpacing: 0.5 },
  body: { padding: Spacing.md, gap: Spacing.xs },
  title: { fontSize: 15, fontFamily: Typography.fontFamilySemiBold, color: Colors.text, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 2 },
  infoText: { fontSize: 12, fontFamily: Typography.fontFamily, color: Colors.textMuted },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  feePill: { backgroundColor: Colors.statusWarningBg, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 20 },
  feeText: { fontSize: 12, fontFamily: Typography.fontFamilySemiBold, color: Colors.statusWarningText },
  control: { fontSize: 11, fontFamily: Typography.fontFamily, color: Colors.textMuted },
});

function TournamentsSection() {
  const { cols } = useLayout();
  const cardW = cols > 2 ? `${Math.floor(100 / cols) - 1.5}%` : '48%';
  return (
    <View style={secS.section}>
      <SectionHeader title="Upcoming Tournaments" sub="Open for registration worldwide" linkLabel="View all" linkRoute="/proto/states/tournaments" />
      <View style={secS.grid}>
        {mockTournaments.map((t) => (
          <View key={t.id} style={{ width: cardW as any, marginBottom: Spacing.md }}>
            <TCard t={t} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Mini Event Calendar ──────────────────────────────────────────────────────

const EVENTS = [
  { date: 'Apr 15', city: 'Tbilisi', title: 'Tbilisi Open 2025', type: 'Classical' },
  { date: 'May 3', city: 'Oslo', title: 'Oslo Rapid Cup', type: 'Rapid' },
  { date: 'Jun 12', city: 'Yerevan', title: 'Yerevan Blitz Championship', type: 'Blitz' },
  { date: 'Jun 28', city: 'Warsaw', title: 'Warsaw Classical Open', type: 'Classical' },
  { date: 'Jul 8', city: 'Budapest', title: 'Budapest Masters', type: 'Rapid' },
  { date: 'Aug 2', city: 'Baku', title: 'Caspian Open', type: 'Classical' },
];

const TYPE_COLOR: Record<string, string> = {
  Classical: Colors.primary,
  Rapid: Colors.eloPositive,
  Blitz: Colors.error,
};

function CalendarSection() {
  return (
    <View style={[secS.section, secS.altBg]}>
      <SectionHeader title="Event Calendar" sub="Chess events coming up worldwide" linkLabel="Full calendar" linkRoute="/proto/states/tournaments" />
      <View style={calS.list}>
        {EVENTS.map((ev, i) => (
          <TouchableOpacity key={i} style={calS.row} activeOpacity={0.8}>
            <View style={calS.datePill}>
              <Text style={calS.dateText}>{ev.date.split(' ')[0]}</Text>
              <Text style={calS.dateMon}>{ev.date.split(' ')[1]}</Text>
            </View>
            <View style={calS.bar} />
            <View style={{ flex: 1 }}>
              <Text style={calS.evTitle}>{ev.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 3 }}>
                <Feather name="map-pin" size={11} color={Colors.textMuted} />
                <Text style={calS.evMeta}>{ev.city}</Text>
                <View style={[calS.typeBadge, { backgroundColor: TYPE_COLOR[ev.type] + '18' }]}>
                  <Text style={[calS.typeText, { color: TYPE_COLOR[ev.type] }]}>{ev.type}</Text>
                </View>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={Colors.border} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const calS = StyleSheet.create({
  list: { gap: 1 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  datePill: {
    width: 44, alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: 8,
    paddingVertical: Spacing.xs,
  },
  dateText: { fontSize: 17, fontFamily: Typography.fontFamilyBold, color: Colors.gold, lineHeight: 20 },
  dateMon: { fontSize: 9, fontFamily: Typography.fontFamilySemiBold, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase' },
  bar: { width: 2, height: 36, backgroundColor: Colors.border, borderRadius: 1 },
  evTitle: { fontSize: 14, fontFamily: Typography.fontFamilySemiBold, color: Colors.text },
  evMeta: { fontSize: 12, fontFamily: Typography.fontFamily, color: Colors.textMuted },
  typeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 10 },
  typeText: { fontSize: 10, fontFamily: Typography.fontFamilySemiBold, textTransform: 'uppercase', letterSpacing: 0.4 },
});

// ─── Rankings ────────────────────────────────────────────────────────────────

const TOP3_COLORS = [Colors.gold, Colors.silver, Colors.bronze] as const;

function RankingsSection() {
  const { isWide } = useLayout();
  return (
    <View style={secS.section}>
      <SectionHeader title="Top Rankings" sub="World ranking by ELO score" linkLabel="Full list" linkRoute="/proto/states/ratings" />
      <View style={[rankS.tableWrap, isWide && { maxWidth: 700 }]}>
        {/* Header */}
        <View style={rankS.thead}>
          <Text style={[rankS.th, { width: 44 }]}>#</Text>
          <Text style={[rankS.th, { flex: 1 }]}>Player</Text>
          <Text style={[rankS.th, { width: 60, textAlign: 'right' }]}>ELO</Text>
          <Text style={[rankS.th, { width: 50, textAlign: 'right' }]}>T. Played</Text>
        </View>
        {mockRatings.slice(0, 5).map((r, i) => (
          <TouchableOpacity key={r.rank} style={[rankS.row, i % 2 === 0 && rankS.rowAlt]} activeOpacity={0.75}>
            <View style={[rankS.rankCell, { width: 44 }]}>
              {i < 3 ? (
                <View style={[rankS.medalBadge, { backgroundColor: TOP3_COLORS[i] + '22', borderColor: TOP3_COLORS[i] }]}>
                  <Text style={[rankS.medalNum, { color: TOP3_COLORS[i] }]}>{r.rank}</Text>
                </View>
              ) : (
                <Text style={rankS.rankNum}>{r.rank}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={rankS.name}>{r.name}</Text>
              <Text style={rankS.country}>{r.country}</Text>
            </View>
            <Text style={[rankS.elo, { width: 60 }]}>{r.rating}</Text>
            <Text style={[rankS.tp, { width: 50 }]}>{r.tournamentCount ?? 0}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const rankS = StyleSheet.create({
  tableWrap: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  thead: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  th: { fontSize: 11, fontFamily: Typography.fontFamilySemiBold, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 10,
  },
  rowAlt: { backgroundColor: Colors.backgroundAlt },
  rankCell: { alignItems: 'center' },
  medalBadge: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  medalNum: { fontSize: 11, fontFamily: Typography.fontFamilyBold, fontWeight: '700' },
  rankNum: { fontSize: 13, fontFamily: Typography.fontFamilyBold, color: Colors.textMuted, textAlign: 'center' },
  name: { fontSize: 14, fontFamily: Typography.fontFamilySemiBold, color: Colors.text },
  country: { fontSize: 12, fontFamily: Typography.fontFamily, color: Colors.textMuted },
  elo: { fontSize: 15, fontFamily: Typography.fontFamilyBold, color: Colors.primary, textAlign: 'right' },
  tp: { fontSize: 13, fontFamily: Typography.fontFamily, color: Colors.textMuted, textAlign: 'right' },
});

// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01', icon: 'search' as const,
    title: 'Discover',
    desc: 'Browse FIDE-rated tournaments by location, time control, rating class, and entry fee. Filter by country or date range.',
  },
  {
    n: '02', icon: 'user-check' as const,
    title: 'Register',
    desc: 'Create your profile, add your FIDE ID, and register for any open tournament in seconds. Pay the entry fee online.',
  },
  {
    n: '03', icon: 'award' as const,
    title: 'Compete',
    desc: 'Arrive at the venue and compete under the supervision of our certified commissars. All rounds handled digitally.',
  },
  {
    n: '04', icon: 'trending-up' as const,
    title: 'Climb',
    desc: 'Your ELO is updated after each event. Track your history, compare with the global ranking, and earn certificates.',
  },
];

function HowItWorks() {
  const { isWide } = useLayout();
  return (
    <View style={[secS.section, secS.altBg]}>
      <SectionHeader title="How It Works" sub="From discovery to the final round" linkLabel="Get started" linkRoute="/proto/states/login" />
      <View style={[howS.grid, isWide && howS.gridWide]}>
        {STEPS.map((s, i) => (
          <View key={s.n} style={[howS.card, isWide && howS.cardWide]}>
            <View style={howS.topRow}>
              <View style={howS.iconCircle}>
                <Feather name={s.icon} size={20} color={Colors.gold} />
              </View>
              <Text style={howS.stepNum}>{s.n}</Text>
            </View>
            <Text style={howS.stepTitle}>{s.title}</Text>
            <Text style={howS.stepDesc}>{s.desc}</Text>
            {i < STEPS.length - 1 && isWide && <View style={howS.connector} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const howS = StyleSheet.create({
  grid: { gap: Spacing.md },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    backgroundColor: Colors.background, borderRadius: 12,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  cardWide: { flex: 1, minWidth: 200 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { fontSize: 28, fontFamily: Typography.fontFamilyHeading, color: Colors.border, fontWeight: '700' },
  stepTitle: { fontSize: 17, fontFamily: Typography.fontFamilyBold, color: Colors.text, marginBottom: Spacing.sm },
  stepDesc: { fontSize: 14, fontFamily: Typography.fontFamily, color: Colors.textMuted, lineHeight: 22 },
  connector: {
    position: 'absolute', top: 28, right: -Spacing.md - 1,
    width: Spacing.md * 2 + 2, height: 1,
    backgroundColor: Colors.border,
  },
});

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CtaSection() {
  const { isWide } = useLayout();
  const router = useRouter();
  return (
    <View style={ctaS.section}>
      <Image
        source={{ uri: 'https://picsum.photos/seed/chess-venue-hall/1200/400' }}
        style={{ ...StyleSheet.absoluteFillObject } as any}
        resizeMode="cover"
      />
      <View style={ctaS.overlay} />
      <View style={[ctaS.inner, isWide && ctaS.innerWide]}>
        <View style={[ctaS.cardDark, isWide && { flex: 1 }]}>
          <Text style={ctaS.cardLabel}>For Tournament Organizers</Text>
          <Text style={ctaS.cardTitle}>Become a Certified Commissar</Text>
          <Text style={ctaS.cardDesc}>Get accredited by the International Chess Tourism Association and manage tournaments on our platform. Earn income organizing events in your city.</Text>
          <TouchableOpacity style={ctaS.btnGold} activeOpacity={0.85} onPress={() => router.push('/proto/states/org-apply' as any)}>
            <Text style={ctaS.btnGoldText}>Apply Now</Text>
            <Feather name="arrow-right" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={[ctaS.cardLight, isWide && { flex: 1 }]}>
          <Text style={[ctaS.cardLabel, { color: Colors.textMuted }]}>For Venues & Clubs</Text>
          <Text style={[ctaS.cardTitle, { color: Colors.text }]}>Host a Tournament at Your Venue</Text>
          <Text style={[ctaS.cardDesc, { color: Colors.textMuted }]}>Partner with us to host FIDE-rated events. We provide the full platform -- registration, payments, results, and certificates.</Text>
          <TouchableOpacity style={ctaS.btnOutline} activeOpacity={0.85} onPress={() => router.push('/proto/states/org-apply' as any)}>
            <Text style={ctaS.btnOutlineText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const ctaS = StyleSheet.create({
  section: { minHeight: 400, justifyContent: 'center', paddingVertical: Spacing['3xl'] },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,27,62,0.6)' },
  inner: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  innerWide: { flexDirection: 'row', gap: Spacing.lg, maxWidth: 1000, alignSelf: 'center' },
  cardDark: {
    backgroundColor: Colors.primary, borderRadius: 16, padding: Spacing.xl,
    gap: Spacing.sm, borderWidth: 1, borderColor: 'rgba(200,169,110,0.3)',
  },
  cardLight: {
    backgroundColor: Colors.background, borderRadius: 16, padding: Spacing.xl, gap: Spacing.sm,
  },
  cardLabel: { fontSize: 11, fontFamily: Typography.fontFamilySemiBold, color: Colors.gold, textTransform: 'uppercase', letterSpacing: 0.8 },
  cardTitle: { fontSize: 20, fontFamily: Typography.fontFamilyHeading, color: Colors.white, lineHeight: 26 },
  cardDesc: { fontSize: 14, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  btnGold: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold, paddingVertical: 10, paddingHorizontal: Spacing.lg, borderRadius: 4, marginTop: Spacing.sm,
  },
  btnGoldText: { fontSize: 14, fontFamily: Typography.fontFamilySemiBold, color: Colors.primary },
  btnOutline: {
    alignSelf: 'flex-start',
    borderWidth: 1.5, borderColor: Colors.primary,
    paddingVertical: 10, paddingHorizontal: Spacing.lg, borderRadius: 4, marginTop: Spacing.sm,
  },
  btnOutlineText: { fontSize: 14, fontFamily: Typography.fontFamilySemiBold, color: Colors.primary },
});

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_ROUTES: Record<string, string> = {
  'Tournaments': '/proto/states/tournaments',
  'Commissars': '/proto/states/commissars',
  'Rankings': '/proto/states/ratings',
  'Host a Tournament': '/proto/states/org-apply',
};

function Footer() {
  const { isWide } = useLayout();
  const router = useRouter();
  const groups = [
    { title: 'Platform', links: ['Tournaments', 'Commissars', 'Rankings', 'Results'] },
    { title: 'Association', links: ['About Us', 'Membership', 'Host a Tournament', 'Contact'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
  ];
  return (
    <View style={ftS.footer}>
      <View style={[ftS.inner, isWide && ftS.innerWide]}>
        {/* Brand col */}
        <View style={[ftS.brandCol, isWide && { width: 240 }]}>
          <View style={ftS.logoRow}>
            <LogoMark size={22} />
            <Text style={ftS.logoMain}>Chess</Text>
            <Text style={ftS.logoGold}>Tourism</Text>
          </View>
          <Text style={ftS.tagline}>International Chess Tourism Association. Connecting chess players worldwide through competitive travel.</Text>
        </View>
        {/* Link groups */}
        {isWide && groups.map((g) => (
          <View key={g.title} style={ftS.linkCol}>
            <Text style={ftS.groupTitle}>{g.title}</Text>
            {g.links.map((l) => (
              <TouchableOpacity key={l} style={{ marginBottom: 6 }} activeOpacity={0.7} onPress={() => FOOTER_ROUTES[l] && router.push(FOOTER_ROUTES[l] as any)}>
                <Text style={ftS.linkText}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={ftS.bottom}>
        <Text style={ftS.copy}>{new Date().getFullYear()} International Chess Tourism Association. All rights reserved.</Text>
      </View>
    </View>
  );
}

const ftS = StyleSheet.create({
  footer: { backgroundColor: Colors.primary, paddingTop: Spacing['2xl'] },
  inner: { paddingHorizontal: Spacing.xl, gap: Spacing['2xl'] },
  innerWide: { flexDirection: 'row', alignItems: 'flex-start' },
  brandCol: { gap: Spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoMain: { fontFamily: Typography.fontFamilyHeading, fontSize: 16, color: Colors.white },
  logoGold: { fontFamily: Typography.fontFamilyHeading, fontSize: 16, color: Colors.gold },
  tagline: { fontSize: 13, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.4)', lineHeight: 20 },
  linkCol: { flex: 1 },
  groupTitle: { fontSize: 11, fontFamily: Typography.fontFamilySemiBold, color: Colors.gold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.md },
  linkText: { fontSize: 13, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.5)' },
  bottom: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  copy: { fontSize: 12, fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.3)' },
});

// ─── Section containers ───────────────────────────────────────────────────────

const secS = StyleSheet.create({
  section: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
  },
  altBg: { backgroundColor: Colors.backgroundAlt },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
});

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBlock({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: Colors.border, borderRadius: 6, marginBottom: mb }} />;
}

function LoadingState() {
  const { cols } = useLayout();
  const cardW = cols > 2 ? `${Math.floor(100 / cols) - 1.5}%` : '48%';
  return (
    <View>
      {/* Hero skeleton */}
      <View style={{ height: 460, backgroundColor: Colors.primary, justifyContent: 'flex-end', padding: Spacing.xl }}>
        <SkeletonBlock h={14} w={200} mb={Spacing.md} />
        <SkeletonBlock h={52} mb={Spacing.sm} />
        <SkeletonBlock h={40} w="75%" mb={Spacing.xl} />
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <View style={{ width: 180, height: 48, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
          <View style={{ width: 160, height: 48, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 }} />
        </View>
      </View>
      {/* Tournaments skeleton */}
      <View style={secS.section}>
        <SkeletonBlock h={28} w={240} mb={Spacing.lg} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ width: cardW as any, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border }}>
              <View style={{ height: 150, backgroundColor: Colors.border }} />
              <View style={{ padding: Spacing.md, gap: Spacing.sm }}>
                <SkeletonBlock h={16} />
                <SkeletonBlock h={12} w="60%" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Full page ────────────────────────────────────────────────────────────────

function FullPage({ isLoading, isEmpty }: { isLoading?: boolean; isEmpty?: boolean }) {
  if (isLoading) return <LoadingState />;
  return (
    <View>
      <DarkNav />
      <View style={{ marginTop: -60 }}>
        <Hero />
      </View>
      {isEmpty ? (
        <View style={secS.section}>
          <SectionHeader title="Upcoming Tournaments" />
          <View style={{ alignItems: 'center', paddingVertical: Spacing['3xl'] }}>
            <Feather name="calendar" size={40} color={Colors.border} />
            <Text style={{ marginTop: Spacing.md, fontSize: 16, fontFamily: Typography.fontFamilySemiBold, color: Colors.textMuted }}>No upcoming tournaments</Text>
            <Text style={{ fontSize: 14, fontFamily: Typography.fontFamily, color: Colors.textMuted, marginTop: Spacing.xs }}>Check back soon or subscribe to notifications</Text>
          </View>
        </View>
      ) : (
        <TournamentsSection />
      )}
      <CalendarSection />
      <RankingsSection />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </View>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function LandingStates() {
  return (
    <>
      <StateSection title="default" description="Full landing page — desktop + mobile responsive">
        <FullPage />
      </StateSection>
      <StateSection title="loading" description="Loading state — skeleton placeholders">
        <FullPage isLoading />
      </StateSection>
      <StateSection title="empty_tournaments" description="No upcoming tournaments scheduled">
        <FullPage isEmpty />
      </StateSection>
    </>
  );
}
