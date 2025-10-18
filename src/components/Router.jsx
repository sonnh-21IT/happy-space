import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useURLParams } from '../hooks/useURLParams';
import CreateCardForm from './CreateCardForm';
import KeyInputForm from './KeyInputForm';
import FinalCardDisplay from './FinalCardDisplay';
import LoadingSpinner from './LoadingSpinner';

export function Router() {
  const { dispatch, currentView } = useApp();
  const { wishingCode } = useURLParams();

  useEffect(() => {
    // Determine initial view based on URL parameters
    if (wishingCode) {
      dispatch({ type: 'SET_VIEW', payload: 'keyInput' });
      dispatch({ type: 'SET_WISHING_CODE', payload: wishingCode });
    } else {
      dispatch({ type: 'SET_VIEW', payload: 'create' });
    }
  }, [wishingCode, dispatch]);

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateCardForm />;
      case 'keyInput':
        return <KeyInputForm />;
      case 'display':
        return <FinalCardDisplay />;
      case 'loading':
        return <LoadingSpinner />;
      default:
        return <CreateCardForm />;
    }
  };

  return (
    <div className="router">
      {renderView()}
    </div>
  );
}
