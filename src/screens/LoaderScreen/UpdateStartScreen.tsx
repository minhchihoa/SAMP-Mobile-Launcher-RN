import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View, Platform, PermissionsAndroid } from 'react-native';
import { DownloadSvg } from '../../assets/svg/index';
import { ButtonLauncher, LoaderContainer } from '../../components';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { styles } from '../../styles/LoaderStyle';
import { setAlertNeedSpace, setAlertProtectionFile } from '../../actions/alertActions';
import { selectCompare, selectFreeSpace } from '../../selectors/loaderSelectors';
import { formatSizeUnits } from '../../helpers';

type InitiationScreenType = NativeStackScreenProps<any>;

export const UpdateStartScreen = React.memo(
  ({ navigation }: InitiationScreenType) => {
    const dispatch = useAppDispatch();
    const { needDownloadsCacheBytes } = useAppSelector(selectCompare);
    const freeSpace = useAppSelector(selectFreeSpace);

    const onPressDownload = async () => {
      try {
        // 1. Permission Check
        if (Platform.OS === 'android') {
          // Android 13+ (API 33) does not require WRITE_EXTERNAL_STORAGE for app-specific directories
          if (Platform.Version < 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Quyền truy cập bộ nhớ',
                message: 'Ứng dụng cần quyền truy cập bộ nhớ để tải và lưu trữ dữ liệu game.',
                buttonPositive: 'OK',
                buttonNegative: 'Hủy',
              },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              dispatch(setAlertProtectionFile(true));
              return;
            }
          }
        }

        // 2. Space Check
        if (freeSpace < needDownloadsCacheBytes) {
          dispatch(
            setAlertNeedSpace(true, {
              needSpace: +formatSizeUnits(needDownloadsCacheBytes),
              currentSpace: +formatSizeUnits(freeSpace),
            }),
          );
          return;
        }

        // 3. Navigate
        navigation.replace('UpdateScreen');
      } catch (error) {
        console.error('[FATAL_ERROR] An error occurred in UpdateStartScreen onPressDownload:', error);
      }
    };

    return (
      <LoaderContainer>
        <Text style={styles.title}>Có bản cập nhật!</Text>
        <Text style={styles.alert}>
          Nhấn
          <Text style={styles.accent}> cập nhật</Text>, để xác nhận
          {'\n'} tải xuống các tệp.
        </Text>
        <View style={styles.buttons}>
          <ButtonLauncher
            btnWidth={'100%'}
            background={'#5476db'}
            IconLeft={DownloadSvg}
            onPress={onPressDownload}>
            Cập nhật
          </ButtonLauncher>
        </View>
      </LoaderContainer>
    );
  },
);
