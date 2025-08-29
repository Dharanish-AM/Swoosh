const initialState = {
  isAuthenticated: false,
  token: null,
  userId: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, isAuthenticated: true, token: action.token, userId: action.userId };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
