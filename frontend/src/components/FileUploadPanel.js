import React, { useState } from "react";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { Upload, FileText, FileSpreadsheet, Download } from "lucide-react";
import { Button, Card, CardContent } from '@mui/material';

const API = '/api';

const FileUploadPanel = ({ onUploadSuccess, events, addConsoleLog }) => {
  const [eventFile, setEventFile] = useState(null);
  const [excelDataFile, setExcelDataFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const hasEvents = events && events.length > 0;
  const toast = useToast();

  const handleUploadEvents = async () => {
    if (!eventFile) {
      toast.error("Please select an event definitions file");
      return;
    }

    const formData = new FormData();
    formData.append("file", eventFile);

    try {
      setUploading(true);
      addConsoleLog("Uploading event definitions with datatypes...", "info");
      const response = await axios.post(`${API}/events/upload`, formData);
      toast.success(response.data.message);
      addConsoleLog(`✓ ${response.data.message}`, "success");
      setEventFile(null);
      onUploadSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      toast.error("Failed to upload events");
      addConsoleLog(`✗ Error: ${errorMsg}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadExcelData = async () => {
    if (!excelDataFile) {
      toast.error("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelDataFile);

    try {
      setUploading(true);
      addConsoleLog("Uploading Excel event data (processing all sheets)...", "info");
      const response = await axios.post(`${API}/event-data/upload-excel`, formData);
      
      // Show results
      const { uploaded_events, errors } = response.data;
      
      if (uploaded_events && uploaded_events.length > 0) {
        uploaded_events.forEach(item => {
          addConsoleLog(`✓ ${item.event_name}: ${item.rows_uploaded} rows uploaded`, "success");
        });
        toast.success(`Uploaded data for ${uploaded_events.length} event(s)`);
      }
      
      if (errors && errors.length > 0) {
        errors.forEach(err => {
          addConsoleLog(`⚠ ${err}`, "warning");
        });
      }
      
      setExcelDataFile(null);
      onUploadSuccess();
    } catch (error) {
      toast.error("Failed to upload Excel data");
      addConsoleLog(`✗ Error: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadEvents = async () => {
    try {
      addConsoleLog("Downloading event definitions...", "info");
      const response = await axios.get(`${API}/events/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event_definitions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Event definitions downloaded!");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      toast.error("Failed to download events");
      addConsoleLog(`✗ Error: ${errorMsg}`, "error");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50" data-testid="file-upload-panel">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Manrope' }}>Upload Data Files</h2>
        <p className="text-sm text-slate-600">Upload event definitions (CSV) and event data (Excel)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Definitions */}
        <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 3 }}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>Event Definitions</h3>
                <p className="text-xs text-slate-600 mt-1">Manually load event definitions by uploading a CSV when event configurations are not imported.</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleDownloadEvents}
                  disabled={!hasEvents}
                  aria-disabled={!hasEvents}
                  data-testid="download-events-button"
                  title={hasEvents ? "Download event definitions" : "No event definitions to download"}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded border ${hasEvents ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setEventFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  data-testid="event-file-input"
                />
              </div>
              <Button 
                onClick={handleUploadEvents} 
                disabled={!eventFile || uploading}
                variant="contained"
                fullWidth
                size="small"
                startIcon={<Upload className="w-4 h-4" />}
                data-testid="upload-events-button"
              >
                Upload Events
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Data - Excel */}
        <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 3 }}>
            <div className="mb-4">
              <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>Event Data (Excel)</h3>
              <p className="text-xs text-slate-600 mt-1">Excel file where each sheet = one event (sheet name = event name)</p>
            </div>
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setExcelDataFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  data-testid="excel-data-file-input"
                />
              </div>
              {excelDataFile && (
                <p className="text-xs text-green-600">Selected: {excelDataFile.name}</p>
              )}
              <Button 
                onClick={handleUploadExcelData} 
                disabled={!excelDataFile || uploading}
                variant="contained"
                fullWidth
                size="small"
                startIcon={<Upload className="w-4 h-4" />}
                data-testid="upload-excel-data-button"
                sx={{
                  bgcolor: '#059669',
                  '&:hover': { bgcolor: '#047857' },
                }}
              >
                Upload Excel Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <h4 className="font-semibold text-sm text-slate-900 mb-2" style={{ fontFamily: 'Manrope' }}>Upload Instructions</h4>
          <ul className="text-xs text-slate-700 space-y-1">
            <li>• <strong>Event Definitions (CSV):</strong> Columns: EventName, EventField, DataType (string, date, boolean, decimal, integer)</li>
            <li>• <strong>Event Data (Excel):</strong> Each sheet represents one event. Sheet name must match event name (e.g., "INT_ACC", "PMT")</li>
            <li>• <strong>Required Columns:</strong> PostingDate, EffectiveDate, InstrumentId + event-specific fields</li>
            <li>• <strong>DSL Functions:</strong> Pre-loaded with 100+ financial functions (pv, fv, npv, irr, etc.)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadPanel;