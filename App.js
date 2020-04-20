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
        console.log('then');
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  console.log({initialState});

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
                <Button
                  title="LINK"
                  onPress={() => {
                    console.log('PRESS');
                    Linking.openURL('testapp://Settings');
                  }}
                />
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
                }}>
                <Text>Hello {props.route.params.userName}</Text>
                <Button title="Go to Home" onPress={() => navigate('Home')} />
              </View>
            );
          }}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
