import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as basic from '../../components';
import * as locationService from '../../services/location';
import * as storage from '../../services/storage';

interface BestStatsCardProps {
  stats: storage.CarStats;
  isMetric: boolean;
}

export default function BestStatsCard({ stats, isMetric }: BestStatsCardProps) {
  const speed = isMetric ? locationService.convertSpeedToKMH(stats.topSpeed) :
    locationService.convertSpeedToMPH(stats.topSpeed);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inline}>
          <basic.CustomText label={speed ? speed : '-'} bold size={24} />
          <basic.CustomText label={isMetric ? ' km/h' : ' mph'} color={'dark'} size={14} />
        </View>
        <View style={styles.inline}>
          <basic.CustomText label={'Top Speed'} color={'dark'} size={14} />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.inline}>
          <basic.CustomText
            label={stats.best100Acceleration ? Math.round(stats.best100Acceleration * 100) / 100 : '-'}
            bold size={24} />
          <basic.CustomText label={' sec'} color={'dark'} size={14} />
        </View>
        <View style={styles.inline}>
          <basic.CustomText label={isMetric ? 'Best 0 - 100 km/h' : 'Best 0 - 60 mph'} color={'dark'} size={14} />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.inline}>
          <basic.CustomText
            label={stats.bestQuarterMileAcceleration ? Math.round(stats.bestQuarterMileAcceleration * 100) / 100 : '-'}
            bold size={24} />
          <basic.CustomText label={' sec'} color={'dark'} size={14} />
        </View>
        <View style={styles.inline}>
          <basic.CustomText label={'Best 1/4 mile'} color={'dark'} size={14} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%',
  },
  card: {
  },
  inline: {
    alignItems: 'baseline',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
