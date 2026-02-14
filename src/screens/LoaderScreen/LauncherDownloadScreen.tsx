import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { verticalScale } from 'react-native-size-matters';
import { downloadSvg } from '../../assets/svg/index';
import { ButtonLauncher, LoaderContainer } from '../../components';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectLoaderDownload } from '../../selectors/loaderSelectors';
import { styles } from '../../styles/LoaderStyle';
import { updateLauncher } from '../../thunks/launcherTunks';

const width = Dimensions.get('window').width;

export const LauncherDownloadScreen = React.memo(() => {
  const dispatch = useAppDispatch();
  const download = useAppSelector(selectLoaderDownload);
  const [isFetchDownload, setIsFetchDownload] = useState(false);
  const [isError, setIsError] = useState(false);

  const onDownloadPress = () => {
    setIsFetchDownload(true);
    setIsError(false);
    dispatch(updateLauncher({ setIsError, setIsFetchDownload }));
  };

  return (
    <LoaderContainer>
      <Text style={[styles.title, styles.titleUppercase]}>
        Phiên bản launcher mới
      </Text>
      <Text style={styles.alert}>
        Một phiên bản mới của launcher đã có sẵn. Vui lòng tải xuống và cài đặt bản cập nhật để tiếp tục.
      </Text>

      {isError && (
        <Text style={[styles.alert, { color: '#ff4d4d' }]}>
          Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.
        </Text>
      )}

      <View style={styles.buttons}>
        {!isFetchDownload ? (
          <ButtonLauncher
            btnWidth={'100%'}
            background={'#5476db'}
            IconLeft={downloadSvg}
            onPress={onDownloadPress}>
            Tải xuống
          </ButtonLauncher>
        ) : (
          <View style={styles.progress}>
            <Text style={styles.progressTitle}>Đang tải xuống...</Text>
            <Progress.Bar
              animated={true}
              useNativeDriver={true}
              progress={
                download.needBytes > 0
                  ? download.currentBytes / download.needBytes
                  : 0
              }
              borderWidth={0}
              color={'#647fd3'}
              unfilledColor={'#2f3545'}
              borderRadius={20}
              height={10}
              width={width - verticalScale(40)}
            />
            <Text style={[styles.progressTitle, { marginTop: 10 }]}>
              {(download.currentBytes / 1024 / 1024).toFixed(2)} MB /{' '}
              {(download.needBytes / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
        )}
      </View>
    </LoaderContainer>
  );
});
