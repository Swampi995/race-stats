import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { DeviceMotion, Pedometer } from 'expo-sensors';
import { AdMobBanner } from 'expo-ads-admob';
import GForce from './gforce/GForce';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as basic from '../components';
import { carConnect, CarReduxProps } from '../redux/connect/carConnect';
import * as Styles from '../constants/Styles';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import * as StoreReview from 'expo-store-review';
import * as storage from '../services/storage';
import { RootTabScreenProps } from '../types';
import * as locationService from '../services/location';

interface GForceScreenProps extends CarReduxProps, RootTabScreenProps<'gforce'> {
}

class GForceScreen extends React.Component<GForceScreenProps> {

  state = {
    acceleration: {
      x: 0,
      y: 0,
      z: 0,
    },
    g: 0,
    maxG: 0,
    lastAcceleration: 0,
  };


  // kf = new KalmanFilter();
  subscription: Pedometer.Subscription = { remove: () => { } };
  addTimer = null;

  componentDidMount() {
    this.props.navigation.addListener('focus', this.onFocus);
    this.props.navigation.addListener('blur', this.onBlur);

    setTimeout(() => this.showReview(), 20000);
  }

  // LOW PASS
  ALPHA = 0.01;
  oldValsLowPass: number[] = [];
  protected lowPass(input: number[], output: number[]) {
    if (output == null) {
      return input;
    }

    for (let i = 0; i < input.length; i++) {
      output[i] = output[i] + this.ALPHA * (input[i] - output[i]);
    }

    return output;
  }

