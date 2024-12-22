const initialState = {
  viewMode: localStorage.getItem("employeeViewMode") || "table", // Default to table view
};

export function employeeReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_VIEW_MODE":
      localStorage.setItem("employeeViewMode", action.payload);
      return {
        ...state,
        viewMode: action.payload,
      };

    default:
      return state;
  }
}
