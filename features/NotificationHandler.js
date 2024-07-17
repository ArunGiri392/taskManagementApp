// Time Calculations for notifications
export const getNextNotificationTime = () => {
    const now = new Date();
    const nextNotification = new Date();
  
    // Set the notification time to 10 AM
    nextNotification.setHours(20, 59, 0, 0);
  
    // If it's already past 10 AM today, set it for tomorrow
    if (now > nextNotification) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }
  
    // Calculate the difference in seconds
    const diffInSeconds = Math.floor((nextNotification - now) / 1000);
    console.log(diffInSeconds);
    return diffInSeconds > 0 ? diffInSeconds : 0;
  };