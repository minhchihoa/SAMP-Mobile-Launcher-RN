import RNApkInstaller from '@dominicvonk/react-native-apk-installer';
import { APP_VERSION } from '@env';
import { StackActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { setDownloadLoader } from '../actions/loaderActions';
import {
  DownloadProgressType,
  FilePath,
  FileValidate,
} from '../features/fileManager';
import { compareVersions } from '../helpers';
import { navigationRef } from '../routers/RootNavigation';
import { AppThunk } from '../store/store';

const toPatch = FilePath.getPathDirLauncher();

export const installLauncher = (): AppThunk => async (_, getState) => {
  const { name } = getState().distribution.launcher;

  try {
    await RNApkInstaller.install(`${toPatch}/${name}`);
  } catch (e) {
    navigationRef.current?.dispatch(StackActions.replace('Error'));
  }
};

export type UpdateLauncherType = {
  setIsError: (value: boolean) => void;
  setIsFetchDownload: (value: boolean) => void;
};
export const updateLauncher =
  (props: UpdateLauncherType): AppThunk =>
  async (dispatch, getState) => {
    const launcher = getState().distribution.launcher;
    const cdnLauncher = getState().distribution.cdnLauncher;

    dispatch(
      setDownloadLoader({
        download: {
          currentBytes: 0,
          needBytes: launcher.bytes,
        },
      }),
    );

    try {
      await RNFS.downloadFile({
        fromUrl: `${cdnLauncher}/${launcher.name}`,
        toFile: `${toPatch}/${launcher.name}`,
        progressInterval: 800,
        progress: (prog: DownloadProgressType) => {
          dispatch(
            setDownloadLoader({
              download: {
                currentBytes: prog.bytesWritten,
              },
            }),
          );
        },
      }).promise;

      return navigationRef.current?.dispatch(
        StackActions.replace('LauncherUpdateScreen'),
      );
    } catch (e) {
      props.setIsFetchDownload(false);
      props.setIsError(true);
    }
  };

export const autoUpdateLauncher = (): AppThunk => async (dispatch, getState) => {
  const appDistributionVersion = getState().distribution.launcher.appVersion;
  const compareResult = compareVersions(appDistributionVersion, APP_VERSION);

  console.log(`--- UPDATE CHECK --- Server: ${appDistributionVersion}, App: ${APP_VERSION}, Result: ${compareResult}`);

  if (compareResult > 0) {
    const appDistributionName = getState().distribution.launcher.name;
    const appDistributionHash = getState().distribution.launcher.hash;

    try {
      const pathDownloadFile = `${toPatch}/${appDistributionName}`;

      const isDownloadLauncher = await FileValidate.isValidFileHash(
        pathDownloadFile,
        appDistributionHash,
      );

      if (isDownloadLauncher) {
        return navigationRef.current?.dispatch(
          StackActions.replace('LauncherUpdateScreen'),
        );
      } else {
        const cdnLauncher = getState().distribution.cdnLauncher;
        const downloadUrl = `${cdnLauncher}/${appDistributionName}`;
        return navigationRef.current?.dispatch(
          StackActions.replace('LauncherDownloadScreen', { downloadUrl }),
        );
      }
    } catch (e) {}
  } else {
    const { rejectCount, successCount } = getState().loader.compare;
    const { isSuccessDownload } = getState().loader;

    console.log(`--- LAUNCHER DEBUG --- Reject count: ${rejectCount}, Success count: ${successCount}, Was download successful before: ${isSuccessDownload}`);

    if (rejectCount > 0) {
      if (isSuccessDownload) {
        return navigationRef.current?.dispatch(
          StackActions.replace('UpdateStartScreen'),
        );
      } else {
        return navigationRef.current?.dispatch(
          StackActions.replace('DownloadStartScreen'),
        );
      }
    }
  }

  console.log('--- LAUNCHER DEBUG --- No files to download. Navigating to Main.');
  return navigationRef.current?.dispatch(StackActions.replace('Main'));
};
