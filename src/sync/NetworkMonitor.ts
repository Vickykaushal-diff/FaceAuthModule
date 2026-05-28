import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetworkCallback = (isConnected: boolean) => void;

// One time network check
export const isNetworkAvailable = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable === true;
};

// Listen to network changes
export const subscribeToNetwork = (callback: NetworkCallback) => {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    const connected = state.isConnected === true && state.isInternetReachable === true;
    console.log(`📶 Network status: ${connected ? 'Online' : 'Offline'}`);
    callback(connected);
  });

  return unsubscribe; // Call this to stop listening
};