import { takeLatest } from "redux-saga/effects";
import { createSocketMiddleware } from "../actions/socket/socketActions";

import * as SocketActions from '../SocketEnums';

function* SocketSaga() {
    console.log("=-=-=-=-=-=sgaa");
    yield takeLatest(SocketActions.INITIALIZE_SOCKET,createSocketMiddleware);
}

export default SocketSaga;
