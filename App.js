import * as React from 'react';
import {Button, Linking, Text, View} from 'react-native';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}

const RootStack = createStackNavigator();

export default function App() {
  const {getInitialState} = useLinking(navigationRef, {
    prefixes: ['https://testapp.com', 'testapp://'],
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise(resolve =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150),
      ),
    ])
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef} initialState={initialState}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home">
          {props => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>Home Page</Text>
                <View
                  style={{
                    marginVertical: 8,
                  }}>
                  <Button
                    title="LINK with testapp://"
                    onPress={() => {
                      Linking.openURL('testapp://Settings');
                    }}
                  />
                </View>
                <View
                  style={{
                    marginVertical: 8,
                  }}>
                  <Button
                    title="LINK with https://testapp.com"
                    onPress={() => {
                      Linking.openURL('https://testapp.com/Settings');
                    }}
                  />
                </View>
              </View>
            );
          }}
        </RootStack.Screen>
        <RootStack.Screen name="Settings">
          {props => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 8,
                }}>
                <Text>Settings Page</Text>
                <Button title="Go Back" onPress={() => navigate('Home')} />
              </View>
            );
          }}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
