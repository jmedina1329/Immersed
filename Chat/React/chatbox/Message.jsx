import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import Styles from "../chat.module.css";

function Message({ messageData, lastRef, activeChatSender }) {
  const dateTimeSent = new Date(messageData.dateSent);

  const dateSent = dateTimeSent.toDateString().slice(4);
  const timeSent = dateTimeSent.toTimeString().slice(0, 5);
  return (
    <div className="container-fluid overflow-hidden">
      {activeChatSender.id === messageData.senderData.id ? (
        // Sender-side message mapping
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex">
            <div className="me-3 text-end">
              <small className={Styles.date_time}>
                {" "}
                {dateSent} {timeSent}{" "}
              </small>
              <div className="d-flex justify-content-end">
                <div className="me-2 mt-2">
                  <ActionMenu position="start" />
                </div>
                <div className={Styles.send_textbox}>
                  <div className="text-start">
                    <p className="mb-0">{messageData.messageBody}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={Styles.avatar}
              style={{
                backgroundImage: `url(${messageData.senderData.avatarUrl})`,
              }}
            ></div>
          </div>
        </div>
      ) : (
        // Recipient-side message mapping
        <div className="d-flex w-lg-40 mb-4">
          <div
            className={Styles.avatar}
            style={{
              backgroundImage: `url(${messageData.senderData.avatarUrl})`,
            }}
          ></div>
          <div className="ms-3">
            {messageData.recipientData.entityTypeId === 9 ? (
              <div>{messageData.senderData.name}</div>
            ) : null}
            <div className="d-flex">
              <div className={Styles.receive_textbox}>
                <div className="">
                  <p className="mb-0">{messageData.messageBody}</p>
                </div>
              </div>
              <div className="ms-2 mt-2"></div>
            </div>
            <small className={Styles.date_time}>
              {dateSent} {timeSent}{" "}
            </small>
          </div>
        </div>
      )}
      <div ref={lastRef}></div>
    </div>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Link
    to=""
    ref={ref}
    className="text-link"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Link>
));

const ActionMenu = ({ position }) => {
  return (
    <Dropdown drop={position}>
      <Dropdown.Toggle as={CustomToggle}>
        <i className="fe fe-more-vertical"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu align="start">
        {position === "start" ? (
          <Dropdown.Item eventKey="2" className="px-3">
            <i className="fe fe-edit dropdown-item-icon"></i> Edit
          </Dropdown.Item>
        ) : null}
        <Dropdown.Item eventKey="6" className="px-3">
          <i className="fe fe-trash dropdown-item-icon"></i> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

CustomToggle.propTypes = {
  children: PropTypes.shape({}),
  onClick: PropTypes.func.isRequired,
};

ActionMenu.propTypes = {
  position: PropTypes.string,
};
Message.propTypes = {
  activeChatSender: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  messageData: PropTypes.shape({
    messageBody: PropTypes.string.isRequired,
    recipientData: PropTypes.shape({
      entityTypeId: PropTypes.number.isRequired,
    }),
    senderData: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }),
    dateSent: PropTypes.string.isRequired,
  }),
  lastRef: PropTypes.shape({}),
};
export default Message;
