const OPTIONS_LIST = [
  { actionName: 'initial', actionTypePostFix: 'FETCH_INITIAL' },
  { actionName: 'inProgress', actionTypePostFix: 'FETCH_IN_PROGRESS' },
  { actionName: 'success', actionTypePostFix: 'FETCH_SUCCESS' },
  { actionName: 'failure', actionTypePostFix: 'FETCH_FAILED' }
];

/*
  Exports dynamically generated actions and action creators for use in async data fetching. This cuts down the boilerplate code required.

  Usage:
  const contentActionHelper = makeAsyncActionCreators('CONTENT', 'payload');

  Exports the following:
  const { initial, success, failure, inProgress } = contentActionHelper; // actionCreators
  const { CONTENT_FETCH_INITIAL, CONTENT_FETCH_SUCCESS, CONTENT_FETCH_IN_PROGRESS, CONTENT_FETCH_FAILED } = contentActionHelper.actionTypeKeys; // plain action types
*/

const createReduxManager = (name, ...argNames) =>
  OPTIONS_LIST.reduce(
    (acc, option) => {
      acc.actionTypeKeys[`${name}_${option.actionTypePostFix}`] = `${name}_${
        option.actionTypePostFix
      }`;

      acc.actionTypes[option.actionName] = name + '_' + option.actionTypePostFix;

      acc[option.actionName] = (...args) =>
        argNames.reduce(
          (acc2, argName, index) => {
            if (args[index]) {
              acc2[argNames[index]] = args[index];
            }
            return acc2;
          },
          { type: `${name}_${option.actionTypePostFix}` }
        );

      acc.name = name;

      acc.reducerMethods = {
        initial: (state, action, initialData) => {
          return {
            ...state,
            ...{
              [acc.name]: {
                ...{
                  data: initialData,
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
                  data: action.payload,
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
                  data: initialData,
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
                  data: initialData,
                  status: acc.actionTypes.failure,
                  error: action.payload
                }
              }
            }
          };
        }
      };

      return acc;
    },
    {
      actionTypes: {},
      actionTypeKeys: {},
      name: ''
    }
  );

/*
  Essentially returns and action creator
  usage:

  const ADD_TODO = 'ADD_TODO'
  export const addTodo = makeActionCreator(ADD_TODO, 'text')
*/

const makeActionCreator = (type, ...argNames) => {
  return function(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
};

export { makeActionCreator, createReduxManager };
