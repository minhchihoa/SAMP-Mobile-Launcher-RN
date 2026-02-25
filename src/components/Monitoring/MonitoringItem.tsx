import { BottomSheetModal } from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { setSelectServer } from '../../actions/appActions';
import * as Anims from '../../assets/anims';
import { PeopleSvg } from '../../assets/svg';
import { scale, verticalScale } from '../../helpers/demensions';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { ServerOnlineType } from '../../reducers/serverReducer';
import { fetchServers } from '../../thunks/serverThunks';
import { styles } from './MonitoringStyle';

type MonitoringItemType = ServerOnlineType & {
  detachedServerRef: React.ForwardedRef<BottomSheetModal>;
};

const AnimsList = {
  1: Anims.Rocket,
  2: Anims.Rocket,
  3: Anims.Rocket,
  100: Anims.Hacker,
};

export const MonitoringItem = React.memo(
  ({ detachedServerRef, ...props }: MonitoringItemType) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(fetchServers());
    }, []);

    const selectServerHandler = useCallback(() => {
      dispatch(setSelectServer({ selectedServer: props.id }));
      detachedServerRef?.current?.present();
    }, [props.id]);

    return (
      <TouchableOpacity onPress={selectServerHandler} style={styles.body}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={['#2c2c2c', '#000000']}
          style={styles.item}>
          <View style={styles.content}>
            <View style={styles.anims}>
              <LottieView
                source={AnimsList[props.id] ?? Anims.Rocket}
                autoPlay
                loop
                style={styles.anim}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.subtitle}>{props.name}</Text>
              <View style={styles.static}>
                {props.loading && (
                  <ActivityIndicator size="small" color="#FFD700" />
                )}
                {!props.loading && props.status && (
                  <>
                    <PeopleSvg
                      style={{ marginRight: scale(5) }}
                      width={scale(20)}
                      height={verticalScale(20)}
                      fill={'#FFD700'}
                    />
                    <Text style={[styles.online, {fontSize: scale(16), fontWeight: 'bold'}]}>
                      {props.online ?? 50}
                      <Text style={[styles.subOnline, {fontSize: scale(14)}]}>
                        {` / ${props.slot ?? 100}`}
                      </Text>
                    </Text>
                  </>
                )}
                {!props.loading && !props.status && (
                  <Text style={styles.online}>Không có sẵn</Text>
                )}
              </View>
              <Text style={{ color: '#AAA', marginTop: verticalScale(5), fontSize: scale(14), fontWeight: 'bold' }}>
                  Map: Los Santos
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);
