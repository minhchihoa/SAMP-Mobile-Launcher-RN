import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Cards } from '../components/Card/Cards';
import { MainContainer } from '../components/Provider/MainContainer';
import { scale, verticalScale } from 'react-native-size-matters';

export const NewsScreen = React.memo(() => {
  return (
    <MainContainer paddingHorizontal={0}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.wrapper}>
            <Text style={styles.title}>TIN TỨC MÁY CHỦ</Text>
            <Cards />
        </View>
      </ScrollView>
    </MainContainer>
  );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: 30,
    },
    wrapper: {
        marginTop: verticalScale(20),
    },
    title: {
        fontSize: scale(20),
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: verticalScale(10),
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    }
});
