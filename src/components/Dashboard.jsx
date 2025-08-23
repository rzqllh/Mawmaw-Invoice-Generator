import React from 'react';
import { Plus, Filter, ChevronDown, MoreVertical, Clock, File, DollarSign, Calendar } from 'react-feather';
import { mockInvoices } from '@/config/mockData.js';
import styles from './Dashboard.module.css';

const StatCard = ({ icon, value, label }) => (
    <div className={styles.statCard}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statContent}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
        {status}
    </span>
);

function Dashboard() {
  return (
    <div className={styles.panel}>
        <header className={styles.panelHeader}>
            <div className={styles.panelTitle}>
                <h2>Invoices</h2>
            </div>
            <div className={styles.panelActions}>
                <button className={styles.createButton}>
                    <Plus size={16} />
                    <span>Create an invoice</span>
                </button>
            </div>
        </header>

        <div className={styles.statsGrid}>
            <StatCard icon={<DollarSign size={20} />} value="$60,400" label="Overdue amount" />
            <StatCard icon={<File size={20} />} value="$60,400" label="Drafted totals" />
            <StatCard icon={<DollarSign size={20} />} value="$60,400" label="Unpaid totals" />
            <StatCard icon={<Clock size={20} />} value="08 days" label="Average paid time" />
            <StatCard icon={<Calendar size={20} />} value="05 invoices" label="Scheduled for today" />
        </div>

        <div className={styles.tablePanel}>
            <div className={styles.tableHeader}>
                <input type="text" placeholder="Enter invoice number" className={styles.searchInput} />
                <div className={styles.filterActions}>
                    <button className={styles.filterButton}><Filter size={14} /><span>Filter</span></button>
                    <button className={styles.filterButton}><span>Newest First</span><ChevronDown size={14} /></button>
                </div>
            </div>

            <div className={styles.invoiceTable}>
                <div className={styles.gridHeader}>
                    <div>Status</div>
                    <div>Date</div>
                    <div>Number</div>
                    <div>Customer</div>
                    <div className="text-right">Total</div>
                    <div></div>
                </div>
                {mockInvoices.map(invoice => (
                    <div key={invoice.id} className={styles.gridRow}>
                        <div><StatusBadge status={invoice.status} /></div>
                        <div>{invoice.date}</div>
                        <div>{invoice.number}</div>
                        <div>{invoice.customer}</div>
                        <div className="text-right">${invoice.total.toLocaleString()}</div>
                        <div className={styles.rowActions}>
                            <button><MoreVertical size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default Dashboard;