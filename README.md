# Another Redux Manager
Yes yet another attempt to reduce boilerplate for redux whilst still keeping granular control over actions and reducers.

## Why
- Reducers boilerplate
- No overblown middleware required
- Less opinionated to plays nice with existing codebase
- More control over shape of your store and reducers


Install
```
$ npm i another-redux-manager
```

## Getting Started

makeAsyncActionCreators method

```
export const actions = makeAsyncActionCreators('GET_PRODUCT', 'payload');

console.log(actions.inProgress());
// { type: 'GET_PRODUCT_FETCH_IN_PROGRESS'}

console.log(actions.inSuccess({payload: 'test'});
// { type: 'GET_PRODUCT_FETCH_SUCCESS', payload: 'test' }

etc...

console.log(actions.actionTypes)
// { GET_PRODUCT_FETCH_INITIAL, GET_PRODUCT_FETCH_SUCCESS, GET_PRODUCT_FETCH_IN_PROGRESS, GET_PRODUCT_FETCH_FAILED }

```

You can also define multiple properties (if you need to)
```
export const actions = makeAsyncActionCreators('GET_PRODUCT', 'payload', 'anotherProp');

console.log(actions.inProgress({payload: 'test', anotherProp: 'test' }));
// { type: 'GET_PRODUCT_FETCH_IN_PROGRESS', payload: 'test', anotherProp: 'test' }

```


## Example

```

import { makeAsyncActionCreators } from 'another-redux-helper';

// create a action helper
export const actions = makeAsyncActionCreators('GET_PRODUCT', 'payload');

// example redux thunk which dispatches actions.
export function getProduct() {
  return dispatch => {
    dispatch(actions.inProgress());

    return fetchProduct()
      .then(data => {
        return dispatch(actions.success(data));
      })
      .catch(error => {
        return dispatch(actions.failure(error));
      });
  };
}

// example reducer
const INITIAL_STATE = {
  fetchStatus: actions.actionTypes.initial,
  fetchError: {},
  results: {}
};

function productReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.actionTypes.initial:
        return {
          ...state,
          ...{
            results: {},
            fetchError: {},
            fetchStatus: actions.actionTypes.initial
          }
        };
    case actions.actionTypes.inProgress:
        return {
          ...state,
          ...{
            results: {},
            fetchError: {},
            fetchStatus: actions.actionTypes.inProgress
          }
        };
    case actions.actionTypes.success:
      return {
        ...state,
        ...{
          results: action.payload,
          fetchError: {},
          fetchStatus: actions.actionTypes.success
        }
      };
    case actions.actionTypes.failure:
      return {
        ...state,
        ...{
          results: {},
          fetchError: action.payload,
          fetchStatus: actions.actionTypes.failure
        }
      };
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

