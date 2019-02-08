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
