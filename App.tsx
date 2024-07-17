import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './AppNavigator';
import { store } from './store';
import { Provider } from 'react-redux';

const App:React.FC =()=> {
  return (
    <Provider store={store} >
      <AppNavigator />
    </Provider>
  );
}

export default App ;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
