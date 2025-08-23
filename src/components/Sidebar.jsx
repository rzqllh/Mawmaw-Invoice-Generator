import React from 'react';
import { Power, Info, List, GitCommit, FileText, Menu } from 'react-feather';

import InfoEditor from '@/components/editors/InfoEditor';
import StagesEditor from '@/components/editors/StagesEditor';
import SummaryEditor from '@/components/editors/SummaryEditor';

import styles from './Sidebar.module.css';

const EDITOR_TABS = [
    { id: 'info', label: 'Info Utama', icon: Info },
    { id: 'items', label: 'Item Pekerjaan', icon: List },
    { id: 'stages', label: 'Tahap Pembayaran', icon: GitCommit },
    { id: 'summary', label: 'Ringkasan', icon: FileText },
];

const user = {
    name: 'Michał Kowalski',
    avatarUrl: 'https://i.pravatar.cc/40?u=michael',
    sessionInfo: 'Session ends in 9 min 5 s'
};

function Sidebar({ state, actions }) {
    const { ui } = state;

    const switchTab = (tabId) => {
        actions.updateField('ui.activeTab', tabId);
        if (ui.isMobileSidebarOpen) {
            actions.toggleMobileSidebar(false);
        }
    };

    const renderTabContent = () => {
        switch (ui.activeTab) {
            case 'info': 
                return <InfoEditor state={state} updateField={actions.updateField} />;
            case 'stages': 
                return <StagesEditor state={state} setState={actions.setState} />;
            case 'summary': 
                return <SummaryEditor state={state} updateField={actions.updateField} />;
            case 'items':
            default: 
                return (
                    <div className={styles.sidebarPlaceholder}>
                        <List size={40} />
                        <p>Manajemen Item Pekerjaan</p>
                        <span>Editor untuk item pekerjaan berada di panel utama untuk memberikan ruang yang lebih luas.</span>
                    </div>
                );
        }
    };
    
    const sidebarClasses = [
        styles.sidebar,
        ui.isMobileSidebarOpen ? styles.isOpen : '',
        ui.sidebarCollapsed ? styles.isCollapsed : ''
    ].join(' ');

    const overlayClasses = [
        styles.mobileOverlay,
        ui.isMobileSidebarOpen ? styles.isVisible : ''
    ].join(' ');

    return (
        <>
            <header className={styles.mobileHeader}>
                <button className={styles.mobileMenuToggle} onClick={() => actions.toggleMobileSidebar()}>
                    <Menu size={20} />
                </button>
                <span>Invoice Editor</span>
            </header>
            
            <aside id="sidebar" className={sidebarClasses}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.userProfile}>
                        <img src={user.avatarUrl} alt="User Avatar" className={styles.avatar} />
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.sessionInfo}>{user.sessionInfo}</span>
                        </div>
                        <button className={styles.powerButton} aria-label="Log out">
                            <Power size={18} />
                        </button>
                    </div>
                </div>

                <div className={styles.editorContainer}>
                    <span className={styles.groupTitle}>INVOICE EDITOR</span>
                    
                    <div className={styles.editorTabs} role="tablist" aria-orientation="vertical">
                        {EDITOR_TABS.map((tab, index) => (
                            <button 
                                key={tab.id} 
                                id={`editor-tab-${index}`}
                                className={`${styles.editorTabItem} ${ui.activeTab === tab.id ? styles.active : ''}`} 
                                onClick={() => switchTab(tab.id)}
                                role="tab"
                                aria-selected={ui.activeTab === tab.id}
                                aria-controls={`editor-panel-${index}`}
                                data-tooltip={tab.label}
                            >
                                <span className={styles.iconWrapper}>
                                    <tab.icon size="100%" aria-hidden="true" />
                                </span>
                                <span className={styles.tabLabel}>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.editorContent} role="tabpanel" id={`editor-panel-${EDITOR_TABS.findIndex(t => t.id === ui.activeTab)}`} aria-labelledby={`editor-tab-${EDITOR_TABS.findIndex(t => t.id === ui.activeTab)}`}>
                        {renderTabContent()}
                    </div>
                </div>
            </aside>

            <div id="mobile-overlay" className={overlayClasses} onClick={() => actions.toggleMobileSidebar(false)}></div>
        </>
    );
}
export default Sidebar;