import React, { useReducer, useEffect, useMemo } from 'react';
import { produce } from 'immer';
import { ChevronsLeft } from 'react-feather';
import { getGeneralDefaultState } from '@/config/default.js';
import { deepMerge } from '@/utils.js';
import Sidebar from '@/components/Sidebar';
import MainHeader from '@/components/MainHeader';
import Preview from '@/components/Preview';
import ItemsTableEditor from '@/components/editors/ItemsTableEditor';
import Notification from '@/components/Notification';
import styles from './App.module.css';

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_FIELD': {
      return produce(state, draft => {
        const { path, value } = action.payload;
        const keys = path.split('.');
        let current = draft;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = value;
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
    }
    case 'CALCULATE_TOTALS': {
      return produce(state, draft => {
        const { items, summary } = draft;
        const subtotal = (items ?? []).reduce((acc, group) => acc + (group.details ?? []).reduce((gAcc, item) => gAcc + (Number(item.qty) * Number(item.price)), 0), 0);
        const discountPercentage = summary?.discount?.percentage || 0;
        const discountAmount = subtotal * (discountPercentage / 100);
        const roundingValue = summary?.rounding?.value || 0;
        const total = subtotal - discountAmount + roundingValue;
        draft.calculated = { subtotal, discountAmount, total };
      });
    }
    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'HIDE_NOTIFICATION':
      return { ...state, notification: null };
    case 'TOGGLE_MOBILE_SIDEBAR': {
      const shouldOpen = typeof action.payload === 'boolean' ? action.payload : !state.ui.isMobileSidebarOpen;
      return { ...state, ui: { ...state.ui, isMobileSidebarOpen: shouldOpen } };
    }
    case 'TOGGLE_SIDEBAR_COLLAPSE': {
        return produce(state, draft => {
            draft.ui.sidebarCollapsed = !draft.ui.sidebarCollapsed;
        });
    }
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, getGeneralDefaultState());
  
  useEffect(() => { dispatch({ type: 'CALCULATE_TOTALS' }); }, [state.items, state.summary.discount, state.summary.rounding]);
  useEffect(() => { document.documentElement.style.setProperty('--color-primary-500', state.ui.themeColor); }, [state.ui.themeColor]);
  useEffect(() => {
    const originalTitle = document.title;
    const handleBeforePrint = () => { document.title = `Invoice ${state.invoice.number || 'Untitled'}`; };
    const handleAfterPrint = () => { document.title = originalTitle; };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [state.invoice.number]);

  const showNotification = (message, type = 'info', duration = 3000) => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, type, duration } });
  };

  const actions = useMemo(() => ({
    updateField: (path, value) => dispatch({ type: 'UPDATE_FIELD', payload: { path, value } }),
    setState: (newState) => dispatch({ type: 'SET_STATE', payload: newState }),
    toggleMobileSidebar: (force) => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR', payload: force }),
    toggleSidebarCollapse: () => dispatch({ type: 'TOGGLE_SIDEBAR_COLLAPSE' }),
    resetState: () => {
      if (confirm('Reset to default template? Unsaved changes will be lost.')) {
        dispatch({ type: 'SET_STATE', payload: getGeneralDefaultState() });
        showNotification('Reset to default template.', 'success');
      }
    },
    saveFile: () => {
      const stateToSave = { ...state, notification: null };
      const dataStr = JSON.stringify(stateToSave, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${state.invoice.number.replace(/[^a-zA-Z0-9]/g, '') || 'data'}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('File downloaded successfully.', 'success');
    },
    loadFile: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      showNotification('Loading file...', 'loading');
      reader.onload = (event) => {
        try {
          const loadedState = JSON.parse(event.target.result);
          const mergedState = deepMerge(getGeneralDefaultState(), loadedState);
          dispatch({ type: 'SET_STATE', payload: mergedState });
          showNotification('File loaded successfully.', 'success');
        } catch (err) {
          showNotification('Invalid JSON file.', 'error');
          console.error("Failed to load state:", err);
        }
      };
      reader.onerror = () => showNotification('Could not read the file.', 'error');
      reader.readAsText(file);
      e.target.value = '';
    },
  }), [state]);

  const renderMainContent = () => {
    if (state.ui.activeTab === 'items') {
      return <ItemsTableEditor state={state} setState={actions.setState} />;
    }
    return (
      <div className={styles.previewPanel}>
        <div id="invoice-paper" className={styles.invoicePaper}>
          <Preview state={state} />
        </div>
      </div>
    );
  };

  const appContainerClasses = `${styles.appContainer} ${state.ui.sidebarCollapsed ? styles.sidebarCollapsed : ''}`;

  return (
    <div className={appContainerClasses}>
      <Sidebar state={state} actions={actions} />
      
      <button 
        className={styles.collapseButton} 
        onClick={actions.toggleSidebarCollapse} 
        aria-label={state.ui.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronsLeft size={20} />
      </button>

      <div className={styles.contentWrapper}>
        <MainHeader actions={actions} />
        <main className={styles.mainContent}>
          {renderMainContent()}
        </main>
      </div>
      <input type="file" id="file-loader" style={{ display: 'none' }} accept=".json" onChange={actions.loadFile} />
      {state.notification && (
        <Notification
          message={state.notification.message}
          type={state.notification.type}
          duration={state.notification.duration}
          onHide={() => dispatch({ type: 'HIDE_NOTIFICATION' })}
        />
      )}
    </div>
  );
}

export default App;