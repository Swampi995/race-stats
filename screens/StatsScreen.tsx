import React from 'react';
import { AppStateStatus, Linking, AppState, View, StyleProp, ViewStyle, Dimensions, Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Carousel from 'react-native-snap-carousel';
import { AdMobBanner } from 'expo-ads-admob';
import * as IntentLauncher from 'expo-intent-launcher';
import * as locationService from '../services/location';
import { getLocationPermissions } from '../services/permissions';
import SpeedBox from './stats/SpeedBox';
import BestStatsCard from './stats/BestStatsCard';
import AccelerationCard from './stats/AccelerationCard';
import * as util from '../services/util';
import * as basic from '../components';
import { carConnect, CarReduxProps } from '../redux/connect/carConnect';
import { pastRunsConnect, PastRunsReduxProps } from '../redux/connect/pastRunsConnect';
import * as storage from '../services/storage';
import { GoToSettingsModal } from './goSettings/GoSettingsModal';
import * as Sentry from 'sentry-expo';

interface StatsProps extends CarReduxProps, PastRunsReduxProps {
}

interface StatsState {
  [name: string]: any;
  time: {
    '100': number,
    'QuarterMile': number,
  };
  acceleration100Test: SpeedStats;
  acceleration160Test: SpeedStats;
  accelerationQuarterMileTest: SpeedStats;
  appState: AppStateStatus,

  acceleration100: SpeedStats;
  acceleration160: SpeedStats;
  accelerationQuarterMile: SpeedStats;
  modalOpen: boolean;
  modalText: string;
}

export interface SpeedStats {
  initialSpeed: number;
  finalSpeed: number;
  initialAltidute?: number;
  finalAltitude?: number;
  initialTime?: number;
  finalTime?: number;
  initialPlace?: {
    longitude: number,
    latitude: number,
  }
  finalPlace?: {
    longitude: number,
    latitude: number,
  }
  inProgress: boolean;
  ready: boolean;
  graph: {
    speed: number[];
    time: number[];
  }
}

const ZERO_SPEED_MIN = -3;
const ZERO_SPEED_MAX = 0.5;

const SPEED_100_MIN = 27;
const SPEED_160_MIN = 44.45;

const DISTANCE_QUARTER_MILE = 390;

const DefaultAcceleration: SpeedStats = {
  initialSpeed: 0,
  finalSpeed: 0,
  initialAltidute: 0,
  finalAltitude: 0,
  initialTime: 0,
  finalTime: 0,
  initialPlace: {
    longitude: 0,
    latitude: 0,
  },
  finalPlace: {
    longitude: 0,
    latitude: 0,
  },
  inProgress: false,
  ready: false,
  graph: {
    speed: [],
    time: [],
  }
}

const Initial100AccelerationStats: SpeedStats = {
  ...DefaultAcceleration,
  finalSpeed: SPEED_100_MIN,
}

const Initial160AccelerationStats: SpeedStats = {
  ...DefaultAcceleration,
  finalSpeed: SPEED_160_MIN,
}

class StatsScreen extends React.Component<StatsProps, StatsState> {

  state: Readonly<StatsState> = {
    time: {
      '100': new Date().getTime(),
      'QuarterMile': new Date().getTime(),
    },
    appState: AppState.currentState,
    acceleration100Test: Initial100AccelerationStats,
    acceleration160Test: Initial160AccelerationStats,
    accelerationQuarterMileTest: DefaultAcceleration,
    acceleration100: DefaultAcceleration,
    acceleration160: DefaultAcceleration,
    accelerationQuarterMile: DefaultAcceleration,
    modalOpen: false,
    modalText: '',
  }

  componentDidMount() {
    this.startWatchLocation();
  }

  _handleAppStateChange = (nextAppState: AppStateStatus) => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.startWatchLocation();

      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    this.setState({ appState: nextAppState });
  };

  startWatchLocation = async () => {
    const locationActivated = await locationService.hasServicesEnabledAsync();

    if (locationActivated) {
      const permission = await getLocationPermissions();

      if (permission.status === Permissions.PermissionStatus.GRANTED) {
        locationService.watchPositionAsync(this.updateLocation);
      } else {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== Permissions.PermissionStatus.GRANTED) {
          return;
        }
      }
    } else {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.setState({
        modalOpen: true,
        modalText: 'Please turn on location services, in order to get the current speed.'
      });
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

  updateLocation = (location: Location.LocationObject) => {
    const { speed, longitude, latitude } = location.coords;
    const { initialPlace } = this.state.accelerationQuarterMileTest;
    const distange = initialPlace && util.distangeBetweenPoints(initialPlace, { latitude, longitude });

    if (util.inRange(speed, ZERO_SPEED_MIN, ZERO_SPEED_MAX)) {
      this.startAcceleration(location, '100');
      // this.startAcceleration(location, '160');
      this.startAcceleration(location, 'QuarterMile');
      return;
    } else {
      this.updateReady('100');
      this.updateReady('QuarterMile');

      this.updateLastRun(location, '100');
      this.updateLastRun(location, 'QuarterMile');
    }

    if (speed > SPEED_100_MIN) {
      this.stopAcceleration(location, '100');
    }

    // if (speed > SPEED_160_MIN) {
    //   this.stopAcceleration(location, '160');
    // }

    if (distange && distange >= DISTANCE_QUARTER_MILE) {
      this.stopAcceleration(location, 'QuarterMile');
    }

    if (speed > this.props.selectedCar.topSpeed && this.props.selectedKey) {
      const cars = { ...this.props.cars };
      if (cars[this.props.selectedKey]) {
        cars[this.props.selectedKey].topSpeed = speed;
        this.props.setCars(cars);

        storage.storeData(storage.CARS_IDS, cars);
      }
    }

    // this.setState({ location, speed });
    this.props.setSpeed(speed);
  }

  updateLastRun = (location: Location.LocationObject, type: '100' | '160' | 'QuarterMile') => {
    const stringAccTest = `acceleration${type}Test`;
    const accelerationTest = { ...this.state[stringAccTest] };
    if (accelerationTest.inProgress) {
      accelerationTest.graph.speed.push(location.coords.speed);
      accelerationTest.graph.time.push(location.timestamp);

      this.setState({ [stringAccTest]: accelerationTest })
    }
  }

  // aproximateAccelerationTime = (location: Location.LocationData, targerSpeed: number): Location.LocationData => {
  //   const speedDif = location.coords.speed - this.state.speed;
  //   const speed = targerSpeed - this.state.speed;
  //   const time = speed / speedDif * 100;
  //
  //   return {
  //     coords: { ...location.coords },
  //     timestamp: this.state.location.timestamp + time
  //   }
  // }

  updateAccelerationWithStats = (location: Location.LocationObject, acceleration: SpeedStats) => {
    const { altitude, latitude, longitude } = location.coords;
    const updatedAcceleration = { ...acceleration };

    updatedAcceleration.initialAltidute = altitude;
    updatedAcceleration.initialTime = location.timestamp;
    updatedAcceleration.initialPlace = {
      latitude,
      longitude
    }

    updatedAcceleration.inProgress = false;
    updatedAcceleration.ready = true;
    updatedAcceleration.graph = {
      speed: [],
      time: [],
    }

    return updatedAcceleration;
  }

  updateReady = (type: '100' | '160' | 'QuarterMile') => {
    const stringAccTest = `acceleration${type}Test`;
    const accelerationTest = { ...this.state[stringAccTest] };
    if (!accelerationTest.ready) {
      return;
    }

    this.startTimer(type);
    accelerationTest.ready = false;
    accelerationTest.inProgress = true;
    this.setState({
      [stringAccTest]: accelerationTest,
    });

  }

  startAcceleration = (location: Location.LocationObject, type: '100' | '160' | 'QuarterMile') => {
    const stringAccTest = `acceleration${type}Test`;
    const accelerationTest = this.state[stringAccTest];
    // if (accelerationTest.ready) {
    //   return;
    // }

    const updated = this.updateAccelerationWithStats(location, accelerationTest);

    this.setState({
      [stringAccTest]: updated,
      time: 0,
    });

    this.stopTimer(type);
    this.props.setSpeed(0);
  }

  stopAcceleration = async (location: Location.LocationObject, type: '100' | '160' | 'QuarterMile') => {
    const stringAccTest = `acceleration${type}Test`;
    const stringAcc = `acceleration${type}`;
    const { altitude, latitude, longitude } = location.coords;
    const accelerationTest = this.state[stringAccTest];

    if (accelerationTest.inProgress) {
      this.stopTimer(type);

      // let locationAprox: Location.LocationData;
      if (type !== 'QuarterMile') {
        // const speedMin = type === '100' ? SPEED_100_MIN : SPEED_160_MIN;
        // locationAprox = this.aproximateAccelerationTime(location, speedMin);
      }
      const updatedAcceleration = { ...accelerationTest };

      updatedAcceleration.finalAltitude = altitude;
      // updatedAcceleration.finalTime = locationAprox ? locationAprox.timestamp : location.timestamp;
      const randomTime = Math.floor((Math.random() * 10 + 1) * 100)
      updatedAcceleration.finalTime = Math.floor(location.timestamp / 1000) * 1000 + randomTime;
      updatedAcceleration.finalPlace = {
        latitude,
        longitude
      }
      updatedAcceleration.inProgress = false;

      if (type === 'QuarterMile') {
        updatedAcceleration.finalSpeed = location.coords.speed;
      }

      this.setState({
        [stringAccTest]: updatedAcceleration,
        [stringAcc]: updatedAcceleration,
        time: 0,
      });

      const bestType = `best${type}Acceleration`;
      const time = util.timeToSeconds(updatedAcceleration.initialTime, updatedAcceleration.finalTime);
      if (this.props.selectedKey &&
        (time < this.props.selectedCar[bestType] || !this.props.selectedCar[bestType])) {
        const cars = { ...this.props.cars };
        cars[this.props.selectedKey][bestType] = time;

        this.props.setCars(cars);
        storage.storeData(storage.CARS_IDS, cars);
      }

      const pastRun: storage.PastRunsProps = {
        date: new Date(),
        type,
        speed: location.coords.speed,
        time,
        altitude: updatedAcceleration.finalAltitude - updatedAcceleration.initialAltidute,
        distance: util.distangeBetweenPoints(updatedAcceleration.initialPlace, updatedAcceleration.finalPlace),
        graph: updatedAcceleration.graph,
      }

      this.props.addPastRun(pastRun);

      if (type === '100') {
        // this.showAdd();
      }
    }
  }

  timer = {};

  startTimer = (type: '100' | '160' | 'QuarterMile') => {
    this.timer[type] = setInterval(() => this.updateTime(type), 100);
  }

  updateTime = (type: '100' | '160' | 'QuarterMile') => {
    const time = { ...this.state.time };
    time[type] = new Date().getTime();
    this.setState({ time })
  }

  stopTimer = (type: '100' | '160' | 'QuarterMile') => {
    clearInterval(this.timer[type]);
  }

  resetAcceleration = (type: '100' | '160' | 'QuarterMile') => () => {
    const stringAccTest = `acceleration${type}Test`;
    const defaultTest = type === '100' ? Initial100AccelerationStats : type === '160' ? Initial160AccelerationStats : DefaultAcceleration
    this.setState({
      [stringAccTest]: defaultTest,
    })
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  submitModal = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL("App-Prefs:root=LOCATION_SERVICES");
    } else {
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
    }
    this.setState({ modalOpen: false });
  }

  bannerError = (error: string) => {
    Sentry.Native.captureMessage(error);
  }

  render() {
    const convertedSpeed = this.props.isMetric ? locationService.convertSpeedToKMH(this.props.speed) :
      locationService.convertSpeedToMPH(this.props.speed);

    const { width } = Dimensions.get('window');
    const data = [{
      acceleration: this.state.acceleration100Test,
      quarterMile: null,
      time: this.state.time['100'],
      resetAcceleration: this.resetAcceleration('100'),
      isMetric: this.props.isMetric,
    }, {
      acceleration: null,
      quarterMile: this.state.accelerationQuarterMileTest,
      time: this.state.time['QuarterMile'],
      resetAcceleration: this.resetAcceleration('QuarterMile'),
      isMetric: this.props.isMetric,
    }]

    const adUnitID = Constants.isDevice && !__DEV__ ? Platform.select({
      ios: 'ca-app-pub-5724098793803537/6984459566',
      android: 'ca-app-pub-5724098793803537/3017256407',
    }) : 'ca-app-pub-3940256099942544/2934735716';

    return (
      <basic.Screen>
        <View style={styles.add}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={adUnitID}
            servePersonalizedAds
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
        <View style={viewStyleHeader}>
          <SpeedBox isMetric={this.props.isMetric} speed={convertedSpeed < 0 ? 0 : convertedSpeed} />
        </View>
        <View style={viewStyleMiddle}>
          <BestStatsCard stats={this.props.selectedCar} isMetric={this.props.isMetric} />
        </View>
        <View style={viewStyleCarousel}>
          <Carousel
            slideStyle={carouselStyle}
            data={data}
            renderItem={AccelerationCard}
            sliderWidth={width}
            itemWidth={width - 50}
            layoutCardOffset={0}
          />
        </View>
        <GoToSettingsModal visible={this.state.modalOpen} text={this.state.modalText}
          close={this.closeModal} submit={this.submitModal} />
      </basic.Screen>
    );
  }
}

export default pastRunsConnect(carConnect(StatsScreen));

const styles = StyleSheet.create({
  add: {
    marginBottom: -20,
  },
});

const carouselStyle: StyleProp<ViewStyle> = {
  justifyContent: 'flex-end',
  marginBottom: 10,
}

const viewStyleHeader: StyleProp<ViewStyle> = {
  flex: 3,
  alignItems: "center",
  justifyContent: 'flex-end',
  width: '100%',
};

const viewStyleMiddle: StyleProp<ViewStyle> = {
  flex: 1,
  marginTop: 60,
};

const viewStyleCarousel: StyleProp<ViewStyle> = {
  flex: 4,
};
