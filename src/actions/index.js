//TODO: should handle api failure cases as well

export const MESSAGES_REQUEST_STARTED = 'MESSAGES_REQUEST_STARTED'
export const MESSAGES_REQUEST_SUCCESS = 'MESSAGES_REQUEST_SUCCESS'
export const getMessages = () => {
  return async (dispatch) => {
    dispatch({ type: MESSAGES_REQUEST_STARTED })
    const response = await request(`/api/messages`)
    const json = await response.json()
    dispatch({
      type: MESSAGES_REQUEST_SUCCESS,
      messages: json._embedded.messages,
    })
  }
}

export const MESSAGE_SELECTED = 'MESSAGE_SELECTED'
export const toggleSelect = (messageId) => {
  return {
    type: MESSAGE_SELECTED,
    messageId,
  }
}

export const MESSAGE_STARRED = 'MESSAGE_STARRED'
export const toggleStar = (messageId) => {
  return async (dispatch, getState) => {
    const message = getState().messages.byId[messageId]
    await updateMessages({
      "messageIds": [ message.id ],
      "command": "star",
      "star": message.starred
    })

    dispatch({
      type: MESSAGE_STARRED,
      messageId,
    })
  }
}

export const MESSAGES_MARKED_AS_READ = 'MESSAGES_MARKED_AS_READ'
export const markAsRead = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const messageIds = state.messages.allIds.filter((messageId) => {
      return state.messages.byId[messageId].selected
    })
    await updateMessages({
      "messageIds": messageIds,
      "command": "read",
      "read": true
    })

    dispatch({ type: MESSAGES_MARKED_AS_READ, messageIds })
  }
}

export const MESSAGES_MARKED_AS_UNREAD = 'MESSAGES_MARKED_AS_UNREAD'
export const markAsUnread = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const messageIds = state.messages.allIds.filter((messageId) => {
      return state.messages.byId[messageId].selected
    })

    await updateMessages({
      "messageIds": messageIds,
      "command": "read",
      "read": false
    })

    dispatch({ type: MESSAGES_MARKED_AS_UNREAD, messageIds })
  }
}

export const MESSAGES_DELETED = 'MESSAGES_DELETED'
export const deleteMessages = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const messageIds = state.messages.allIds.filter((messageId) => {
      return state.messages.byId[messageId].selected
    })

    await updateMessages({
      "messageIds": messageIds,
      "command": "delete"
    })

    dispatch({ type: MESSAGES_DELETED, messageIds })
  }
}

export const MESSAGES_TOGGLE_SELECT_ALL = 'MESSAGES_TOGGLE_SELECT_ALL'
export const toggleSelectAll = () => {
  return { type: MESSAGES_TOGGLE_SELECT_ALL }
}

export const MESSAGES_TOGGLE_COMPOSING = 'MESSAGES_TOGGLE_COMPOSING'
export const toggleCompose = () => {
  return  { type: MESSAGES_TOGGLE_COMPOSING }
}

export const MESSAGES_APPLY_LABEL = 'MESSAGES_APPLY_LABEL'
export const applyLabel = (label) => {
  return async (dispatch, getState) => {
    const state = getState();
    const messageIds = state.messages.allIds.filter((messageId) => {
      return state.messages.byId[messageId].selected
    })

    await updateMessages({
      "messageIds": messageIds,
      "command": "addLabel",
      "label": label
    })

    dispatch({ type: MESSAGES_APPLY_LABEL, label, messageIds })
  }
}

export const MESSAGES_REMOVE_LABEL = 'MESSAGES_REMOVE_LABEL'
export const removeLabel = (label) => {
  return async (dispatch, getState) => {
    const state = getState();
    const messageIds = state.messages.allIds.filter((messageId) => {
      return state.messages.byId[messageId].selected
    })

    await updateMessages({
      "messageIds": messageIds,
      "command": "removeLabel",
      "label": label
    })

    dispatch({type: MESSAGES_REMOVE_LABEL, label, messageIds})
  }
}

export const MESSAGE_SEND_STARTED = 'MESSAGE_SEND_STARTED'
export const MESSAGE_SEND_COMPLETE = 'MESSAGE_SEND_COMPLETE'
export const sendMessage = (message) => {
  return async (dispatch) => {
    dispatch({ type: MESSAGE_SEND_STARTED })

    const response = await request('/api/messages', 'POST', {
      subject: message.subject,
      body: message.body,
    })
    const newMessage = await response.json()

    dispatch({
      type: MESSAGE_SEND_COMPLETE,
      message: newMessage,
    })
  }
}

// -------------------

async function request(path, method = 'GET', body = null) {
  if (body) body = JSON.stringify(body)
  return await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body
  })
}

async function updateMessages(payload) {
  await request('/api/messages', 'PATCH', payload)
}
