import React from 'react';
import { View, StyleSheet, Switch, Platform, Text } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import Constants from 'expo-constants';
import * as basic from '../components';
import * as storage from '../services/storage';
import * as Styles from '../constants/Styles';
import { carConnect, CarReduxProps } from '../redux/connect/carConnect';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootTabScreenProps } from '../types';
import * as Sentry from 'sentry-expo';

interface SettingsScreenProps extends CarReduxProps, RootTabScreenProps<'settings'> {
}

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {

  const changeMetric = async (value: boolean) => {
    await storeIsMetric(value)
    props.setIsMetric(value);
  }

  const storeIsMetric = async (value: boolean) => {
    await storage.storeData(storage.IS_METRIC_KEY, value);
  }

  const resetStore = async () => {
    props.setCars(storage.defaultCar);
    await storage.storeData(storage.CARS_IDS, storage.defaultCar);
  }

  const resetPastRuns = async () => {
    await storage.storeData(storage.PAST_RUNS, {});
  }

  const bannerError = (error: string) => {
    Sentry.Native.captureMessage(error);
  }

  const adUnitID = Constants.isDevice && !__DEV__ ? Platform.select({
    ios: 'ca-app-pub-5724098793803537/8631776982',
    android: 'ca-app-pub-5724098793803537/7668187289',
  }) : 'ca-app-pub-3940256099942544/2934735716';

  return (
    <basic.Screen>
      <View style={styles.header}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <MaterialIcons name="settings" size={250} color={Styles.PALE_BLUE} />
          </View>
          <basic.CustomText color={'light'} label={'Settings'} size={40} />
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.inline}>
            <basic.CustomText color={'dark'} size={24}
              label={`Unit ${props.isMetric ? 'Metric' : 'Imperial'}`} />
            <View style={styles.switch}>
              <Switch value={props.isMetric} onValueChange={changeMetric}
                trackColor={{
                  false: Styles.TEXT_DARK,
                  true: Styles.ACCENT_YELLOW
                }}
              />
            </View>
          </View>
          <View style={styles.resetStats}>
            <View style={styles.resetStatsText}>
              <basic.CustomText color={'dark'} label={'Reset all stats'} size={24} />
            </View>
            <basic.PrimaryButton onPress={resetStore} size={30} />
          </View>
          <View style={styles.resetStats}>
            <View style={styles.resetStatsText}>
              <basic.CustomText color={'dark'} label={'Reset past runs'} size={24} />
            </View>
            <basic.PrimaryButton onPress={resetPastRuns} size={30} />
          </View>
          <View style={styles.description}>
            <basic.CustomText color={'dark'} size={14} label={`More settings comming soon, if you have any trouble using the app or there are some features that you want, let us know and we will come with an update soon.`} />
          </View>
        </View>
        <Text style={{ fontSize: 10, marginLeft: 16 }}>v{Constants.manifest?.version}</Text>
      </View>
      <View style={styles.add}>
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={adUnitID}
          servePersonalizedAds
          onDidFailToReceiveAdWithError={bannerError} />
      </View>
    </basic.Screen>
  );
}

export default carConnect(SettingsScreen);

const styles = StyleSheet.create({
  header: {
    flex: 3,
    alignItems: 'center',
    padding: 20,
  },
  card: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    backgroundColor: Styles.BACKGROUND_LIGHT,
    shadowColor: "#131417",
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4.00,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardIcon: {
    position: 'absolute',
    left: 0,
    top: -20,
  },
  metricContainer: {
    flex: 4,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  resetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  resetStatsText: {
    marginRight: 15,
  },
  description: {
    marginTop: 50,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  switch: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  add: {
  },
});
