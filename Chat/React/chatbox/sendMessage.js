import * as messageService from "../../../services/messageService";
import toastr from "toastr";

const sendMessage = (message, chatData, currentZone) => {
  const { recipientData, senderData } = chatData.participants;

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
