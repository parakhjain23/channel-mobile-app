import NetInfo from "@react-native-community/netinfo";
import React, {useEffect} from 'react';
import { useDispatch } from "react-redux";
import { networkStatus } from "../redux/actions/network/NetworkActions";
const InternetConnection = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      dispatch(networkStatus(state?.isConnected))
    });
    return () => {
      unsubscribe();
    };
  });
  return null;
};
export default InternetConnection;
