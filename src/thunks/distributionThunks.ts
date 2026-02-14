import { APP_VERSION } from '@env';
import { StackActions } from '@react-navigation/native';
import { setDistribution } from '../actions/distributionActions';
import { compareVersions } from '../helpers';
import { navigationRef } from '../routers/RootNavigation';
import { DistributionService } from '../services/distribution.service';
import { AppThunk } from '../store/store';
import { compareFileRecursion } from './loaderThunks';

export const fetchDistribution = (): AppThunk => async (dispatch, getState) => {
  try {
    const response = await DistributionService.get();
    const { cache: cacheMode, launcher, cdnLauncher, ...res } = response;

    // Step 1: Set distribution data FIRST so state is populated
    await dispatch(setDistribution({ ...res, cacheMode, launcher, cdnLauncher }));

    // Step 2: Run cache comparison
    if (!getState().settings.skip) {
      await dispatch(compareFileRecursion({ caches: cacheMode }));
    }

    // Step 4: Make final navigation decision based on FRESH state
    const { rejectCount } = getState().loader.compare;
    const { isSuccessDownload } = getState().loader;

    if (rejectCount > 0) {
      if (isSuccessDownload) {
        return navigationRef.current?.dispatch(StackActions.replace('UpdateStartScreen'));
      } else {
        return navigationRef.current?.dispatch(StackActions.replace('DownloadStartScreen'));
      }
    }

    // If all checks pass, go to Main
    return navigationRef.current?.dispatch(StackActions.replace('Main'));

  } catch (error: any) {
    console.log("Error fetching distribution:", error);
    return navigationRef.current?.dispatch(StackActions.replace('Error'));
  }
};