  // HIGH PASS
  oldValsHighPass: number[] = [];
  protected highPass(input: number[], output: number[]) {
    if (output == null) {
      return input;
    }

    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] * this.ALPHA + output[i] * (1 - this.ALPHA);
    }

    return output;
  }

  // HIGH PASS APPLE
  ADAPTIVE_ACCEL_FILTER = true;
  lastAccel: number[] = [0, 0, 0];
  accelFilter: number[] = [0, 0, 0];
  onAccelerometerChanged(accelX: number, accelY: number, accelZ: number) {
    // high pass filter
    const updateFreq = 30; // match this to your update speed
    const cutOffFreq = 0.9;
    const RC = 1.0 / cutOffFreq;
    const dt = 1.0 / updateFreq;
    const filterConstant = RC / (dt + RC);
    let alpha = filterConstant;
    const kAccelerometerMinStep = 0.033;
    const kAccelerometerNoiseAttenuation = 3.0;

    if (this.ADAPTIVE_ACCEL_FILTER) {
      const d = this.clamp(Math.abs(this.norm(this.accelFilter[0], this.accelFilter[1], this.accelFilter[2]) -
        this.norm(accelX, accelY, accelZ)) / kAccelerometerMinStep - 1.0, 0.0, 1.0);
      alpha = d * filterConstant / kAccelerometerNoiseAttenuation + (1.0 - d) * filterConstant;
    }

    this.accelFilter[0] = (alpha * (this.accelFilter[0] + accelX - this.lastAccel[0]));
    this.accelFilter[1] = (alpha * (this.accelFilter[1] + accelY - this.lastAccel[1]));
    this.accelFilter[2] = (alpha * (this.accelFilter[2] + accelZ - this.lastAccel[2]));

    this.lastAccel[0] = accelX;
    this.lastAccel[1] = accelY;
    this.lastAccel[2] = accelZ;

    return [this.accelFilter[0], this.accelFilter[1], this.accelFilter[2]];
  }

  norm(x: number, y: number, z: number) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  clamp(v: number, min: number, max: number) {
    if (v > max)
      return max;
    else if (v < min)
      return min;
    else
      return v;
  }

  onFocus = () => {
    this.subscription = DeviceMotion.addListener((data) => {
      if (!data || !data.accelerationIncludingGravity) {
        return;
      }

      // LOW PASS
      // let { x, y, z } = data.acceleration;
      // this.oldValsLowPass = this.lowPass([x, y, z], this.oldValsLowPass);
      // [x, y, z] = this.oldValsLowPass;

      // HIGH PASS
      // let { x, y, z } = data.accelerationIncludingGravity;
      // this.oldValsHighPass = this.highPass([x, y, z], this.oldValsHighPass);
      // [x, y, z] = this.oldValsHighPass;

      // KALMAN
      // const x = this.kf.filter(data.accelerationIncludingGravity.x)
      // const y = this.kf.filter(data.accelerationIncludingGravity.y)
      // const z = this.kf.filter(data.accelerationIncludingGravity.z)

      // APPLE
      let { x, y, z } = data.accelerationIncludingGravity;
      [x, y, z] = this.onAccelerometerChanged(x, y, z);

      // NON FILTER
      // const { x, y, z } = data.accelerationIncludingGravity;

      const g = (Math.sqrt(data.accelerationIncludingGravity.x * data.accelerationIncludingGravity.x + data.accelerationIncludingGravity.y * data.accelerationIncludingGravity.y + data.accelerationIncludingGravity.z * data.accelerationIncludingGravity.z) / 9.81) - 1;

      if (g > this.state.maxG) {
        this.setState({ maxG: g });
      }

      this.setState({
        g,
        acceleration: {
          x, y, z
        },
      });
      // console.log(`x: ${kf.filter(x)} y: ${kf.filter(y)} z: ${kf.filter(z)}`)
      DeviceMotion.setUpdateInterval(30);
    });
  }

  showReview = async () => {
    const reviewed = await storage.retrieveData('reviewed');
    if (!reviewed) {
      await StoreReview.requestReview();
      await storage.storeData(storage.REVIEWD, true);
    }
  }

  // showAdd = async () => {
  //   if (Platform.OS === 'ios') {
  //     // IOS
  //     await AdMobInterstitial.setAdUnitID('ca-app-pub-5724098793803537/8620993103');
  //   }
  //
  //   if (Platform.OS === 'android') {
  //     // Android
  //     await AdMobInterstitial.setAdUnitID('ca-app-pub-5724098793803537/1672441370');
  //   }
  //
  //   await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
  //   await AdMobInterstitial.showAdAsync();
  // }

  onBlur = () => {
    // clearInterval(this.addTimer);
    DeviceMotion.removeSubscription(this.subscription);

    this.subscription?.remove();
    this.subscription = { remove: () => { } };
  }

  reset = () => {
    this.setState({ maxG: 0 })
  }

  bannerError = (error: string) => {
    Sentry.Native.captureMessage(error);
  }

  render() {
    const { x, y, z } = this.state.acceleration;
    const { g, maxG } = this.state;
    const topPoint = 50 + 4 * z + 4 * y;
    const leftPoint = 50 + 4 * x;
    const speed = this.props.isMetric ? locationService.convertSpeedToKMH(this.props.speed) :
      locationService.convertSpeedToMPH(this.props.speed);

    const adUnitID = Constants.isDevice && !__DEV__ ? Platform.select({
      ios: 'ca-app-pub-5724098793803537/8680684614',
      android: 'ca-app-pub-5724098793803537/6764929720',
    }) : 'ca-app-pub-3940256099942544/2934735716';

    return (
      <basic.Screen>
        <View style={styles.header}>
          <View style={styles.headerCard}>
            <View style={styles.headerCardContainer}>
              <View style={styles.headerIcon}>
                <MaterialCommunityIcons name="target" size={250} color={Styles.PALE_BLUE} />
              </View>
              <View style={styles.inline}>
                <basic.CustomText label={`${(Math.abs(g || 0)).toFixed(1)}`} size={60} />
                <basic.CustomText label={` G`} size={40} color={'dark'} />
              </View>
            </View>
            <View style={styles.headerCardBottomContainer}>
              <View style={styles.inline}>
                <basic.CustomText label={'Keep the phone in the fully upright position.'} color={'dark'} size={14} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.gforce}>
          <View style={styles.cards}>
            <View style={styles.miniCard}>
              <View style={styles.text}>
                <View style={styles.inline}>
                  <basic.CustomText label={`  ${(speed || 0).toFixed()}`} size={24} />
                  <basic.CustomText label={this.props.isMetric ? ` km/h` : ' mph'} size={14} color={'dark'} />
                </View>
              </View>
              <View style={styles.description}>
                <basic.CustomText label={'Speed'} color={'dark'} size={14} />
              </View>
            </View>
            <View style={styles.miniCard}>
              <View style={styles.text}>
                <View style={styles.inline}>
                  <basic.CustomText label={`  ${(maxG || 0).toFixed(1)}`} size={24} />
                  <basic.CustomText label={` G`} size={14} color={'dark'} />
                </View>
              </View>
              <View style={styles.description}>
                <basic.CustomText label={'G Force'} color={'dark'} size={14} />
              </View>
            </View>
          </View>
          <GForce topPoint={topPoint} leftPoint={leftPoint} />
        </View>
        <View style={styles.footer}>
          <basic.PrimaryButton onPress={this.reset} bottomLabel={'Reset'} />
        </View>
        <View style={styles.add}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={adUnitID}
            servePersonalizedAds
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
      </basic.Screen>
    );
  }
}

export default carConnect(GForceScreen);

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cards: {
    paddingLeft: 20,
    paddingRight: 20,
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  gforce: {
    flex: 3,
    marginTop: 40,
  },
  footer: {
    flex: 1,
  },
  miniCard: {
    height: 100,
    width: 100,
    alignItems: 'center',
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    height: '100%',
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
  },
  description: {
  },
  inline: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  headerCardContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerIcon: {
    position: 'absolute',
    left: 0,
    top: -20,
  },
  headerCardBottomContainer: {
    flex: 1,
    backgroundColor: Styles.BACKGROUND_MEDIUM,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
  },
});
