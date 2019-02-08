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
| name  | unique prefix for actions and reducers  |
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
  [getCartReduxManager.name]: {
      status: getCartReduxManager.actionTypes.initial,
      error: {}
      results: {}
    },
};

function contentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.actionTypes.initial:
        return getCartReduxManager.reducerMethods.initial(state, action, INITIAL_STATE[getCartReduxManager.name].results);
    case actions.actionTypes.inProgress:
        return getCartReduxManager.reducerMethods.inProgress(state, action, INITIAL_STATE[getCartReduxManager.name].results);
    case actions.actionTypes.success:
      return getCartReduxManager.reducerMethods.success(state, action, INITIAL_STATE[getCartReduxManager.name].results);
    case actions.actionTypes.failure:
      return getCartReduxManager.reducerMethods.failure(state, action, INITIAL_STATE[getCartReduxManager.name].results);
    default:
      return state;
  }
}

```


You can also create a single action creator
```
import { makeActionCreator } from 'another-redux-helper';

const inProgress = makeActionCreator('GET_PRODUCT_IN_PROGRESS', 'payload');
```

