import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  toggleSelect,
  toggleStar
} from '../actions'
import MessageBody from './MessageBody'

const Message = ({
  messageId,
  subject,
  read,
  selected,
  starred,
  labels,
  toggleSelect,
  toggleStar,
  history
}) => {
  const readClass = read ? 'read' : 'unread'
  const selectedClass = selected ? 'selected' : ""
  const starClass = starred ? 'fa-star' : 'fa-star-o'

  const renderedLables = labels.map((label, i) => (
    <span key={i} className="label label-warning">{label}</span>
  ))

  return [
    <div key="message" className={`row message ${readClass} ${selectedClass}`}>
      <div className="col-xs-1">
        <div className="row">
          <div className="col-xs-2">
            <input
              type="checkbox"
              checked={ !!selected }
              readOnly={ true }
              onClick={() => toggleSelect(messageId)}
              />
          </div>
          <div className="col-xs-2" onClick={() => toggleStar(messageId)}>
            <i className={`star fa ${starClass}`}></i>
          </div>
        </div>
      </div>
      <div className="col-xs-11">
        {renderedLables}
        <Link to={`/messages/${messageId}`}>{subject}</Link>
      </div>
    </div>,

    <Route
      key="message-body"
      path={ `/messages/${messageId}` }
      render={ props => {
        return <MessageBody messageId={messageId} {...props} />
      }} />
  ]
}

const mapStateToProps = (state, { messageId }) => {
  const byId = state.messages.byId;
  const message = byId[messageId];
  const { subject, read, selected, starred, labels } = message
  return {
    messageId,
    subject,
    read,
    selected,
    starred,
    labels
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleSelect,
  toggleStar
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Message));
