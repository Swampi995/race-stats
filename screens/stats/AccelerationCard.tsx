import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as util from '../../services/util';
import * as basic from '../../components';
import * as Styles from '../../constants/Styles';
import { SpeedStats } from '../StatsScreen';
import * as locationService from '../../services/location';

interface CardProps {
  item: {
    quarterMile: SpeedStats;
    acceleration: SpeedStats;
    time: number;
    resetAcceleration: () => void;
    isMetric: boolean;
  }
}

export default function AccelerationCard({ item }: CardProps) {

  const isAcceleration = !!item.acceleration;
  const isMeasuring = isAcceleration ? item.acceleration.inProgress : item.quarterMile.inProgress;
  const isReady = isAcceleration ? item.acceleration.ready : item.quarterMile.ready;
  const isDone = !isReady && !isMeasuring;
  const isMetric = item.isMetric;

  const accelerationTime = item.acceleration && (isDone ?
    util.timeToSeconds(item.acceleration.initialTime, item.acceleration.finalTime).toFixed(2) :
    isMeasuring ?
      util.timeToSeconds(item.acceleration.initialTime, item.time).toFixed(2) : 0);
  const accelerationDistange = item.acceleration &&
    (util.distangeBetweenPoints(item.acceleration.initialPlace, item.acceleration.finalPlace).toFixed(2));
  const accelerationAltitude = item.acceleration &&
    (item.acceleration.finalAltitude - item.acceleration.initialAltidute).toFixed(2);

  const quarterMileTime = item.quarterMile &&
    (isDone ?
      util.timeToSeconds(item.quarterMile.initialTime, item.quarterMile.finalTime).toFixed(2) :
      isMeasuring ?
        util.timeToSeconds(item.quarterMile.initialTime, item.time).toFixed(2) : 0);
  const quarterMileAltitude = item.quarterMile &&
    (item.quarterMile.finalAltitude - item.quarterMile.initialAltidute).toFixed(2);
  const quarterMileSpeed = item.quarterMile && (
    isMetric ? locationService.convertSpeedToKMH(item.quarterMile.finalSpeed) :
      locationService.convertSpeedToMPH(item.quarterMile.finalSpeed)).toFixed(0);

  const readyColor = isReady ? 'blue' : 'yellow';
  const readyText = isReady ? '  READY  ' : isMeasuring ? '  MEASURING  ' : '  DONE  ';

  return (
    <View style={styles.cardStyle}>
      <View style={styles.textContainer}>
        <View style={styles.icon}>
          {isAcceleration &&
            <View style={styles.smallIcon}>
              <Ionicons name={'ios-speedometer'} size={340} color={Styles.PALE_BLUE} />
            </View> ||
            <FontAwesome5 name={'traffic-light'} size={300} color={Styles.PALE_GREEN} />}
        </View>
        <View style={styles.firstStat}>
          <View style={styles.inline}>
            <basic.CustomText label={isAcceleration ? isMetric ? '0 - 100' : '0 - 60' : '1/4'} bold size={36} />
            <basic.CustomText label={isAcceleration ? isMetric ? ' km/h' : 'mph' : ' mile'} color={'dark'} size={24} />
          </View>
          <View style={styles.textDetails}>
            <View style={styles.inline}>
              <basic.CustomText label={isAcceleration ? 'Full distance:  ' : 'Crossing speed: '} color={'dark'} size={16} />
              <basic.CustomText label={!isDone ? 0 : isAcceleration ? accelerationDistange : quarterMileSpeed} size={20} />
              <basic.CustomText label={isAcceleration ? ' m' : isMetric ? ' km/h' : ' mph'} color={'dark'} size={16} />
            </View>
            <View style={styles.inline}>
              <basic.CustomText label={'Altitude diference:  '} color={'dark'} size={16} />
              <basic.CustomText label={!isDone ? 0 : isAcceleration ? accelerationAltitude : quarterMileAltitude} size={20} />
              <basic.CustomText label={' m'} color={'dark'} size={16} />
            </View>
          </View>
          <View style={styles.speed}>
            <View style={styles.inline}>
              <basic.CustomText label={isAcceleration ? accelerationTime : quarterMileTime} color={readyColor} size={36} />
              <basic.CustomText label={' s'} color={'dark'} size={24} />
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <basic.PrimaryButton bottomLabel={'Reset'} onPress={item.resetAcceleration} size={40} />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <basic.CustomText label={readyText} bold color={readyColor} size={24} />
        <basic.CustomText label={`To start wait for blue ready flag.`}
          color={'dark'} size={12} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30,
  },
  cardStyle: {
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
  inline: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  textDetails: {
    marginTop: 10,
  },
  firstStat: {
    flex: 3,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: Styles.BACKGROUND_MEDIUM,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'flex-end',
  },
  speed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    top: -20,
    left: -10,
    position: 'absolute',
  },
  smallIcon: {
    top: -25,
    left: -70,
  }
});
