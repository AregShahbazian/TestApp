import React from 'react';
import {Text,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';


const Cont = (props) => {
  // console.log(1, props.state);
  return <TouchableOpacity onPress={()=>{

    const foo = require("./RootNavigation")
    foo.navigate('ChatScreen', { userName: 'Lucy' });
  }}>
    <Text>fooooo</Text>
  </TouchableOpacity>;
};

/*export default connect(
  (state) => {
    return {state: state};
  },
  null,
)(Cont);*/

export default Cont
