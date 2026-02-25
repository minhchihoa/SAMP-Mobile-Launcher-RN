import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { ButtonLauncher, LoaderContainer } from '../components';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { styles } from '../styles/LoaderStyle';
import { fetchInitialApp } from '../thunks/appThunks';
import { setInitial } from './../actions/appActions';

type InitiationScreenType = NativeStackScreenProps<any>;

export const ErrorScreen = React.memo(
  ({ navigation }: InitiationScreenType) => {
    const dispatch = useAppDispatch();

    const reloadHandler = useCallback(() => {
      dispatch(setInitial({ initial: false }));
      dispatch(fetchInitialApp());
      navigation.replace('Initiation');
    }, []);

    return (
      <LoaderContainer>
        <Text style={styles.title}>
          Không thể kết nối{'\n'}
          <Text>đến tài nguyên của launcher</Text>
        </Text>
        <Text style={styles.alert}>
          Vui lòng kiểm tra kết nối internet trên thiết bị của bạn, hoặc thử lại
          sau.
        </Text>
        <View style={styles.buttons}>
          <ButtonLauncher
            btnWidth={'100%'}
            background={'#5476db'}
            onPress={reloadHandler}>
            Thử lại
          </ButtonLauncher>
        </View>
      </LoaderContainer>
    );
  },
);
