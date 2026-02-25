import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Monitoring from '../components/Monitoring/Monitoring';
import { MainContainer } from '../components/Provider/MainContainer';
import SheetServer from '../components/Sheet/SheetServer/SheetServer';
import { DepositModal } from '../components/Deposit/DepositModal';
import { LeaderboardModal } from '../components/Leaderboard/LeaderboardModal';
import { scale, verticalScale } from '../helpers/demensions';

export const GameScreen = React.memo(() => {
  const detachedServerRef = useRef<BottomSheetModal>(null);
  const depositRef = useRef<BottomSheetModal>(null);
  const leaderboardRef = useRef<BottomSheetModal>(null);

  return (
    <MainContainer paddingHorizontal={0}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, flexGrow: 1, justifyContent: 'center' }}>
        <Monitoring ref={detachedServerRef} />
        
        <View style={{ paddingHorizontal: scale(20), marginTop: verticalScale(10) }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#FFD700', 
                paddingVertical: verticalScale(15), 
                borderRadius: scale(10), 
                alignItems: 'center',
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 5,
              }}
              onPress={() => depositRef.current?.present()}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: scale(18), textTransform: 'uppercase' }}>NẠP TIỀN / DONATE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                backgroundColor: '#1A1A1A', 
                paddingVertical: verticalScale(15), 
                borderRadius: scale(10), 
                alignItems: 'center',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 5,
                marginTop: verticalScale(15),
                borderWidth: 1,
                borderColor: '#FFD700'
              }}
              onPress={() => leaderboardRef.current?.present()}
            >
              <Text style={{ color: '#FFD700', fontWeight: 'bold', fontSize: scale(18), textTransform: 'uppercase' }}>BẢNG XẾP HẠNG</Text>
            </TouchableOpacity>
        </View>

        <SheetServer ref={detachedServerRef} bottomInset={60} />
        <DepositModal ref={depositRef} />
        <LeaderboardModal ref={leaderboardRef} />
      </ScrollView>
    </MainContainer>
  );
});
