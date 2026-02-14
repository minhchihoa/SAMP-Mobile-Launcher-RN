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

export const DownloadStartScreen = React.memo(
  ({ navigation }: InitiationScreenType) => {
    const dispatch = useAppDispatch();
    const { needDownloadsCacheBytes } = useAppSelector(selectCompare);
    const freeSpace = useAppSelector(selectFreeSpace);

    const onPressDownload = async () => {
      try {
        console.log('--- DOWNLOAD START SCREEN DEBUG ---');
        console.log('1. Checking function types...');
        console.log('   - typeof navigation.replace:', typeof navigation?.replace);
        console.log('   - typeof dispatch:', typeof dispatch);
        console.log('   - typeof PermissionsAndroid.request:', typeof PermissionsAndroid?.request);

        // 1. Permission Check
        if (Platform.OS === 'android') {
          // Android 13+ (API 33) does not require WRITE_EXTERNAL_STORAGE for app-specific directories
          // and calling request will always return DENIED/NEVER_ASK_AGAIN.
          if (Platform.Version < 33) {
            console.log('2. Requesting storage permission...');
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Permission Denied. Alerting...');
              dispatch(setAlertProtectionFile(true));
              return;
            }
            console.log('Permission OK.');
          } else {
            console.log('Android 13+ detected (API ' + Platform.Version + '), skipping WRITE_EXTERNAL_STORAGE check.');
          }
        }

        // 2. Space Check
        console.log(`3. Checking space: freeSpace=${freeSpace}, need=${needDownloadsCacheBytes}`);
        if (freeSpace < needDownloadsCacheBytes) {
          console.log('Not enough space. Alerting...');
          dispatch(
            setAlertNeedSpace(true, {
              needSpace: +formatSizeUnits(needDownloadsCacheBytes),
              currentSpace: +formatSizeUnits(freeSpace),
            }),
          );
          return;
        }
        console.log('Space OK.');

        // 3. Navigate
        console.log('4. Navigating to DownloadScreen...');
        navigation.replace('DownloadScreen');

      } catch (error) {
        console.error('[FATAL_ERROR] An error occurred in DownloadStartScreen onPressDownload:', error);
      }
    };

    return (
      <LoaderContainer>
        <Text style={styles.titleSub}>Xin chào 👋</Text>
        <Text style={styles.subtitle}>
          Rất vui được gặp bạn tại máy chủ{'\n'}
          GTASAN.VN
        </Text>
        <View style={styles.buttons}>
          <ButtonLauncher
            btnWidth={'100%'}
            background={'#5476db'}
            IconLeft={DownloadSvg}
            onPress={onPressDownload}>
            Tải game
          </ButtonLauncher>
        </View>
      </LoaderContainer>
    );
  },
);
