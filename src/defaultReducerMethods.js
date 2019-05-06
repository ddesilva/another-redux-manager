const makeReducerMethods = (acc, resultsPropName) => {
  return {
    initial: (state, initialData) => {
      return {
        ...state,
        ...{
          [acc.name]: {
            ...{
              [resultsPropName]: initialData,
              status: acc.actionTypes.initial,
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
          [acc.name]: {
            ...{
              [resultsPropName]: { ...state[acc.name][resultsPropName], ...action.payload },
              status: acc.actionTypes.success,
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
          [acc.name]: {
            ...state[acc.name],
            ...{
              status: acc.actionTypes.inProgress,
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
          [acc.name]: {
            ...state[acc.name],
            ...{
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
