import React from 'react'
import { TouchableOpacity } from 'react-native';

export function RenderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.attribs?.class == 'mention') {
    // const specialSyle = node.attribs.style
    return (
      <TouchableOpacity
        onPress={async () => {
          node?.attribs?.['data-id'] != '@all' &&
            (await searchUserProfileAction(
              node?.attribs?.['data-id'],
              userInfoState?.accessToken,
            )) &&
            RootNavigation.navigate('UserProfiles', {
              displayName:
                orgState?.userIdAndDisplayNameMapping[
                  node?.attribs?.['data-id']
                ],
            });
        }}>
        <Text style={{color: 'white', textDecorationLine: 'underline'}}>
          @{node?.attribs?.['data-value']}
        </Text>
      </TouchableOpacity>
    );
  } else if (node?.attribs?.class == 'ql-syntax') {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'black',
          padding: 10,
          borderRadius: 5,
        }}>
        <Text>{node?.children[0]?.data}</Text>
      </View>
    );
  }
}
