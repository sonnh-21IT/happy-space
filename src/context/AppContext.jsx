import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  currentView: 'loading', // 'create', 'keyInput', 'display'
  cardData: null,
  error: null,
  loading: false,
  wishingCode: null
};

// Action types
export const ACTIONS = {
  SET_VIEW: 'SET_VIEW',
  SET_CARD_DATA: 'SET_CARD_DATA',
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_WISHING_CODE: 'SET_WISHING_CODE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VIEW:
      return { ...state, currentView: action.payload };
    case ACTIONS.SET_CARD_DATA:
      return { ...state, cardData: action.payload, error: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_WISHING_CODE:
      return { ...state, wishingCode: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
