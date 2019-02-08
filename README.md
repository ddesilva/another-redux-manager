# Another Redux Manager
Yes yet another attempt to reduce boilerplate for redux whilst still keeping granular control over actions and reducers.

## Why
- Reducers boilerplate
- No overblown middleware required
- Less opinionated
- plays nice with existing codebase (use as much or as little as your want)
- More control over shape of your store and reducers


Install
```
$ npm i another-redux-manager
```

## Getting Started

```
const contentReduxManager = createReduxManager({name: 'CONTENT'});
```

returns the following object:
```
{
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
  name:'CONTENT',
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
```
const { initial, inProgress, success, failure} = contentReduxManager;
```

Access Action types
```
const { initial, inProgress, success, failure } = contentReduxManager.actionTypes;
const { CONTENT_FETCH_INITIAL, CONTENT_FETCH_IN_PROGRESS, CONTENT_FETCH_SUCCESS, CONTENT_FETCH_FAILED } = contentReduxManager.actionTypeKeys; // plain action types
```

Access Reducer Methods (for use in your switch statement in your reducer)
```
const { initial, inProgress, success, failure} = contentReduxManager.reducerMethods; // reducer methods
```

You can also define multiple arguments to your actions (if you need to)
```
const contentReduxManager = createReduxManager({name: 'CONTENT', resultsPropsName: 'results' }, 'payload', 'anotherProp');

console.log(actions.inProgress({payload: 'test', anotherProp: 'test' }));
// { type: 'CONTENT_FETCH_IN_PROGRESS', payload: 'test', anotherProp: 'test' }

```


## Usage

```
const contentReduxManager = createReduxManager({name: 'CONTENT', argNames: ['payload'], resultsPropsName: 'results', reducerMethods: () => {} });
```

Properties:

| prop | desc  |
|---|---|
| name  | unique prefix for actions and reducers (RECOMMENDED: all uppercase and separated by underscore to match async postfixes)  |
| argNames  | array of argument names for actions (OPTIONAL: defaults to \['payload'\])  |
| resultsPropsName  | name of property in the reducer to place fetched data (OPTIONAL: defaults to \['results'\]) |
| reducerMethods  | function that allows customising of shape of reducer (OPTIONAL: see advanced usage) |



## Example

```

import { createReduxManager } from 'another-redux-manager';

// create a redux manager instance
export const getContentManager = createReduxManager('GET_CONTENT');

// example redux thunk which dispatches actions
export function getContent() {
  return dispatch => {
    dispatch(getContentManager.inProgress());

    return fetchContent()
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
      error: {}
      results: {}
    },
};

function contentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.actionTypes.initial:
        return getContentManager.reducerMethods.initial(state, action, INITIAL_STATE[getContentManager.name].results);
    case actions.actionTypes.inProgress:
        return getContentManager.reducerMethods.inProgress(state, action, INITIAL_STATE[getContentManager.name].results);
    case actions.actionTypes.success:
      return getContentManager.reducerMethods.success(state, action, INITIAL_STATE[getContentManager.name].results);
    case actions.actionTypes.failure:
      return getContentManager.reducerMethods.failure(state, action, INITIAL_STATE[getContentManager.name].results);
    default:
      return state;
  }
}

```


You can also create a single action creator
```
import { makeActionCreator } from 'another-redux-manager';

const inProgress = makeActionCreator('GET_CONTENT_IN_PROGRESS', 'payload');
```


## Advanced Usage

by default the shape of each reducer method is:
```
const makeReducerMethods = (acc, resultsPropName) => {
  return {
    initial: (state, action, initialData) => {
      return {
        ...state,
        ...{
          [acc.name]: {
            ...{
              [resultsPropName]: initialData,
              status: acc.actionTypes.initial,
              error: {}
            }
          }
        }
      };
    },
    success: (state, action) => {
      return {
        ...state,
        ...{
          [acc.name]: {
            ...{
              [resultsPropName]: action.payload,
              status: acc.actionTypes.success,
              error: {}
            }
          }
        }
      };
    },
    inProgress: (state, action, initialData) => {
      return {
        ...state,
        ...{
          [acc.name]: {
            ...{
              [resultsPropName]: initialData,
              status: acc.actionTypes.inProgress,
              error: {}
            }
          }
        }
      };
    },
    failure: (state, action, initialData) => {
      return {
        ...state,
        ...{
          [acc.name]: {
            ...{
              [resultsPropName]: initialData,
              status: acc.actionTypes.failure,
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

```

const makeReducerMethods = (reduxManager, resultsPropName) => {
  return {
    success: (state, action) => {
      return {
        ...state,
        ...{
          [resultsPropName]: action.payload,
          [reduxManager.name]: {
            status: reduxManager.actionTypes.success,
            error: {}
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
            error: {}
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