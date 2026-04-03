import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useNotifications, Notification } from '../../store/notifications';

const TYPE_ICON: Record<string, string> = {
  REGISTRATION_APPROVED: 'V',
  REGISTRATION_REJECTED: 'X',
  TOURNAMENT_OPEN: '!',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function NotificationItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: (item: Notification) => void;
}) {
  const icon = TYPE_ICON[item.type] ?? '?';
  const isApproved = item.type === 'REGISTRATION_APPROVED';
  const isRejected = item.type === 'REGISTRATION_REJECTED';

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.item, !item.isRead && styles.itemUnread]}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconWrap,
          isApproved && styles.iconApproved,
          isRejected && styles.iconRejected,
        ]}
      >
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, !item.isRead && styles.itemTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, isLoading, refresh, markRead, markAllRead, unreadCount } =
    useNotifications();

  const handlePress = useCallback(
    async (item: Notification) => {
      if (!item.isRead) {
        await markRead(item.id);
      }
      // Navigate to relevant tournament if data is present
      const tournamentId = (item.data as Record<string, unknown> | null)?.tournamentId;
      if (tournamentId) {
        router.push(`/tournaments/${tournamentId}` as any);
      }
    },
    [markRead, router],
  );

  return (
    <SafeContainer>
      <Header title="Notifications" showBack />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Уведомления</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Прочитать все</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading && notifications.length === 0 ? (
          <LoadingSpinner />
        ) : notifications.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'?'}</Text>
            <Text style={styles.emptyText}>Нет уведомлений</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refresh}
                tintColor={Colors.gold}
              />
            }
          >
            {notifications.map((item) => (
              <NotificationItem key={item.id} item={item} onPress={handlePress} />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heading: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    fontWeight: Typography.weights.bold,
  },
  markAllBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  markAllText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  list: {
    paddingBottom: Spacing['4xl'],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  itemUnread: {
    backgroundColor: Colors.statusUnreadBg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  iconApproved: {
    backgroundColor: Colors.statusApprovedBg,
  },
  iconRejected: {
    backgroundColor: Colors.statusRejectedBg,
  },
  iconText: {
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  itemTitleUnread: {
    color: Colors.text,
    fontWeight: Typography.weights.semibold,
  },
  itemBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    marginLeft: Spacing.sm,
    marginTop: 4,
    flexShrink: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing['4xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
    color: Colors.textMuted,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
});
