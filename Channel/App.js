// import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import StoreAppWrapper from './src/navigation/StoreAppWrapper';
import {persistor, store} from './src/redux/Store';
import Notifee from '@notifee/react-native'
const App = () => {
  useEffect(() => {
   Request()
  }, [])
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StoreAppWrapper />
      </PersistGate>
    </Provider>
  );
};
export default App;

async function Request(){
  await Notifee.requestPermission({
    alert:true
  })
}