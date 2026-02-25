import { PACKAGE_NAME, PROJECT_NAME } from '@env';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppThunk } from '../store/store';

export const appRegisterDeviceForRemoteMessages = (): AppThunk => async () => {
  try {
    await notifee.requestPermission();
    await messaging().registerDeviceForRemoteMessages();

    return await notifee.createChannel({
      id: PACKAGE_NAME + '-default',
      name: PROJECT_NAME + ' Chanel',
      importance: AndroidImportance.HIGH,
    });
  } catch (error) {
    console.error('Error in appRegisterDeviceForRemoteMessages:', error);
  }
};

export const createPushNotificationLoader = (): AppThunk => async dispatch => {
  try {
    await dispatch(onUploadTaskEventLoader({ status: 'cancel' }));

    return await notifee.createChannel({
      id: PACKAGE_NAME + '-notification',
      name: PROJECT_NAME + ' Chanel',
    });
  } catch (error) {
    console.error('Error in createPushNotificationLoader:', error);
  }
};

export const onUploadTaskEventLoader =
  (event): AppThunk =>
  async () => {
    try {
        if (event.status === 'download') {
        await notifee.displayNotification({
            id: PACKAGE_NAME + '-notification',
            title: 'Đang tải tệp game...',
            body: `${event.file} [${event.sizeFile} trên ${event.currentFile}]`,
            android: {
            channelId: PACKAGE_NAME + '-notification',
            ongoing: true,
            onlyAlertOnce: true,
            showTimestamp: true,
            colorized: true,
            progress: {
                max: event.current,
                current: event.size,
            },
            },
        });
        }

        if (event.status === 'complete') {
        await notifee.displayNotification({
            id: PACKAGE_NAME + '-notification',
            title: 'Tải xuống hoàn tất',
            body: ' ',
            android: {
            channelId: PACKAGE_NAME + '-notification',
            ongoing: false, // Should be false when complete
            onlyAlertOnce: false,
            showTimestamp: true,
            colorized: true,
            progress: {
                max: 100,
                current: 100,
            },
            },
        });
        }

        if (event.status === 'cancel') {
        await notifee.cancelNotification(PACKAGE_NAME + '-notification');
        }
    } catch (error) {
        console.error('Error in onUploadTaskEventLoader:', error);
    }
  };
