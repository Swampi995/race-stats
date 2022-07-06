import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://39832f2e32b74cc29e71f2fc1bbd5f92@o372933.ingest.sentry.io/5371800',
  enableInExpoDevelopment: false,
  debug: true,
});

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
          'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
          'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
          'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
