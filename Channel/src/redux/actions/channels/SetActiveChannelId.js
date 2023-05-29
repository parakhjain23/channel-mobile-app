import * as Actions from '../../Enums';

export function setActiveChannelTeamId(teamId) {
  return {
    type: Actions.SET_ACTIVE_CHANNEL_TEAMID,
    teamId,
  };
}

export function resetActiveChannelTeamId() {
  return {
    type: Actions.RESET_ACTIVE_CHANNEL_TEAMID,
  };
}
