import { takeLatest } from "redux-saga/effects";
import { getChats, sendMessage } from "../actions/chat/ChatActions";
import { deleteMessage } from "../actions/chat/DeleteChatAction";
import * as Actions from '../Enums';

function* ChatSaga() {
    yield takeLatest(Actions.FETCH_CHAT_START,getChats)
    yield takeLatest(Actions.SEND_MESSAGE_START,sendMessage)
    yield takeLatest(Actions.DELETE_MESSAGE_START,deleteMessage)
}

export default ChatSaga;
