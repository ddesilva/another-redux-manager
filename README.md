# Another Redux Manager
Yes yet another attempt to reduce boilerplate for redux whilst still keeping granular control over actions and reducers.

## Why
- Reduces boilerplate
- No overblown middleware required
- Less opinionated
- plays nice with existing codebase (use as much or as little as your want)
- More control over shape of your store and reducers

Dependencies
- axios

## Install
```js
$ npm i another-redux-manager axios
```

## Example

```js

import { createReduxManager } from 'another-redux-manager';

// create a redux manager instance
export const getContentManager = createReduxManager('GET_CONTENT');

// example redux thunk which dispatches actions
export function getContent() {
  return dispatch => {
    dispatch(getContentManager.inProgress());

    return getContentManager.fetch({url: '/some-endpoint'})
      .then(data => {
        return dispatch(getContentManager.success(data));
      })
      .catch(error => {
        return dispatch(getContentManager.failure(error));
      });
  };
}

// example reducer
const INITIAL_STATE = {
  [getContentManager.name]: {
      status: getContentManager.actionTypes.initial,
      error: null
      results: null
    },
};

function contentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case getContentManager.actionTypes.initial:
        return getContentManager.reducerMethods.initial(state, INITIAL_STATE[getContentManager.name].results);
    case getContentManager.actionTypes.inProgress:
        return getContentManager.reducerMethods.inProgress(state, action);
    case getContentManager.actionTypes.success:
      return getContentManager.reducerMethods.success(state, action);
    case getContentManager.actionTypes.failure:
      return getContentManager.reducerMethods.failure(state, action);
    default:
      return state;
  }
}

```



>NOTE: The default success reducer merges the results object with the data you fetch. If you require a full replace then use the advanced reducer configuration below.-


## Getting Started

```js
const contentReduxManager = createReduxManager({name: 'CONTENT'});
```

returns the following object:
```js
{
  name:'CONTENT',
  actionTypes:{
    initial:'CONTENT_FETCH_INITIAL',
    inProgress:'CONTENT_FETCH_IN_PROGRESS',
    success:'CONTENT_FETCH_SUCCESS',
    failure:'CONTENT_FETCH_FAILED'
  },
  actionTypeKeys:{
    CONTENT_FETCH_INITIAL:'CONTENT_FETCH_INITIAL',
    CONTENT_FETCH_IN_PROGRESS:'CONTENT_FETCH_IN_PROGRESS',
    CONTENT_FETCH_SUCCESS:'CONTENT_FETCH_SUCCESS',
    CONTENT_FETCH_FAILED:'CONTENT_FETCH_FAILED'
  },
  actions: {
    initial: () => {...},
    inProgress: () => {...},
    success: () => {...},
    faulure: () => {...},
  },
  reducerMethods:{
    initial: () => {...},
    inProgress: () => {...},
    success: () => {...},
    faulure: () => {...},
  },
  initial: () => {...},
  inProgress: () => {...},
  success: () => {...},
  faulure: () => {...},
}
```

Access ActionCreators
```js
const { initial, inProgress, success, failure} = contentReduxManager.actions;

or also available as shorthand references:

const { initial, inProgress, success, failure} = contentReduxManager;
```

Access Action types
```js
const { initial, inProgress, success, failure } = contentReduxManager.actionTypes;
const { CONTENT_FETCH_INITIAL, CONTENT_FETCH_IN_PROGRESS, CONTENT_FETCH_SUCCESS, CONTENT_FETCH_FAILED } = contentReduxManager.actionTypeKeys; // plain action types
```

Access Reducer Methods (for use in your switch statement in your reducer)
```js
const { initial, inProgress, success, failure} = contentReduxManager.reducerMethods; // reducer methods
```

