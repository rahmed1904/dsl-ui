import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Clock, Trash2, TrendingUp } from "lucide-react";

const PageSizeOptions = [5, 10, 25, 50];

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg w-full max-w-4xl p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const TransactionReports = ({ reports, onDownloadReport, onDeleteReport }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // if reports array contains multiple instances, prefer latest per template
  const displayReports = useMemo(() => {
    const map = new Map();
    (reports || []).forEach(r => map.set(r.template_name, r));
    return Array.from(map.values());
  }, [reports]);

  const openReport = (report) => {
    setSelectedReport(report);
    setPageIndex(0);
    setFilterText("");
    setModalOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedReport || !selectedReport.transactions) return [];
    const txt = filterText.trim().toLowerCase();
    if (!txt) return selectedReport.transactions;
    return selectedReport.transactions.filter(tx => {
      return (
        (tx.instrumentid && String(tx.instrumentid).toLowerCase().includes(txt)) ||
        (tx.subinstrumentid && String(tx.subinstrumentid).toLowerCase().includes(txt)) ||
        (tx.transactiontype && String(tx.transactiontype).toLowerCase().includes(txt)) ||
        (tx.postingdate && String(tx.postingdate).toLowerCase().includes(txt))
      );
    });
  }, [selectedReport, filterText]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const pageRows = filteredTransactions.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize || undefined);

  return (
    <div className="pt-0 px-6 pb-6 bg-slate-50" data-testid="transaction-reports">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Manrope' }}>Transaction Reports</h2>
        <p className="text-sm text-slate-600">View and download generated transaction reports. Click a report's summary to open the printable report view.</p>
      </div>

      {(!displayReports || displayReports.length === 0) ? (
        <Card className="p-12 text-center border-slate-200">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Transaction Reports</h3>
          <p className="text-sm text-slate-500">Execute templates to generate transaction reports</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayReports.map((report) => (
            <Card key={report.id || report.template_name} className="p-6 border-slate-200 hover:shadow-md transition-shadow duration-200" data-testid={`report-${report.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>
                      {report.template_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Event: <span className="font-mono">{report.event_name}</span></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.executed_at ? new Date(report.executed_at).toLocaleString() : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openReport(report)} data-testid={`open-report-${report.id}`}>Open</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteReport(report.id, report.template_name)}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    data-testid={`delete-report-${report.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-slate-100 rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-700">Generated Transactions</div>
                      <div className="text-xs text-slate-500">Click Open to see the full report</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600 cursor-pointer" onClick={() => openReport(report)}>{report.transactions.length}</div>
                  </div>
                  {report.transactions.length > 0 && (
                    <div className="mt-3">
                      <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-600 border-b border-slate-300 pb-1">
                        <div>Posting Date</div>
                        <div>Instrument</div>
                        <div>Sub-Instrument</div>
                        <div>Type</div>
                        <div className="text-right">Amount</div>
                        <div>Effective Date</div>
                      </div>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {report.transactions.slice(0, 8).map((tx, idx) => (
                          <div key={idx} className="grid grid-cols-6 gap-2 text-xs text-slate-700">
                            <div className="font-mono">{tx.postingdate}</div>
                            <div className="font-mono">{tx.instrumentid}</div>
                            <div className="font-mono">{tx.subinstrumentid || '1'}</div>
                            <div className="truncate">{tx.transactiontype}</div>
                            <div className="text-right font-mono">{parseFloat(tx.amount).toFixed(2)}</div>
                            <div className="font-mono">{tx.effectivedate}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onDownloadReport(report.id)}
                  className="flex-1"
                  data-testid={`download-report-${report.id}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedReport ? `${selectedReport.template_name} — Transactions` : 'Transactions'}>
        <div className="mb-4 flex items-center gap-2">
          <input value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="Filter by instrument, type, date..." className="border rounded px-2 py-1 flex-1" />
          <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value,10)); setPageIndex(0); }} className="border rounded px-2 py-1">
            {PageSizeOptions.map(s => <option key={s} value={s}>{s}/page</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="text-xs text-slate-600">
                <th className="text-left p-2">Posting Date</th>
                <th className="text-left p-2">Instrument ID</th>
                <th className="text-left p-2">Sub-Instrument</th>
                <th className="text-left p-2">Type</th>
                <th className="text-right p-2">Amount</th>
                <th className="text-left p-2">Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((tx, i) => (
                <React.Fragment key={i}>
                  <tr className="border-b" onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{cursor: 'pointer'}}>
                    <td className="p-2 font-mono">{tx.postingdate}</td>
                    <td className="p-2 font-mono">{tx.instrumentid}</td>
                    <td className="p-2 font-mono">{tx.subinstrumentid || '1'}</td>
                    <td className="p-2">{tx.transactiontype}</td>
                    <td className="p-2 text-right font-mono">{parseFloat(tx.amount).toFixed(2)}</td>
                    <td className="p-2 font-mono">{tx.effectivedate}</td>
                  </tr>
                  {expandedRow === i && (
                    <tr>
                      <td colSpan={6} className="p-3 bg-slate-50 text-xs">
                        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(tx, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-600">Showing {filteredTransactions.length} transactions — page {pageIndex+1} of {pageCount}</div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setPageIndex(0)} disabled={pageIndex===0}>First</Button>
            <Button size="sm" onClick={() => setPageIndex(p => Math.max(0, p-1))} disabled={pageIndex===0}>Prev</Button>
            <Button size="sm" onClick={() => setPageIndex(p => Math.min(pageCount-1, p+1))} disabled={pageIndex>=pageCount-1}>Next</Button>
            <Button size="sm" onClick={() => setPageIndex(pageCount-1)} disabled={pageIndex>=pageCount-1}>Last</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionReports;
