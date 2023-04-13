import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  Linking,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setIntialOrgId} from '../../redux/actions/org/intialOrgId';

const SelectWorkSpaceScreen = ({orgsState, userInfoState}) => {
  const [selectedOrg, setselectedOrg] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedOrg != null) {
      dispatch(setIntialOrgId(selectedOrg, userInfoState?.accessToken));
    }
  }, [selectedOrg]);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{margin: 30}}>
        <Text style={{fontSize: 18}}>Select a Work Space to continue !!!</Text>
      </View>
      {orgsState?.orgs?.map(item => {
        return (
            <TouchableOpacity onPress={() => setselectedOrg(item?.id)}  key={item.id}
            style={{
              margin: 10,
              borderWidth: 1,
              borderColor:'grey',
              width: '60%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: 30,
              // backgroundColor:'grey'
            }}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                {item?.name}
              </Text>
            </TouchableOpacity>
        );
      })}
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state?.orgsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    // getSpaceTokenStartAction : (firebaseToken) => dispatch(getSpaceTokenStart(firebaseToken)),
    // saveUserTokenAction :(token,orgId)=> dispatch(saveUserToken(token,orgId)),
    // getOrgDetailsAction: (token) => dispatch(getOrgDetailsStart(token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectWorkSpaceScreen);
