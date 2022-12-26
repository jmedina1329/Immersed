import * as messageService from "../../../services/messageService";
import toastr from "toastr";

import debug from "sabio-debug";
const _logger = debug.extend("ChatInput");

const sendMessage = (message, chatData, currentZone) => {
  const { recipientData, senderData } = chatData.participants;

  // _logger(
  //   "data for thing in that thing",
  //   `recipData ${JSON.stringify(recipientData)} : senderData ${JSON.stringify(
  //     senderData
  //   )} :: chatData ${JSON.stringify(chatData)}`
  // );

  const payload = {
    message: message,
    subject: chatData.chatName,
    recipientEntityTypeId: recipientData.entityTypeId,
    recipientId: recipientData.id,
    senderEntityTypeId: senderData.entityTypeId,
    senderId: senderData.id,
    zoneId: currentZone,
    dateSent: new Date(),
  };

  // _logger(`payload before sending out ${payload}`);

  messageService.addMessage(payload).then(onAddSuccess).catch(onAddError);
};
const onAddSuccess = (response) => {
  _logger("Message post success", response);
};
const onAddError = (error) => {
  _logger("Send failed", error);
  toastr.error("Message send failed");
};

export default sendMessage;
