import RNGpuInfo from 'react-native-gpu-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import { APP_VERSION } from '@env';
import { FilePath } from '../features/fileManager';
import { setGPU, setInitial } from '../actions/appActions';
import { AppThunk } from '../store/store';
import { fetchArticles } from './articleThunks';
import { fetchDistribution } from './distributionThunks';
import { fetchDonates } from './donateThunks';
import { compareFileRecursion } from './loaderThunks';
import { autoUpdateLauncher } from './launcherTunks';
import { appRegisterDeviceForRemoteMessages } from './notificationThunks';
import { fetchInitialSettings } from './settingsThunks';

export const fetchInitialApp = (): AppThunk => async (dispatch, getState) => {
  // --- VERSION CHECK & CACHE CLEAR ---
  try {
    if (APP_VERSION) {
      const lastVersion = await AsyncStorage.getItem('last_run_version');
      if (lastVersion !== APP_VERSION) {
        console.log(`New version detected (${APP_VERSION} vs ${lastVersion}). Clearing cache...`);
        
        // 1. Clear potentially conflicting AsyncStorage keys
        await AsyncStorage.removeItem('distribution_cache'); 
        
        // Clear Image Cache
        FastImage.clearDiskCache();
        FastImage.clearMemoryCache();
        
        // 2. Clear temporary files or old updates
        const launcherDir = FilePath.getPathDirLauncher();
        if (await RNFS.exists(launcherDir)) {
            try {
              const files = await RNFS.readDir(launcherDir);
              for (const file of files) {
                  if (file.isFile() && (file.name.endsWith('.apk') || file.name.endsWith('.json'))) {
                      await RNFS.unlink(file.path);
                  }
              }
            } catch (err) {
              console.log('Error cleaning launcher dir:', err);
            }
        }

        // 3. Update version
        await AsyncStorage.setItem('last_run_version', APP_VERSION);
      }
    }
  } catch (e) {
    console.error("Error clearing cache on update:", e);
  }
  // -----------------------------------

  const glRenderer = RNGpuInfo.getGlRenderer();
  dispatch(setGPU(glRenderer));

  // Permissions will be requested on-demand, so we remove this from initial fetch
  // await dispatch(fetchPermisions());

  await dispatch(fetchInitialSettings());
  await dispatch(fetchDistribution());

  const cacheModeForCompare = getState().distribution.cacheMode;
  if (cacheModeForCompare && cacheModeForCompare.length > 0) {
      await dispatch(compareFileRecursion({ caches: cacheModeForCompare }));
  }

  // After all checks, decide where to go
  await dispatch(autoUpdateLauncher());

  await dispatch(fetchArticles());
  await dispatch(fetchDonates());
  await dispatch(appRegisterDeviceForRemoteMessages());

  dispatch(setInitial({ initial: true }));
};
