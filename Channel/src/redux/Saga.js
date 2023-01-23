import { all, fork } from "redux-saga/effects";
import ChatSaga from "./saga/ChatSaga";
import OrgSaga from "./saga/OrgSaga";
import UserSaga from "./saga/UserSaga";

export default function* rootSaga() {
  yield all([fork(OrgSaga),fork(ChatSaga),fork(UserSaga)]);
}