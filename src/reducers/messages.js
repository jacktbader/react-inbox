//TODO: each message should probably be its own reducer
// and messages should be composed of these reducers
//use of Normalizr library would be good here. 
import {
  MESSAGES_REQUEST_STARTED,
  MESSAGES_REQUEST_SUCCESS,
  MESSAGE_SELECTED,
  MESSAGE_STARRED,
  MESSAGES_MARKED_AS_READ,
  MESSAGES_MARKED_AS_UNREAD,
  MESSAGES_DELETED,
  MESSAGES_TOGGLE_SELECT_ALL,
  MESSAGES_TOGGLE_COMPOSING,
  MESSAGES_APPLY_LABEL,
  MESSAGES_REMOVE_LABEL,
  MESSAGE_SEND_STARTED,
  MESSAGE_SEND_COMPLETE,
  MESSAGE_BODY_REQUEST_SUCCESS
} from '../actions'

const initialState = {
  allIds: [],
  byId: {},
  fetchingMessages: true,
  creatingMessage: false,
  composing: false,
}

export default (state = initialState, action) => {

  switch (action.type) {
    case MESSAGES_REQUEST_STARTED:
      return {
        ...state,
        fetchingMessages: true,
      }
    case MESSAGES_REQUEST_SUCCESS:
      return {
        ...state,
        allIds: action.messages.map(message => message.id),
        byId: index(action.messages)
      }
    case MESSAGE_SELECTED:
      return {
        ...state,
        byId: toggleProperty(state.byId, action.messageId, 'selected')
      }
    case MESSAGE_STARRED:
      return {
        ...state,
        byId: toggleProperty(state.byId, action.messageId, 'starred')
      }
    case MESSAGES_MARKED_AS_READ:
      return {
        ...state,
        byId: setPropertyValueOnCollection(state.byId, action.messageIds, 'read', true)
      }
    case MESSAGES_MARKED_AS_UNREAD:
      return {
        ...state,
        byId: setPropertyValueOnCollection(state.byId, action.messageIds, 'read', false)
      }
    case MESSAGES_DELETED:
      return {
        ...state,
        allIds: state.allIds.filter(messageId => {
          return action.messageIds.indexOf(messageId) === -1
        }),
      }
    case MESSAGES_TOGGLE_SELECT_ALL:
      const selectedMessageIds = state.allIds.filter((messageId) => {
        return state.byId[messageId].selected
      })
      const selected = selectedMessageIds.length !== state.allIds.length
      const targetIds = state.allIds.filter((messageId) => {
        return state.byId[messageId].selected !== selected
      })

      return {
        ...state,
        byId: setPropertyValueOnCollection(state.byId, targetIds, 'selected', selected)
      }
    case MESSAGES_TOGGLE_COMPOSING:
      return {
        ...state,
        composing: !state.composing,
      }
    case MESSAGES_APPLY_LABEL:
      const newById = action.messageIds.reduce((byId, messageId) => {
        const message = byId[messageId];
        const newLabels =  !message.labels.includes(action.label) ? [...message.labels, action.label].sort() : message.labels
        const newById = setPropertyValue(byId, messageId, 'labels', newLabels)
        return newById
      }, state.byId);

      return {
        ...state,
        byId: newById
      }
    case MESSAGES_REMOVE_LABEL:
      const byId = action.messageIds.reduce((byId, messageId) => {
        const message = byId[messageId];
        const index = message.labels.indexOf(action.label)
        let newLabels;
        if ( index > -1) {
          newLabels = [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        } else {
          newLabels = message.labels;
        }

        const newById = setPropertyValue(byId, messageId, 'labels', newLabels)
        return newById
      }, state.byId);

      return {
        ...state,
        byId
      }
    case MESSAGE_BODY_REQUEST_SUCCESS:
      return {
        ...state,
        byId: setPropertyValue(state.byId, action.messageId, 'body', action.body)
      }
    case MESSAGE_SEND_STARTED:
      return {
        ...state,
        creatingMessage: true,
      }
    case MESSAGE_SEND_COMPLETE:
      return {
        ...state,
        allIds: [...state.allIds, action.message.id],
        byId: {
          ...state.byId,
          [action.message.id]: action.message
        },
        composing: false,
        creatingMessage: false,
      }
    default:
      return state
  }

}

function toggleProperty(messages, messageId, property) {
  return {
    ...messages,
    [messageId] : {
      ...messages[messageId],
      [property]: !messages[messageId][property]
    }
  }
}

function setPropertyValueOnCollection(byId, messageIds, property, value) {
  const newById = messageIds.reduce((byId, messageId) => {
    const newById = setPropertyValue(byId, messageId, property, value)
    return newById
  }, byId)

  return newById;
}

function setPropertyValue(byId, messageId, property, value) {
  return {
    ...byId,
    [messageId] : {
      ...byId[messageId],
      [property]: value
    }
  }
}


function index(collection) {
  return collection.reduce((result, record) => {
    result[record.id] = record
    return result
  }, {})
}
