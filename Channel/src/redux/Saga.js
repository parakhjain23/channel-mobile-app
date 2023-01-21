import { all, fork } from "redux-saga/effects";
import ChatSaga from "./actions/chat/ChatSaga";
import OrgSaga from "./actions/org/OrgSaga";
import UserSaga from "./actions/user/UserSaga";

export default function* rootSaga() {
  yield all([fork(OrgSaga),fork(ChatSaga),fork(UserSaga)]);
}