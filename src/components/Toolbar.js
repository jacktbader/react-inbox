import React from 'react'
import {
  markAsRead,
  markAsUnread,
  deleteMessages,
  toggleSelectAll,
  applyLabel,
  removeLabel,
  toggleCompose
} from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Route, Switch, withRouter } from 'react-router-dom'

const Toolbar = ({
  messagesLength,
  unreadCount,
  selectedCount,
  toggleSelectAll,
  toggleCompose,
  markAsRead,
  markAsUnread,
  applyLabel,
  removeLabel,
  deleteMessages,
}) => {
  let selectAllClass

  switch(selectedCount) {
    case 0:
      selectAllClass = 'fa-square-o'
      break;
    case messagesLength:
      selectAllClass = 'fa-check-square-o'
      break;
    default:
      selectAllClass = 'fa-minus-square-o'
  }

  return (
    <div className="row toolbar">
      <div className="col-xs-12">
        <p className="pull-right">
          <span className="badge badge">
            {unreadCount}
          </span>
          unread {unreadCount === 1 ? 'message' : 'messages'}
        </p>

        <Switch>
         <Route path="/compose" render={ () => (
           <Link className="btn btn-danger" to="/">
             <i className={`fa fa-plus`}></i>
           </Link>
         )} />
         <Route render={ () => (
           <Link className="btn btn-danger" to="/compose">
             <i className={`fa fa-plus`}></i>
           </Link>
         )} />
       </Switch>

        <button className="btn btn-default" onClick={() => toggleSelectAll()}>
          <i className={`fa ${selectAllClass}`}></i>
        </button>

        <button className="btn btn-default" onClick={() => markAsRead()} disabled={selectedCount === 0}>
          Mark As Read
        </button>

        <button className="btn btn-default" onClick={() => markAsUnread()} disabled={selectedCount === 0}>
          Mark As Unread
        </button>

        <select
          className="form-control label-select"
          disabled={selectedCount === 0}
          onChange={(e) => {applyLabel(e.target.value); e.target.selectedIndex = 0}}
          >
          <option>Apply label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <select
          className="form-control label-select"
          disabled={selectedCount === 0}
          onChange={(e) => {removeLabel(e.target.value); e.target.selectedIndex = 0}}
          >
          <option>Remove label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <button className="btn btn-default" onClick={() => deleteMessages()} disabled={selectedCount === 0}>
          <i className="fa fa-trash-o"></i>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state, { messageId }) => {
  const { byId, allIds } = state.messages;
  const unreadCount = allIds.filter(messageId => !byId[messageId].read).length
  const selectedCount =  allIds.filter(messageId => byId[messageId].selected).length
  const messagesLength = allIds.length
  return {
    messagesLength,
    unreadCount,
    selectedCount
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  markAsRead,
  markAsUnread,
  deleteMessages,
  toggleSelectAll,
  applyLabel,
  removeLabel,
  toggleCompose
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar));
