import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import ConnectScreen from './connect/screen'
import ScanScreen from './debug/scan'
import DebugScreen from './debug/screen'
import ListenerScreen from './listen/screen'
import WifiSettingsScreen from './wifi/screen'

const MainNavigator = createStackNavigator({
  Connect: { screen: ConnectScreen },
  Scan: { screen: ScanScreen },
  Debug: { screen: DebugScreen },
  Listener: { screen: ListenerScreen },
  Wifi: { screen: WifiSettingsScreen },
  initialRouteName: 'Connect'
})

const App = createAppContainer(MainNavigator)

export default App
