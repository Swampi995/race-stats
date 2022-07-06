import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as storage from '../../services/storage';
import * as basic from '../../components';
import { carConnect, CarReduxProps } from '../../redux/connect/carConnect';
import * as Styles from '../../constants/Styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PastRunCard } from './PastCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export interface PastRunProps extends CarReduxProps {
  pastRun: storage.PastRunsProps;
}

interface PastRunState {
  openDetails: boolean;
}

export class PastRunView extends React.Component<PastRunProps, PastRunState> {

  state: Readonly<PastRunState> = {
    openDetails: false,
  }

  changePastRun = (value: boolean) => () => {
    this.setState({ openDetails: value })
  }

  get title(): string {
    switch (this.props.pastRun.type) {
      case '100': return this.props.isMetric ? '0-100 km/h' : '0-60 mph';
      case 'QuarterMile': return '1/4 mile'
      default: return 'Stat';
    }
  }

  get icon(): React.ReactNode {
    switch (this.props.pastRun.type) {
      case '100': return <Ionicons name={'ios-speedometer'} size={130} color={Styles.ACCENT_BLUE} />
      case 'QuarterMile': return <FontAwesome5 name={'traffic-light'} size={150} color={Styles.ACCENT_GREEN} />
      default: return null;
    }
  }

  render() {
    const { pastRun } = this.props;
    const date = moment(pastRun.date).calendar()
    return (
      <React.Fragment>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.changePastRun(true)} accessibilityRole={'none'} style={styles.card}>
            <View style={styles.textContainer}>
              <View style={styles.icon}>
                {this.icon}
              </View>
              <View style={styles.description}>
                <basic.CustomText label={this.title} color={'dark'} size={22} />
                <basic.CustomText label={`${Math.round(pastRun.time * 100) / 100} seconds`} color={'light'} />
                <basic.CustomText label={date} size={14} color={'dark'} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <PastRunCard {...this.props} title={this.title} visible={this.state.openDetails} close={this.changePastRun(false)} />
      </React.Fragment>
    );
  }
}

export default carConnect(PastRunView);


const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 150,
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Styles.BACKGROUND_MEDIUM,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  icon: {
    flex: 2,
    top: 0,
    left: -10,
    // position: 'absolute',
  },
  description: {
    flex: 3,
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
