import React, {useEffect, useState} from 'react';

const ExploreChannels = ({route}) => {
    const {props} = route?.params;
    console.log(props);
  const [channels, setChannels] = useState([]);
  console.log(props?.userInfoState?.accessToken,props?.orgsState?.currenOrgId);
  async function fetchAllChannels() {
    const response = await fetch(`https://api.intospace.io/chat//team?$paginate=false&orgId=${props?.orgsState?.currenOrgId}&isArchived=false&includeUsers=false&$limit=50`,{
        method:'GET',
        headers:{
            "Authorization": props?.userInfoState?.accessToken
        }
    })
    const result = await response.json()
    // console.log(result);
  }
  useEffect(() => {
    fetchAllChannels();
  }, []);

  return <></>;
};
export default ExploreChannels;
