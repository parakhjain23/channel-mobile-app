import { takeLatest } from "redux-saga/effects";
import { getChats, sendMessage } from "../actions/chat/ChatActions";
import * as Actions from '../Enums';

function* ChatSaga() {
    yield takeLatest(Actions.FETCH_CHAT_START,getChats)
    yield takeLatest(Actions.SEND_MESSAGE_START,sendMessage)
}

export default ChatSaga;
