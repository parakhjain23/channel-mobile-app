// import 'react-native-gesture-handler';
import React from 'react'
import createSocketMiddleware from './Socket';
import StoreAppWrapper from './src/navigation/StoreAppWrapper';

const App = () => {
  createSocketMiddleware()
  return (
    <StoreAppWrapper />
  )
}
export default App;