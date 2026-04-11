import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import ProtoNav, { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.sectionWrap}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={s.label}>{text}</Text>;
}

// ---------------------------------------------------------------------------
// 1. Header variants
// ---------------------------------------------------------------------------
function HeaderVariantsSection() {
  return (
    <Section title="1. Navigation - Header variants">
      <Label text="Public - logo + nav links + sign in" />
      <ProtoNavTop variant="public" />
      <View style={s.gap} />
      <Label text="Auth - centered logo" />
      <ProtoNavTop variant="auth" />
      <View style={s.gap} />
      <Label text="Client - logo + notifications" />
      <ProtoNavTop variant="client" />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 2. Bottom Tab Bar
// ---------------------------------------------------------------------------
function TabBarSection() {
  return (
    <Section title="2. Navigation - Bottom Tab Bar">
      <Label text="Client tabs (Home / Tournaments / Cabinet / Profile)" />
      <ProtoBottomNav variant="client" activeTab="home" />
      <View style={s.gap} />
      <Label text="Admin tabs" />
      <ProtoBottomNav variant="admin" activeTab="dashboard" />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 3. Burger / Drawer
// ---------------------------------------------------------------------------
function BurgerSection() {
  const [open, setOpen] = useState(false);
  const items = ['Tournaments', 'Commissars', 'Rankings', 'About', 'Sign In'];
  return (
    <Section title="3. Navigation - Burger Menu">
      <Label text="Tap hamburger to toggle" />
      <Pressable style={s.burgerBtn} onPress={() => setOpen(!open)}>
        <Feather name={open ? 'x' : 'menu'} size={20} color={Colors.text} />
      </Pressable>
      {open && (
        <View style={s.drawer}>
          {items.map((item) => (
            <Pressable key={item} style={s.drawerItem}>
              <Text style={s.drawerText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 4. Search / Filter
// ---------------------------------------------------------------------------
const CITIES = ['Tbilisi', 'Batumi', 'Moscow', 'Berlin', 'Paris', 'London', 'Istanbul', 'Dubai'];

function SearchSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState('');

  const handleSearch = (text: string) => {
    setQuery(text);
    setSelected('');
    if (text.length > 0) {
      setResults(CITIES.filter(c => c.toLowerCase().includes(text.toLowerCase())));
    } else {
      setResults([]);
    }
  };

  return (
    <Section title="4. Search / Filter">
      <Label text="City autocomplete" />
      <View style={s.searchWrap}>
        <Feather name="search" size={16} color={Colors.textMuted} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Search city..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <Pressable onPress={() => { setQuery(''); setResults([]); setSelected(''); }}>
            <Feather name="x" size={16} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>
      {results.length > 0 && (
        <View style={s.dropdownList}>
          {results.map((city) => (
            <Pressable key={city} style={s.dropdownItem} onPress={() => { setSelected(city); setQuery(city); setResults([]); }}>
              <Feather name="map-pin" size={14} color={Colors.textMuted} />
              <Text style={s.dropdownItemText}>{city}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {selected !== '' && (
        <View style={s.selectedRow}>
          <Feather name="check-circle" size={14} color={Colors.successGreen} />
          <Text style={[s.selectedText, { color: Colors.successGreen }]}>Selected: {selected}</Text>
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 5. Text Inputs
// ---------------------------------------------------------------------------
function InputsSection() {
  const [defaultVal, setDefaultVal] = useState('');
  const [focusedVal, setFocusedVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorVal, setErrorVal] = useState('');
  const [showError, setShowError] = useState(false);

  return (
    <Section title="5. Text Inputs">
      <Label text="Default" />
      <TextInput
        style={s.input}
        placeholder="Enter text..."
        placeholderTextColor={Colors.textMuted}
        value={defaultVal}
        onChangeText={setDefaultVal}
      />
      <Label text="Focused" />
      <TextInput
        style={[s.input, isFocused && s.inputFocused]}
        placeholder="Tap to focus..."
        placeholderTextColor={Colors.textMuted}
        value={focusedVal}
        onChangeText={setFocusedVal}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Label text="Error state" />
      <TextInput
        style={[s.input, showError && s.inputError]}
        placeholder="Email"
        placeholderTextColor={Colors.textMuted}
        value={errorVal}
        onChangeText={(t) => { setErrorVal(t); setShowError(t.length > 0 && !t.includes('@')); }}
      />
      {showError && <Text style={s.errorText}>Enter a valid email address</Text>}
      <Label text="Disabled" />
      <TextInput style={[s.input, s.inputDisabled]} placeholder="Disabled field" placeholderTextColor={Colors.textMuted} editable={false} />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 6. Buttons
// ---------------------------------------------------------------------------
function ButtonsSection() {
  return (
    <Section title="6. Buttons">
      <Label text="Primary" />
      <View style={s.btnRow}>
        <Pressable style={s.btnPrimary}><Text style={s.btnPrimaryText}>Primary</Text></Pressable>
        <Pressable style={[s.btnPrimary, s.btnDisabled]}><Text style={[s.btnPrimaryText, s.btnDisabledText]}>Disabled</Text></Pressable>
      </View>
      <Label text="Secondary" />
      <View style={s.btnRow}>
        <Pressable style={s.btnSecondary}><Text style={s.btnSecondaryText}>Secondary</Text></Pressable>
        <Pressable style={[s.btnSecondary, s.btnSecondaryDisabled]}><Text style={[s.btnSecondaryText, { color: Colors.textMuted }]}>Disabled</Text></Pressable>
      </View>
      <Label text="Ghost" />
      <View style={s.btnRow}>
        <Pressable style={s.btnGhost}><Text style={s.btnGhostText}>Ghost</Text></Pressable>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 7. Select / Dropdown
// ---------------------------------------------------------------------------
const TIME_CONTROLS = ['Classical', 'Rapid', 'Blitz', 'Bullet', 'Fischer Random'];

function SelectSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <Section title="7. Select / Dropdown">
      <Label text="Time control" />
      <Pressable style={s.selectTrigger} onPress={() => setOpen(!open)}>
        <Text style={[s.selectTriggerText, !selected && s.selectPlaceholder]}>
          {selected || 'Choose time control'}
        </Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
      </Pressable>
      {open && (
        <View style={s.dropdownList}>
          {TIME_CONTROLS.map((tc) => (
            <Pressable
              key={tc}
              style={[s.dropdownItem, selected === tc && s.dropdownItemSelected]}
              onPress={() => { setSelected(tc); setOpen(false); }}
            >
              {selected === tc && <Feather name="check" size={14} color={Colors.gold} />}
              <Text style={[s.dropdownItemText, selected === tc && { color: Colors.gold, fontWeight: '600' as any }]}>{tc}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 8. Cards
// ---------------------------------------------------------------------------
function CardsSection() {
  return (
    <Section title="8. Cards">
      <Label text="Tournament card" />
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Tbilisi Open 2026</Text>
          <View style={[s.badge, { backgroundColor: Colors.statusInfoBg }]}>
            <Text style={[s.badgeText, { color: Colors.primary }]}>Open</Text>
          </View>
        </View>
        <View style={s.cardMeta}>
          <Feather name="map-pin" size={12} color={Colors.textMuted} />
          <Text style={s.cardMetaText}>Tbilisi, Georgia</Text>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={s.cardMetaText}>Classical</Text>
        </View>
      </View>

      <Label text="Venue card" />
      <View style={s.card}>
        <View style={s.cardRow}>
          <Image source={{ uri: 'https://picsum.photos/seed/venue1/80/80' }} style={s.cardAvatar} />
          <View style={s.cardInfo}>
            <Text style={s.cardTitle}>Chess Palace Tbilisi</Text>
            <Text style={s.cardSubtitle}>5 upcoming tournaments</Text>
            <View style={s.cardMeta}>
              <Feather name="star" size={12} color={Colors.gold} />
              <Text style={s.cardRating}>4.9</Text>
              <Text style={s.cardMetaText}>(128 reviews)</Text>
            </View>
          </View>
        </View>
      </View>

      <Label text="Commissar card" />
      <View style={s.card}>
        <View style={s.cardRow}>
          <Image source={{ uri: 'https://picsum.photos/seed/comm1/80/80' }} style={s.cardAvatar} />
          <View style={s.cardInfo}>
            <Text style={s.cardTitle}>Alexander Petrov</Text>
            <Text style={s.cardSubtitle}>FIDE Arbiter</Text>
          </View>
        </View>
        <View style={s.cardActions}>
          <Pressable style={s.cardActionBtn}>
            <Feather name="message-circle" size={14} color={Colors.white} />
            <Text style={s.cardActionBtnText}>Contact</Text>
          </Pressable>
          <Pressable style={s.cardActionBtnOutline}>
            <Feather name="eye" size={14} color={Colors.gold} />
            <Text style={s.cardActionBtnOutlineText}>Profile</Text>
          </Pressable>
        </View>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 9. Badges / Chips
// ---------------------------------------------------------------------------
function BadgesSection() {
  return (
    <Section title="9. Badges / Chips">
      <View style={s.badgesRow}>
        <View style={[s.badge, { backgroundColor: Colors.statusInfoBg }]}>
          <Text style={[s.badgeText, { color: Colors.primary }]}>Open</Text>
        </View>
        <View style={[s.badge, { backgroundColor: Colors.statusWarningBg }]}>
          <Text style={[s.badgeText, { color: Colors.warningBrown }]}>In Progress</Text>
        </View>
        <View style={[s.badge, { backgroundColor: Colors.statusSuccessBg }]}>
          <Text style={[s.badgeText, { color: Colors.successGreen }]}>Completed</Text>
        </View>
        <View style={[s.badge, { backgroundColor: Colors.statusErrorBg }]}>
          <Text style={[s.badgeText, { color: Colors.error }]}>Cancelled</Text>
        </View>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// 10. Alerts
// ---------------------------------------------------------------------------
function AlertsSection() {
  return (
    <Section title="10. Alerts">
      <View style={[s.alert, { backgroundColor: Colors.statusInfoBg, borderColor: Colors.primary }]}>
        <Feather name="info" size={16} color={Colors.primary} />
        <Text style={[s.alertText, { color: Colors.primary }]}>Registration opens in 3 days</Text>
      </View>
      <View style={[s.alert, { backgroundColor: Colors.statusSuccessBg, borderColor: Colors.successGreen }]}>
        <Feather name="check-circle" size={16} color={Colors.successGreen} />
        <Text style={[s.alertText, { color: Colors.successGreen }]}>Registration confirmed</Text>
      </View>
      <View style={[s.alert, { backgroundColor: Colors.statusErrorBg, borderColor: Colors.error }]}>
        <Feather name="alert-circle" size={16} color={Colors.error} />
        <Text style={[s.alertText, { color: Colors.error }]}>Payment failed</Text>
      </View>
      <View style={[s.alert, { backgroundColor: Colors.statusWarningBg, borderColor: Colors.warningBrown }]}>
        <Feather name="alert-triangle" size={16} color={Colors.warningBrown} />
        <Text style={[s.alertText, { color: Colors.warningBrown }]}>Tournament is almost full</Text>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function ComponentsStates() {
  return (
    <StateSection title="SHOWCASE">
      <View style={{ minHeight: Platform.OS === 'web' ? '100vh' as any : 844 }}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <Text style={s.pageTitle}>UI Components</Text>
          <Text style={s.pageSubtitle}>Interactive showcase of all reusable components</Text>
          <HeaderVariantsSection />
          <TabBarSection />
          <BurgerSection />
          <SearchSection />
          <InputsSection />
          <ButtonsSection />
          <SelectSection />
          <CardsSection />
          <BadgesSection />
          <AlertsSection />
          <View style={s.footer} />
        </ScrollView>
      </View>
    </StateSection>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.backgroundAlt },
  scrollContent: { padding: Spacing.lg, gap: Spacing.lg },
  pageTitle: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: -Spacing.sm,
  },
  footer: { height: Spacing['3xl'] },

  // Section
  sectionWrap: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  sectionBody: { gap: Spacing.md },

  // Label
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gap: { height: Spacing.sm },

  // Burger
  burgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  drawer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  drawerItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.text,
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
    height: 44,
    outlineStyle: 'none',
  } as any,
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  selectedText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
  },

  // Dropdown
  dropdownList: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.backgroundAlt,
  },

  // Inputs
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
    backgroundColor: Colors.background,
    outlineStyle: 'none',
  } as any,
  inputFocused: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: Colors.backgroundAlt,
    opacity: 0.6,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.error,
    marginTop: -Spacing.sm + 2,
  },

  // Buttons
  btnRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  btnPrimary: {
    height: 44,
    backgroundColor: Colors.gold,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  btnPrimaryText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.primary,
  },
  btnDisabled: {
    backgroundColor: Colors.border,
  },
  btnDisabledText: {
    color: Colors.textMuted,
  },
  btnSecondary: {
    height: 44,
    backgroundColor: Colors.background,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  btnSecondaryText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.gold,
  },
  btnSecondaryDisabled: {
    borderColor: Colors.border,
  },
  btnGhost: {
    height: 44,
    backgroundColor: 'transparent',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnGhostText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.textMuted,
  },

  // Select
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
  },
  selectTriggerText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
  },
  selectPlaceholder: {
    color: Colors.textMuted,
  },

  // Cards
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardMetaText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundAlt,
  },
  cardInfo: { flex: 1, gap: 2 },
  cardRating: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.text,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 36,
    backgroundColor: Colors.gold,
    borderRadius: 4,
    paddingHorizontal: Spacing.lg,
  },
  cardActionBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.white,
  },
  cardActionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 4,
    paddingHorizontal: Spacing.lg,
  },
  cardActionBtnOutlineText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.gold,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
  },

  // Alerts
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: Spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
  },
});
