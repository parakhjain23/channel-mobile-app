const initialState = {
  socket : null
};

export function socketReducer(state = initialState, action) {
  switch (action.type) {
    case 'SOCKET_CREATED' :
      return {...state,socket : action.socket}
    default:
      return state;
  }
}
