class Store {
  constructor() {
    this._state = {
      employees: [],
      viewMode: "table",
    };
    this._listeners = new Set();
  }

  getState() {
    return this._state;
  }

  setState(newState) {
    this._state = { ...this._state, ...newState };
    this._notify();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    this._listeners.forEach((listener) => listener(this._state));
  }

  // Load initial data from localStorage
  loadInitialState() {
    const savedState = localStorage.getItem("employeeState");
    if (savedState) {
      this._state = JSON.parse(savedState);
    }
  }

  // Save state to localStorage
  _persistState() {
    localStorage.setItem("employeeState", JSON.stringify(this._state));
  }
}

export const store = new Store();

// Load initial state when the store is created
store.loadInitialState();

// Save state to localStorage whenever it changes
store.subscribe(() => {
  store._persistState();
});
