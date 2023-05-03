import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setIntialOrgId} from '../../redux/actions/org/intialOrgId';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import signOut from '../../redux/actions/user/userAction';
import {useNavigation} from '@react-navigation/native';

const SelectWorkSpaceScreen = ({
  userInfoState,
  signOutAction,
  orgsState,
  route,
}) => {
  const [selectedOrg, setselectedOrg] = useState(null);
  const {email} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const _signOut = async () => {
    if (userInfoState?.siginInMethod == 'Google') {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
    signOutAction();
    navigation.navigate('Login');
  };
  useEffect(() => {
    if (selectedOrg != null) {
      dispatch(setIntialOrgId(selectedOrg, userInfoState?.accessToken));
    }
  }, [selectedOrg]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#171717',
      }}>
      <View style={{marginTop: 50,margin:20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
          Select a Work Space to continue
        </Text>
      </View>
      {orgsState?.noOrgsFound ? (
        <View>
          <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
            You are not part of any work space please contact your company's HR
            department to add you in a respective work space
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                width: '70%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              onPress={_signOut}>
              <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
                Sign in with a different account
              </Text>
            </TouchableOpacity>
            <Text style={{color: 'white', marginTop: 10, fontSize: 16}}>
              {email}
            </Text>
          </View>
        </View>
      ) : orgsState?.orgs?.length > 0 ? (
        orgsState?.orgs != null && (
          <ScrollView style={{flex:1}}>
            {orgsState?.orgs?.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => setselectedOrg(item?.id)}
                  key={item.id}
                  style={{
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    width: '95%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderRadius:10
                  }}
                  activeOpacity={.6}
                  >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'white',
                      margin:15,
                    }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )
      ) : (
        <ActivityIndicator size={'small'} />
      )}
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state?.orgsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    signOutAction: () => dispatch(signOut()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectWorkSpaceScreen);
