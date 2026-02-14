import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertUpdating } from '../../actions/alertActions';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAlertUpdate } from '../../selectors/alertSelectors';
import { AlertLauncher } from '../AlertLauncher/AlertLauncher';

export const AlertUpdate = React.memo(() => {
  const show = useAppSelector(selectAlertUpdate);

  const dispatch = useDispatch();

  const onPressCancel = useCallback(async () => {
    dispatch(setAlertUpdating(false));
  }, []);

  const onConfirmPressed = useCallback(() => {
    dispatch(setAlertUpdating(false));
  }, []);

  return (
    <AlertLauncher
      show={show}
      title="Chú ý"
      useNativeDriver={true}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      message="Đã có phiên bản launcher mới. Để có trải nghiệm chơi game tốt nhất trên dự án của chúng tôi, bạn nên cập nhật ứng dụng."
      showConfirmButton={true}
      confirmText="Cập nhật"
      showCancelButton={true}
      cancelText="Để sau"
      onCancelPressed={onConfirmPressed}
      onConfirmPressed={onPressCancel}
    />
  );
});
