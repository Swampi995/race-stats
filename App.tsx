import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as Styles from './constants/Styles';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import reducers from './redux/reducers';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

export default function App() {
  const isLoadingComplete = useCachedResources();
  useKeepAwake();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <Navigation />
        </Provider>
        <StatusBar />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Styles.BACKGROUND_DARK,
  },
});
