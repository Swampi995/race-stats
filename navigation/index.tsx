import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'; import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import * as Updates from 'expo-updates';
import IconEntypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ModalScreen from '../screens/ModalScreen';
import StatsScreen from '../screens/StatsScreen';
import GForce from '../screens/GForce';
import PastRuns from '../screens/PastRuns';
import Settings from '../screens/Settings';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { carConnect, CarReduxProps } from '../redux/connect/carConnect';
import { pastRunsConnect, PastRunsReduxProps } from '../redux/connect/pastRunsConnect';
import * as storage from '../services/storage';
import * as service from '../services/storage/service';
import * as Styles from '../constants/Styles';

const Navigation: React.FC<CarReduxProps & PastRunsReduxProps> = (props) => {
  React.useEffect(() => {
    fetchUpdates();
    loadData();
  }, []);

  const fetchUpdates = async () => {
    if (!__DEV__) {
      const update = await Updates.fetchUpdateAsync();
      if (update && update.isNew) {
        await Updates.reloadAsync();
      }
    }
  }

  const loadData = async () => {
    const cars = await storage.retrieveData<storage.CarsObject>(storage.CARS_IDS);
    const selectedKey = await storage.retrieveData<string>(storage.SELECTED_KEY);
    const isMetric = await storage.retrieveData<boolean>(storage.IS_METRIC_KEY);

    if (!cars) {
      await storage.storeData(storage.CARS_IDS, storage.defaultCar);
      await storage.storeData(storage.SELECTED_KEY, 'default');
    }

    props.setCars(cars || storage.defaultCar);
    props.setSelectedCar(selectedKey || 'default');
    props.setIsMetric(isMetric === undefined ? true : isMetric);

    const pastRuns = await service.getPastRuns();
    pastRuns && props.setPastRuns(pastRuns);
  }

  return (
    <NavigationContainer
      theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default pastRunsConnect(carConnect(Navigation))

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {

  return (
    <BottomTab.Navigator
      initialRouteName="stats"
      labeled={false}
      activeColor={Styles.TEXT_LIGHT}
      inactiveColor={Styles.TEXT_DARK}
      barStyle={{ backgroundColor: Styles.BACKGROUND_DARK }}>
      <BottomTab.Screen
        name="stats"
        component={StatsScreen}
        options={({ navigation }: RootTabScreenProps<'stats'>) => ({
          title: 'Time Stats',
          tabBarIcon: ({ color }) => <IconEntypo name="stopwatch" size={25} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="gforce"
        component={GForce}
        options={({ navigation }: RootTabScreenProps<'gforce'>) => ({
          title: 'G Force',
          tabBarIcon: ({ color }) => <Foundation name="target-two" size={27} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="pastRuns"
        component={PastRuns}
        options={({ navigation }: RootTabScreenProps<'pastRuns'>) => ({
          title: 'Past Runs',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="history" size={27} color={color} />,
        })}
      />
      <BottomTab.Screen
        name="settings"
        component={Settings}
        options={({ navigation }: RootTabScreenProps<'settings'>) => ({
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={27} color={color} />,
        })}
      />
    </BottomTab.Navigator>
  );
}
