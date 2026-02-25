import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
import { setAlertProtectionFile } from '../actions/alertActions';
import { setPermision } from '../actions/permisionActions';
import { useAppDispatch } from './useAppDispatch';

const { GtaSetupModule } = NativeModules;

export const usePermisionFile = (): {
  fetchPermision: () => Promise<boolean>;
} => {
  const dispatch = useAppDispatch();

  const fetchPermision = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 30) {
          const hasPermission = await GtaSetupModule.checkStoragePermission();
          if (hasPermission) {
            dispatch(setPermision({ fileRead: 'granted' }));
            return true;
          } else {
            await GtaSetupModule.requestStoragePermission();
            // User needs to grant permission in settings. 
            // We return false here, but the app should ideally listen for app state change or user retry.
            // Dispatching denied might show an alert, which is okay as a fallback.
             dispatch(setPermision({ fileRead: 'denied' }));
             return false;
          }
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Quyền truy cập bộ nhớ',
            message: 'Ứng dụng cần quyền truy cập bộ nhớ để tải và lưu trữ dữ liệu game.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          dispatch(setPermision({ fileRead: 'granted' }));
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          dispatch(setPermision({ fileRead: 'denied' }));
          dispatch(setAlertProtectionFile(true));
          return false;
        } else {
          dispatch(setPermision({ fileRead: 'never_ask_again' }));
          dispatch(setAlertProtectionFile(true));
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS does not need this permission
    }
  };

  return { fetchPermision };
};
