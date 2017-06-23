import React from 'react'
import Message from './Message'
import { connect } from 'react-redux'

const Messages = ({
  messageIds
}) => {
  const messageComponents = messageIds.map(id => (
    <Message
      key={id}
      messageId={id}
      />
  ))

  return (
    <div>
      {messageComponents}
    </div>
  )
}

const mapStateToProps = state => ({
  messageIds: state.messages.allIds
})

export default connect(
  mapStateToProps
)(Messages);
