import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertUserName } from '../../actions/alertActions';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAlertUserName } from '../../selectors/alertSelectors';
import { AlertLauncher } from '../AlertLauncher/AlertLauncher';

export const AlertUserName = React.memo(() => {
  const show = useAppSelector(selectAlertUserName);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onPressCancel = useCallback(async () => {
    dispatch(setAlertUserName(false));
    return navigation.jumpTo('Cài đặt'); // Reverted to original screen name
  }, []);

  const onConfirmPressed = useCallback(() => {
    dispatch(setAlertUserName(false));
  }, []);

  return (
    <AlertLauncher
      show={show}
      title="Gợi ý"
      useNativeDriver={true}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      message="Bạn cần đặt tên tài khoản trong phần cài đặt"
      showConfirmButton={true}
      confirmText="Cài đặt"
      showCancelButton={true}
      cancelText="Đóng"
      onCancelPressed={onConfirmPressed}
      onConfirmPressed={onPressCancel}
    />
  );
});
