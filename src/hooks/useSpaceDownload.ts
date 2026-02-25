import { setAlertNeedSpace } from '../actions/alertActions';
import { formatSizeUnits } from '../helpers';
import { selectCompare } from '../selectors/loaderSelectors';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useSpaceDownlload = (): {
  fetchSpace: () => boolean;
} => {
  const dispatch = useAppDispatch();
  const { freeSpace, needDownloadsCacheBytes } = useAppSelector(selectCompare);

  const fetchSpace = () => {
    if (freeSpace < needDownloadsCacheBytes) {
      dispatch(
        setAlertNeedSpace(true, {
          needSpace: +formatSizeUnits(needDownloadsCacheBytes),
          currentSpace: +formatSizeUnits(freeSpace),
        }),
      );

      return false;
    }

    return true;
  };

  return { fetchSpace };
};
