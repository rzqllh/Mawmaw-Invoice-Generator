import React from 'react';
import DOMPurify from 'dompurify';
import { Home, MessageSquare } from 'react-feather';
import CurrencyDisplay from './CurrencyDisplay';
import styles from './Preview.module.css';

function Preview({ state }) {
  const { company, client, invoice, items, paymentStages, summary, calculated } = state;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', options);
  };

  const safeNotes = DOMPurify.sanitize(summary.notes);

  return (
    <div className={styles.previewContent}>
      <header className={styles.invoiceHeader}>
        <div className={styles.companyDetails}>
          <div className={styles.companyLogo}>
            {company.logo 
              ? <img src={company.logo} alt={`${company.name} logo`} /> 
              : <div className={styles.companyLogoPlaceholder}><Home /></div>
            }
          </div>
          <span className={styles.companyName}>{company.name}</span>
        </div>
        <div className={styles.invoiceTitle}>
          <h1>{invoice.title}</h1>
          <p>{invoice.number}</p>
        </div>
      </header>

      <section className={styles.invoiceMeta}>
        <div className={styles.metaCol}>
          <h4>Tanggal Invoice</h4>
          <p>{formatDate(invoice.date)}</p>
        </div>
        <div className={styles.metaCol}>
          <h4>Tenggat Waktu</h4>
          <p>{formatDate(invoice.dueDate)}</p>
        </div>
        <div className={styles.metaCol}>
          <h4>Tagihan Kepada</h4>
          <p>{`${client.name}\n${client.address}\n${client.phone}`}</p>
        </div>
      </section>

      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th className={`${styles.thNo} text-center`}>No</th>
            <th className={styles.thDesc}>Jenis Pekerjaan</th>
            <th className={`${styles.thQty} text-center`}>QTY</th>
            <th className={`${styles.thUnit} text-center`}>Satuan</th>
            <th className={`${styles.thPrice} text-right`}>Harga</th>
            <th className={`${styles.thTotal} text-right`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {(items ?? []).map((group, groupIndex) => (
            <React.Fragment key={group.id}>
              <tr className={styles.itemGroupHeader}>
                <td className="text-center">{groupIndex + 1}</td>
                <td colSpan="5">{group.groupName}</td>
              </tr>
              {(group.details ?? []).map(item => (
                <tr className={styles.itemDetail} key={item.id}>
                  <td></td>
                  <td>{item.description}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-center">{item.unit}</td>
                  <td className="text-right">
                    <CurrencyDisplay amount={item.price} currencyCode={summary.currencyCode} />
                  </td>
                  <td className="text-right">
                    <CurrencyDisplay amount={item.qty * item.price} currencyCode={summary.currencyCode} />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <section className={styles.invoiceSummarySection}>
        <div className={styles.paymentStagesContainer}>
            <h4>Tahap Pembayaran</h4>
            <table className={styles.paymentStagesTable}>
                <tbody>
                    {(paymentStages ?? []).map(p => (
                        <tr key={p.id}>
                            <td>{p.stage}</td>
                            <td>{p.percentage}%</td>
                            <td>{p.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className={styles.summaryDetailsContainer}>
            <table className={styles.summaryDetailsTable}>
                <tbody>
                    <tr><td>Subtotal</td><td><CurrencyDisplay amount={calculated.subtotal} currencyCode={summary.currencyCode}/></td></tr>
                    <tr><td>{summary.discount.label}</td><td><CurrencyDisplay amount={calculated.discountAmount} currencyCode={summary.currencyCode}/></td></tr>
                    <tr><td>{summary.rounding.label}</td><td><CurrencyDisplay amount={summary.rounding.value} currencyCode={summary.currencyCode}/></td></tr>
                    <tr className={styles.grandTotal}><td>Total</td><td><CurrencyDisplay amount={calculated.total} currencyCode={summary.currencyCode}/></td></tr>
                </tbody>
            </table>
        </div>
      </section>

      {summary.notes && (
        <section className={styles.notesSection}>
            <div className={styles.notesBox} dangerouslySetInnerHTML={{ __html: safeNotes }} />
        </section>
      )}
      
      <footer className={styles.paymentInfoFooter}>
        <div className={styles.paymentInfoHeader}>Informasi Pembayaran</div>
        <div className={styles.paymentInfoBody}>
            <div className={styles.paymentInfoCol}><h4>Atas Nama</h4><p>AISYAH</p></div>
            <div className={styles.paymentInfoCol}><h4>Nama Bank</h4><p>Bank Mandiri</p></div>
            <div className={styles.paymentInfoCol}><h4>Nomor Rekening</h4><p>1570009897654</p></div>
        </div>
      </footer>
    </div>
  );
}

export default Preview;