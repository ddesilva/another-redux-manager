# Another Redux Helper
An attempt to reduce boilerplate for async actions.

Install
```
$ npm i another-redux-helper
```

## Getting Started

makeAsyncActionCreators method

```
export const actions = makeAsyncActionCreators('GET_PRODUCT', 'payload');

console.log(actions.inProgress({payload: 'test'}));
// { type: 'GET_PRODUCT_FETCH_IN_PROGRESS', payload: 'test' }

console.log(actions.inSuccess({payload: 'test'});
// { type: 'GET_PRODUCT_FETCH_SUCESS', payload: 'test' }

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
    // GET CART
    case actions.actionTypes.success:
      return {
        ...state,
        ...{ results: action.payload, fetchStatus: actions.actionTypes.success }
      };
    case actions.actionTypes.inProgress:
      return {
        ...state,
        ...{ results: {}, fetchStatus: actions.actionTypes.inProgress }
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



