import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertNeedSpace } from '../../actions/alertActions';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAlertSpace } from '../../selectors/alertSelectors';
import { AlertLauncher } from '../AlertLauncher/AlertLauncher';

export const AlertSpace = React.memo(() => {
  const {
    status: show,
    needSpace,
    currentSpace,
  } = useAppSelector(selectAlertSpace);

  const dispatch = useDispatch();

  const onPressCancel = useCallback(async () => {
    dispatch(
      setAlertNeedSpace(false, {
        needSpace: 0,
        currentSpace: 0,
      }),
    );
  }, []);

  return (
    <AlertLauncher
      show={show}
      title="Không đủ dung lượng"
      useNativeDriver={true}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      message={`Để cài đặt tài nguyên game, cần ${needSpace} nhưng chỉ có ${currentSpace}`}
      showCancelButton={true}
      cancelText="Đóng"
      onCancelPressed={onPressCancel}
    />
  );
});
