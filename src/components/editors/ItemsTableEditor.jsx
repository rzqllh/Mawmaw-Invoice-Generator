import React from 'react';
import { Plus, Trash2, Copy, PlusCircle, ChevronDown } from 'react-feather';
import { generateUUID } from '@/utils.js';
import styles from './ItemsTableEditor.module.css';
import editorStyles from './Editors.module.css';

const useAccordion = (items) => {
    const allGroupIds = items.map(group => group.id);
    const [openGroups, setOpenGroups] = React.useState(allGroupIds);

    const toggleGroup = (groupId) => {
        setOpenGroups(prevOpen => 
            prevOpen.includes(groupId)
                ? prevOpen.filter(id => id !== groupId)
                : [...prevOpen, groupId]
        );
    };

    return [openGroups, toggleGroup];
};

function ItemsTableEditor({ state, setState }) {
    const { items } = state;
    const [openGroups, toggleGroup] = useAccordion(items);

    const handleFieldChange = (groupIndex, itemIndex, field, value) => {
        const newItems = [...items];
        const val = (field === 'qty' || field === 'price') ? parseFloat(value) || 0 : value;
        newItems[groupIndex].details[itemIndex][field] = val;
        setState({ ...state, items: newItems });
    };

    const handleGroupFieldChange = (groupIndex, field, value) => {
        const newItems = [...items];
        newItems[groupIndex][field] = value;
        setState({ ...state, items: newItems });
    };

    const addGroup = () => {
        const newGroupId = generateUUID();
        const newGroup = { id: newGroupId, groupName: 'New Group', details: [{ id: generateUUID(), description: 'New Item', qty: 1, unit: 'pcs', price: 0 }] };
        setState({ ...state, items: [...items, newGroup] });
        toggleGroup(newGroupId);
    };

    const deleteGroup = (e, groupIndex) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this entire group?')) {
            const newItems = items.filter((_, index) => index !== groupIndex);
            setState({ ...state, items: newItems });
        }
    };

    const addItemToGroup = (groupIndex) => {
        const newItem = { id: generateUUID(), description: 'New Item', qty: 1, unit: 'pcs', price: 0 };
        const newItems = [...items];
        newItems[groupIndex].details.push(newItem);
        setState({ ...state, items: newItems });
    };

    const deleteItemDetail = (groupIndex, itemIndex) => {
        const newItems = [...items];
        newItems[groupIndex].details = newItems[groupIndex].details.filter((_, index) => index !== itemIndex);
        if (newItems[groupIndex].details.length === 0) {
            newItems.splice(groupIndex, 1);
        }
        setState({ ...state, items: newItems });
    };

    const duplicateItemDetail = (groupIndex, itemIndex) => {
        const originalItem = items[groupIndex].details[itemIndex];
        const newItem = { ...JSON.parse(JSON.stringify(originalItem)), id: generateUUID() };
        const newItems = [...items];
        newItems[groupIndex].details.splice(itemIndex + 1, 0, newItem);
        setState({ ...state, items: newItems });
    };

    return (
        <div className={styles.panel}>
            <header className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                    <h2>Items Pekerjaan</h2>
                    <p>Atur semua item pekerjaan di sini.</p>
                </div>
                <div className={styles.panelActions}>
                    <button className={editorStyles.btnPrimary} onClick={addGroup}>
                        <PlusCircle size={16} />
                        <span>Tambah Grup</span>
                    </button>
                </div>
            </header>

            <div className={styles.tableContainer}>
                {items.map((group, groupIndex) => {
                    const isOpen = openGroups.includes(group.id);
                    return (
                        <div key={group.id} className={styles.itemGroup}>
                            <div className={styles.itemGroupHeader} onClick={() => toggleGroup(group.id)}>
                                <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.isOpen : ''}`} />
                                <input 
                                    type="text" 
                                    value={group.groupName} 
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleGroupFieldChange(groupIndex, 'groupName', e.target.value)} 
                                    placeholder="Group Name"
                                    className={styles.groupNameInput}
                                />
                                <button className={`${editorStyles.btnIcon} ${editorStyles.btnIconDanger}`} onClick={(e) => deleteGroup(e, groupIndex)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            {isOpen && (
                                <div className={styles.itemGroupContent}>
                                    <div className={styles.itemsGrid}>
                                        <div className={styles.itemsGridHeader}>
                                            <div>Deskripsi</div>
                                            <div>Qty</div>
                                            <div>Unit</div>
                                            <div>Harga</div>
                                        </div>
                                        {group.details.map((item, itemIndex) => (
                                            <div key={item.id} className={styles.itemsGridRow}>
                                                <input type="text" value={item.description} onChange={(e) => handleFieldChange(groupIndex, itemIndex, 'description', e.target.value)} />
                                                <input type="number" value={item.qty} onChange={(e) => handleFieldChange(groupIndex, itemIndex, 'qty', e.target.value)} />
                                                <input type="text" value={item.unit} onChange={(e) => handleFieldChange(groupIndex, itemIndex, 'unit', e.target.value)} />
                                                <input type="number" value={item.price} onChange={(e) => handleFieldChange(groupIndex, itemIndex, 'price', e.target.value)} />
                                                <div className={styles.actionsCell}>
                                                    <button className={editorStyles.btnIcon} onClick={() => duplicateItemDetail(groupIndex, itemIndex)}><Copy size={14} /></button>
                                                    <button className={`${editorStyles.btnIcon} ${editorStyles.btnIconDanger}`} onClick={() => deleteItemDetail(groupIndex, itemIndex)}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={styles.addItemButton} onClick={() => addItemToGroup(groupIndex)}>
                                        <Plus size={14} /> Tambah Item
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ItemsTableEditor;