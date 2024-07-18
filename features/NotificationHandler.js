import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Time Calculations for notifications
export const getNextNotificationTime = () => {
    const now = new Date();
    const nextNotification = new Date();
  
    // Set the notification time to 10 AM
    nextNotification.setHours(10, 48, 0, 0);
  
    // If it's already past 10 AM today, set it for tomorrow
    if (now > nextNotification) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }
  
    // Calculate the difference in seconds
    const diffInSeconds = Math.floor((nextNotification - now) / 1000);
    return diffInSeconds > 0 ? diffInSeconds : 0;
  };

  const NOTIFICATION_KEY = 'TASK_NOTIFICATION_KEY';

// Request Permission for notification
export const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
    }
};

// check if notifications are already scheduled or not and reset them accordingly
export const checkAndScheduleNotification = async () => {
    const notificationData = await AsyncStorage.getItem(NOTIFICATION_KEY);
    if (!notificationData) {
        await scheduleDailyNotification();
    } else {
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        if (notifications.length === 0) {
            await scheduleDailyNotification();
        }
    }
};

const delayInSeconds = getNextNotificationTime();

// notification scheduler
export const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Complete your tasks!',
            body: 'Don’t forget to complete your tasks for today!',
        },
        trigger: {
            seconds: delayInSeconds,
        },
    });
    await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify({ scheduled: true }));
};