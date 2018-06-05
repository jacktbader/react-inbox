import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchMessageBody,
} from '../actions'


export class MessageBody extends React.Component {
  componentWillMount() {
    this.props.fetchMessageBody(this.props.messageId)
  }

  componentWillUpdate() {
    this.props.fetchMessageBody(this.props.messageId)
  }

  render() {
    return (
      <div className="row message-body">
        <div className="col-xs-11 col-xs-offset-1">
          { this.props.body }
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, { messageId }) => {
  const byId = state.messages.byId;
  const message = byId[messageId];
  const { body } = message
  return {
    messageId,
    body
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchMessageBody
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageBody);
