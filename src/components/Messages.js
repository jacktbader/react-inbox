import React from 'react'
import Message from './Message'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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

export default withRouter(connect(
  mapStateToProps
)(Messages));
