import React, 'react';
import { 
    Home, Clock, Calendar, BarChart2, Repeat, MessageSquare, Folder, Grid, HelpCircle, Settings, Power, ChevronsLeft 
} from 'react-feather';
import styles from './Sidebar.module.css';

const NAV_GROUPS = [
    {
        title: 'Banking',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: Clock },
            { id: 'history', label: 'History', icon: Calendar },
            { id: 'analysis', label: 'Analysis', icon: BarChart2 },
            { id: 'finances', label: 'Finances', icon: Repeat },
        ]
    },
    {
        title: 'Services',
        items: [
            { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 9 },
            { id: 'documents', label: 'Documents', icon: Folder },
            { id: 'products', label: 'Products', icon: Grid },
        ]
    },
    {
        title: 'Other',
        items: [
            { id: 'help', label: 'Help', icon: HelpCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
        ]
    }
];

// Mock user data for display
const user = {
    name: 'Michał Kowalski',
    avatarUrl: 'https://i.pravatar.cc/40?u=michael', // Placeholder avatar
    sessionInfo: 'Session ends in 9 min 5 s'
};

function Sidebar({ state, actions }) {
    const { ui } = state;

    const sidebarClasses = [
        styles.sidebar,
        ui.sidebarCollapsed ? styles.isCollapsed : ''
    ].join(' ');

    // For this demonstration, we'll use a static active tab.
    // In a real app, this would come from state.
    const activeTab = 'finances'; 

    return (
        <aside id="sidebar" className={sidebarClasses}>
            <div className={styles.sidebarHeader}>
                <div className={styles.userProfile}>
                    <img src={user.avatarUrl} alt="User Avatar" className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.sessionInfo}>{user.sessionInfo}</span>
                    </div>
                    <button className={styles.powerButton}>
                        <Power size={18} />
                    </button>
                </div>
            </div>

            <nav className={styles.sidebarNav}>
                {NAV_GROUPS.map(group => (
                    <div key={group.title} className={styles.navGroup}>
                        <span className={styles.groupTitle}>{group.title}</span>
                        <div className={styles.navItemsContainer}>
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                                    data-tooltip={item.label}
                                >
                                    <item.icon className={styles.navIcon} size={20} />
                                    <span className={styles.navLabel}>{item.label}</span>
                                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            
            {/* The collapse toggle is now part of the main app layout logic if needed, or can be placed here */}
            {/* For this design, there's no visible collapse button, implying it's a user preference or app-level control */}
        </aside>
    );
}
export default Sidebar;