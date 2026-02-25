import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, View } from 'react-native';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectServers } from '../../selectors/serverSelectors';
import { selectSettingLocalhost } from '../../selectors/settingSelectors';
import { MonitoringItem } from './MonitoringItem';
import { styles } from './MonitoringStyle';

type MonitoringType = {};

export const MonitoringComponent = React.memo(
  React.forwardRef<BottomSheetModal, MonitoringType>((props, ref) => {
    const servers = useAppSelector(selectServers);
    const localhost = useAppSelector(selectSettingLocalhost);

    return (
      <View style={styles.monitoring}>
        <Text style={styles.title}>CỘNG ĐỒNG GTASAN.VN</Text>
        <View style={styles.monitorings}>
          {servers.length > 0 && (
             <MonitoringItem key={servers[0].id} {...servers[0]} detachedServerRef={ref} />
          )}
        </View>
      </View>
    );
  }),
);

const Monitoring = React.memo(MonitoringComponent);
Monitoring.displayName = 'Monitoring';

export default Monitoring;
