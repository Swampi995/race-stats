import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import * as basic from '../../components';
import * as Styles from '../../constants/Styles';
import { PastRunProps } from './PastRun';
import { LineChart } from 'react-native-chart-kit';
import { captureRef } from 'react-native-view-shot';
import * as locationService from '../../services/location';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import * as util from '../../services/util';

interface PastRunCardProps extends PastRunProps {
  visible: boolean;
  title: string;
  close: () => void;
}

interface PastRunCardState {
}


export class PastRunCard extends React.Component<PastRunCardProps, PastRunCardState> {
  pageView: any = null;

  screenShot = async () => {
    return captureRef(this.pageView, { format: 'jpg', quality: 1.0 });
  }


  share = async () => {
    const uri = await this.screenShot();
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(`${'file://'}${uri}`,
        {
          dialogTitle: 'Share your stats',
          UTI: '.jpg'
        });
    }
  }

  setRef = (view: React.ReactNode) => {
    this.pageView = view;
  }

  render() {
    const { visible, pastRun, close, title, isMetric } = this.props;
    const speedGraph = pastRun.graph.speed.map((s) => isMetric ? locationService.convertSpeedToKMH(s) :
      locationService.convertSpeedToMPH(s));
    const isAcceleration = pastRun.type === '100';
    const initialTime = pastRun.graph.time[0];
    const labels = pastRun.graph.time.map((t) => Math.round(util.timeToSeconds(initialTime, t) * 10) / 10);
    const date = moment(pastRun.date).format('LLL');
    const quarterMileSpeed = pastRun.speed && (
      isMetric ? locationService.convertSpeedToKMH(pastRun.speed) :
        locationService.convertSpeedToMPH(pastRun.speed)).toFixed(0);
    return (
      <basic.FullModal visible={visible} >
        <View style={styles.container} collapsable={false}
          ref={this.setRef}>
          <View style={styles.titleContainer}>
            <basic.CustomText label={title} color={'dark'} size={22} />
            <basic.CustomText label={`${Math.round(pastRun.time * 100) / 100} seconds`} size={22} />
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              style={styles.chart}
              height={220}
              width={Dimensions.get('window').width - 35}
              data={{
                labels,
                datasets: [{
                  data: speedGraph
                }]
              }}
              chartConfig={{
                backgroundGradientFrom: Styles.PALE_YELLOW,
                backgroundGradientTo: Styles.PALE_YELLOW,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: () => Styles.BACKGROUND_MEDIUM,
              }}
              bezier
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.inline}>
              <basic.CustomText label={date} color={'dark'} size={16} />
            </View>
            <View style={styles.inline}>
              <basic.CustomText label={isAcceleration ? 'Full distance:  ' : 'Crossing speed: '} color={'dark'} size={16} />
              <basic.CustomText label={isAcceleration ? pastRun.distance : quarterMileSpeed} size={20} />
              <basic.CustomText label={isAcceleration ? ' m' : isMetric ? ' km/h' : ' mph'} color={'dark'} size={16} />
            </View>
            <View style={styles.inline}>
              <basic.CustomText label={'Altitude diference:  '} color={'dark'} size={16} />
              <basic.CustomText label={pastRun.altitude} size={20} />
              <basic.CustomText label={' m'} color={'dark'} size={16} />
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <basic.SecondaryButton onPress={close} size={35} textSize={14} bottomLabel={'Cancel'} />
          <basic.PrimaryButton onPress={this.share} size={35} textSize={14} bottomLabel={'Share'} />
        </View>
      </basic.FullModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartContainer: {
    flex: 3,
  },
  textContainer: {
    flex: 3,
  },
  bottomContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  chart: {
    borderRadius: 16,
  },
  inline: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
});
