import * as Actions from '../../Enums';
export function channelPatchedEvent(response) {
  return {
    type: Actions.CHANNEL_PATCHED_EVENT,
    response,
  };
}
