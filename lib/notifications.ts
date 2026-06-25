/**
 * Rappels quotidiens locaux (expo-notifications) pour la rétention / la série.
 * Notifications LOCALES uniquement (fonctionnent en Expo Go) — pas de push distant.
 */
import * as Notifications from 'expo-notifications';

const REMINDER_ID = 'tahajji-daily-reminder';

/** Demande la permission de notifier ; renvoie true si accordée. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Planifie (ou replanifie) un rappel quotidien à l'heure donnée. */
export async function scheduleDailyReminder(hour = 19, minute = 0): Promise<void> {
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: 'Tahajji',
      body: "C'est l'heure de ta leçon ! Garde ta série 🔥",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  } catch {
    /* aucun rappel planifié */
  }
}
