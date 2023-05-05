import base64 from 'react-native-base64';
export const sendMessageApi = async (
  message,
  teamId,
  orgId,
  senderId,
  token,
  parentId,
  attachment,
  mentionsArr = [],
) => {
  try {
    const regex = /(https?:\/\/[^\s]+)/g;
    message = message.replace(regex, '<a href="$1">$1</a>');
    const mentionRegex = /@(\w+)/g;
    // Replace mentions with HTML tags
    function mentionHTML(userId, match, username) {
      const base64UserId = base64.encode(userId);
      return `<span class=\"mention\" data-index=\"2\" data-denotation-char=\"@\" data-id=\"${userId}\" data-username=\"${username}\" data-value=\"${username}\"><span contenteditable=\"false\">[${match}](MENTION-${base64UserId})</span></span>`;
    }

    let mentionIndex = 0;
    if (mentionsArr?.length > 0) {
      message = message?.replace(mentionRegex, (match, username) => {
        const mentionHtml = mentionHTML(
          mentionsArr[mentionIndex],
          match,
          username,
        );
        mentionIndex++;
        return mentionHtml;
      });
    }

    var response = await fetch('https://api.intospace.io/chat/message', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attachment: attachment,
        content: message,
        mentions: mentionsArr || [],
        teamId: teamId,
        requestId: '73d31f2e-9039-401c-83cd-909953c264f1',
        orgId: orgId,
        senderId: senderId,
        parentId: parentId,
        createdAt: '2022-05-23T07:02:37.051Z',
        appId: '62b53b61b5b4a2001fb9af37',
        senderType: 'USER',
      }),
    });
    const result = await response.json();
    // console.warn(result, 'result from the api');
  } catch (error) {
    console.warn(error);
  }
};
export const sendGlobalMessageApi = async messageObj => {
  try {
    const mentionRegex = /@(\w+)/g;
    // Replace mentions with HTML tags
    function mentionHTML(userId, match, username) {
      const base64UserId = base64.encode(userId);
      return `<span class=\"mention\" data-index=\"2\" data-denotation-char=\"@\" data-id=\"${userId}\" data-username=\"${username}\" data-value=\"${username}\"><span contenteditable=\"false\">[${match}](MENTION-${base64UserId})</span></span>`;
    }

    let mentionIndex = 0;
    if (messageObj?.mentionsArr?.length > 0) {
      message = messageObj?.content?.replace(
        mentionRegex,
        (match, username) => {
          const mentionHtml = mentionHTML(
            message?.mentionsArr[mentionIndex],
            match,
            username,
          );
          mentionIndex++;
          return mentionHtml;
        },
      );
    }
    var response = await fetch('https://api.intospace.io/chat/message', {
      method: 'POST',
      headers: {
        Authorization: messageObj?.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: messageObj.content,
        mentions: messageObj?.mentionsArr || [],
        teamId: messageObj.teamId,
        requestId: '73d31f2e-9039-401c-83cd-909953c264f1',
        orgId: messageObj.orgId,
        senderId: messageObj.senderId,
        parentId: messageObj.parentId,
        createdAt: messageObj?.date,
        senderType: 'USER',
        appId: '62b53b61b5b4a2001fb9af37',
      }),
    });
    const result = await response.json();
  } catch (error) {
    console.warn(error);
  }
};
