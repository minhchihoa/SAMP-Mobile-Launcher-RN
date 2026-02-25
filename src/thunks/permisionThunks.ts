import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
import { setPermision } from '../actions/permisionActions';
import { AppThunk } from '../store/store';

const { GtaSetupModule } = NativeModules;

export const fetchPermisions = (): AppThunk => async dispatch => {
  console.log('--- DEBUG: fetchPermisions START ---');
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 30) {
        const hasPermission = await GtaSetupModule.checkStoragePermission();
        if (hasPermission) {
          console.log('--- DEBUG: Android 11+ Permission granted ---');
          dispatch(setPermision({ fileRead: 'granted' }));
          return;
        } else {
           console.log('--- DEBUG: Android 11+ Permission denied (needs manual enable) ---');
           // Optionally request it here or let the UI trigger it via usePermisionFile
           // dispatch(setPermision({ fileRead: 'denied' }));
           // return;
        }
      }

      if (Platform.Version >= 33) {
        console.log('--- DEBUG: Android 13+ detected. Skipping legacy storage permission request. ---');
        dispatch(setPermision({ fileRead: 'granted' }));
        return;
      }

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
      ) {
        console.log('--- DEBUG: All permissions granted ---');
        dispatch(setPermision({ fileRead: 'granted' }));
      } else {
        console.log('--- DEBUG: Some permissions denied ---');
        dispatch(setPermision({ fileRead: 'denied' }));
      }
    }
  } catch (err) {
    console.warn('--- DEBUG: fetchPermisions ERROR ---', err);
  }
   console.log('--- DEBUG: fetchPermisions END ---');
};
