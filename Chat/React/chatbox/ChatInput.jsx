import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Styles from "../chat.module.css";

import sendMessage from "./sendMessage";

// import * as messageService from "../../../services/messageService";

// import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";

function ChatInput({ chatData, currentZone }) {
  // const senderData = props.chatData?.participants?.senderData;
  // const recipientData = props.chatData?.participants?.recipientData;
  // const chatName = props.chatData?.chatName;

  const [message, setMessage] = useState("");

  const onFormChange = (e) => {
    const value = e.currentTarget.value;
    setMessage(() => {
      const newMessage = value;
      return newMessage;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(message, chatData, currentZone);
    setMessage("");
  };
  // const onAddSuccess = (response) => {
  //   _logger("Message post success", response);
  // };
  // const onAddError = (error) => {
  //   _logger("Send failed", error);
  //   toastr.error("Message send failed");
  // };

  // const getPostMessagePayload = (messageBody) => {
  //   return {
  //     message: messageBody,
  //     subject: chatName,
  //     recipientEntityTypeId: recipientData.entityTypeId,
  //     recipientId: recipientData.id,
  //     senderEntityTypeId: senderData.entityTypeId,
  //     senderId: senderData.id,
  //     zoneId: props.currentZone,
  //     dateSent: new Date(),
  //   };
  // };

  return (
    <div className={Styles.chat_input}>
      <div className="p-2 rounded-3 shadow-sm">
        <Form.Control
          as="textarea"
          placeholder="Send a message"
          id="Excerpt"
          value={message}
          onChange={onFormChange}
          className="form-control border-0 form-control-simple no-resize"
          style={{
            height: "50px",
          }}
        />
        <div className="position-absolute end-0 mt-n7 me-4">
          <Button
            variant="none"
            bsPrefix="btn"
            type="submit"
            className="fs-3 text-primary btn-focus-none pt-2"
            onClick={handleSendMessage}
          >
            <i className="fe fe-send"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

ChatInput.propTypes = {
  chatData: PropTypes.shape({
    participants: PropTypes.shape({
      senderData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        entityTypeId: PropTypes.number.isRequired,
      }),
      recipientData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        entityTypeId: PropTypes.number.isRequired,
      }),
    }),
    chatName: PropTypes.string.isRequired,
  }),
  currentZone: PropTypes.number.isRequired,
};

export default ChatInput;
