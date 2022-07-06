import React from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import * as basic from '../components';
import Constants from 'expo-constants';
import * as storage from '../services/storage';
import { pastRunsConnect, PastRunsReduxProps } from '../redux/connect/pastRunsConnect';
import PastRunView from './pastRuns/PastRun';
import { RootTabScreenProps } from '../types';
import * as Sentry from 'sentry-expo';

interface PastRunsProps extends PastRunsReduxProps, RootTabScreenProps<'pastRuns'> {
}

const PastRunsScreen: React.FC<PastRunsProps> = (props) => {

  const resetPastRuns = async () => {
    await storage.storeData(storage.PAST_RUNS, {});
  }

  const items = props.pastRuns && Object.keys(props.pastRuns).map((key) => props.pastRuns[parseInt(key)]);

  const bannerError = (error: string) => {
    Sentry.Native.captureMessage(error);
  }

  const keyExtractor = (item: storage.PastRunsProps) => `${item.time}:${item.type}`

  const adUnitID = Constants.isDevice && !__DEV__ ? Platform.select({
    ios: 'ca-app-pub-5724098793803537/8650026650',
    android: 'ca-app-pub-5724098793803537/5246995934',
  }) : 'ca-app-pub-3940256099942544/2934735716';

  return (
    <basic.Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <basic.CustomText size={24} label={'Past runs'} />
        </View>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }) => <PastRunView key={index} pastRun={item} />}
        />
        {/* <View style={styles.body}>
            <basic.CustomText label={`Here you will see your past runs detailed. You'll see the acceleration graph and even the aproximated horse power of you car.`} />
          </View>
          <View style={styles.body}>
            <basic.CustomText label={'Coming soon...'} color={'yellow'} />
          </View> */}
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

export default pastRunsConnect(PastRunsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  body: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  add: {
  },
});