You can also define multiple arguments to your actions (if you need to)
```js
const contentReduxManager = createReduxManager({name: 'CONTENT', resultsPropsName: 'results' }, 'payload', 'anotherProp');

console.log(actions.inProgress({payload: 'test', anotherProp: 'test' }));
// { type: 'CONTENT_FETCH_IN_PROGRESS', payload: 'test', anotherProp: 'test' }

```


## Usage

Create a redux helper
```js
const contentReduxManager = createReduxManager({name: 'CONTENT', argNames: ['payload'], resultsPropsName: 'results', reducerMethods: () => {} });
```

Properties:

| prop | desc  |
|---|---|
| name  | unique prefix for actions and reducers (RECOMMENDED: all uppercase and separated by underscore to match async postfixes)  |
| argNames  | array of argument names for actions (OPTIONAL: defaults to \['payload'\])  |
| resultsPropsName  | name of property in the reducer to place fetched data (OPTIONAL: defaults to \['results'\]) |
| reducerMethods  | function that allows customising of shape of reducer (OPTIONAL: see advanced usage) |

Call async http endpoint (axios)
```js
const result = await contentReduxManager.fetch({query: '/some-endpoint'});
```

| prop | desc  |
|---|---|
| type  | 'POST', 'DELETE', 'PUT', 'PATCH' .. defaults to 'GET' |
| logger  | your choice of logging util. Must implement logger.error() method. Defaults to console.error  |
| config  | axios config for post params, headers etc.. |
| name  | used when logging errors. outputs 'Fetch <name> Failed |


## Advanced Usage

by default the shape of each reducer method looks something like:
```js
const makeReducerMethods = (reduxManager, resultsPropName) => {
  return {
    initial: (state, initialData) => {
      return {
        ...state,
        ...{
          [reduxManager.name]: {
            ...{
              [resultsPropName]: initialData,
              status: reduxManager.actionTypes.initial,
              error: null
            }
          }
        }
      };
    },
    success: (state, action) => {
      return {
        ...state,
        ...{
          [reduxManager.name]: {
            ...{
              [resultsPropName]: { ...state[reduxManager.name][resultsPropName], ...action.payload },
              status: reduxManager.actionTypes.success,
              error: null
            }
          }
        }
      };
    },
    inProgress: state => {
      return {
        ...state,
        ...{
          [reduxManager.name]: {
            ...state[reduxManager.name],
            ...{
              status: reduxManager.actionTypes.inProgress,
              error: null
            }
          }
        }
      };
    },
    failure: (state, action) => {
      return {
        ...state,
        ...{
          [reduxManager.name]: {
            ...state[reduxManager.name],
            ...{
              status: reduxManager.actionTypes.failure,
              error: action.payload
            }
          }
        }
      };
    }
  };
};

export { makeReducerMethods };

```


However if you require custom shape for your state you can pass your own in as a property to the createReduxManager method

```js

const makeReducerMethods = (reduxManager, resultsPropName) => {
  return {
    success: (state, action) => {
      return {
        ...state,
        ...{
          [resultsPropName]: action.payload,
          [reduxManager.name]: {
            status: reduxManager.actionTypes.success,
            error: null
          }
        }
      };
    },
    inProgress: (state, action, initial) => {
      return {
        ...state,
        ...{
          [resultsPropName]: initial,
          [reduxManager.name]: {
            status: reduxManager.actionTypes.inProgress,
            error: null
          }
        }
      };
    },
    failure: (state, action, initial) => {
      return {
        ...state,
        ...{
          [resultsPropName]: initial,
          [reduxManager.name]: {
            status: reduxManager.actionTypes.failure,
            error: action.payload
          }
        }
      };
    }
  };
};


export const getContentReduxManager = createReduxManager({
  name: 'GET_CONTENT',
  reducerMethods: makeReducerMethods
});

```



You can also create a single action creator
```js
import { makeActionCreator } from 'another-redux-manager';

const inProgress = makeActionCreator('GET_CONTENT_IN_PROGRESS', 'payload');
```
