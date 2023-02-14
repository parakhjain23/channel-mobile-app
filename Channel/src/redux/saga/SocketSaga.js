import { takeLatest } from "redux-saga/effects";
import { notifications } from "../../api/notifications/NotificationApi";
import { createSocketMiddleware } from "../actions/socket/socketActions";
import { SUBSCRIBE_TO_NOTIFICATIONS } from "../Enums";

import * as SocketActions from '../SocketEnums';

function* SocketSaga() {
    yield takeLatest(SocketActions.INITIALIZE_SOCKET,createSocketMiddleware);
    yield takeLatest(SUBSCRIBE_TO_NOTIFICATIONS,notifications);
}

export default SocketSaga;
