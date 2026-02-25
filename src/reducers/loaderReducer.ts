import { LoaderActionType } from '../actions/loaderActions';

const loaderInitState = {
  compare: {
    distributionCacheBytes: 0,
    downloadsCacheBytes: 0,
    needDownloadsCacheBytes: 0,
    successCount: 0,
    rejectCount: 0,
  },
  freeSpace: 0,
  isSuccessDownload: false,
  // Corrected the typo from 'downalod' to 'download'
  download: {
    fileName: '',
    currentBytes: 0,
    needBytes: 0,
    numberOfDownloads: 0,
    downloadBytes: 0,
  },
  needDownload: [],
};

export type LoaderStateType = typeof loaderInitState;

export const loaderReducer = (
  state = loaderInitState,
  action: LoaderActionType,
): LoaderStateType => {
  switch (action.type) {
    case 'SET_DOWNLOAD_LOADER': {
      return { ...state, download: { ...state.download, ...action.payload.download } };
    }
    case 'SET_COMPARE': {
      return { ...state, ...action.payload };
    }

    case 'SET_SUCCESS_DOWNLOAD': {
      return { ...state, ...action.payload };
    }

    case 'SET_CACHE_REJECT': {
      const needDownload = state.needDownload.filter(
        el => el.id !== action.payload.id,
      );
      return {
        ...state,
        needDownload,
        compare: {
          ...state.compare,
          rejectCount: state.compare.rejectCount - 1,
        },
      };
    }

    default: {
      return state;
    }
  }
};
