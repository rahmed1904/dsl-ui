import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { Upload, FileText, FileSpreadsheet, Download, CheckCircle, Eye } from "lucide-react";
import { Button, Card, CardContent, Box, Typography, LinearProgress, IconButton, Tooltip } from '@mui/material';

const API = '/api';

const FileUploadPanel = ({ onUploadSuccess, events, addConsoleLog, selectedEvent, onViewEvent }) => {
  const [eventFile, setEventFile] = useState(null);
  const [excelDataFile, setExcelDataFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [eventDataSummary, setEventDataSummary] = useState([]);
  const hasEvents = events && events.length > 0;
  const toast = useToast();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const resp = await axios.get(`${API}/event-data`);
        setEventDataSummary(resp.data || []);
      } catch (e) {
        // ignore
      }
    };
    loadSummary();
  }, [events]);

  const handleUploadEvents = async () => {
    if (!eventFile) {
      toast.error("Please select an event definitions file");
      return;
    }

    const formData = new FormData();
    formData.append("file", eventFile);

    try {
      setUploading(true);
      addConsoleLog("Uploading event definitions...", "info");
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
      addConsoleLog("Uploading Excel event data...", "info");
      const response = await axios.post(`${API}/event-data/upload-excel`, formData);
      
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
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100%' }} data-testid="file-upload-panel">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>Upload Data Files</Typography>
        <Typography variant="body2" color="text.secondary">Upload event definitions (CSV) and event data (Excel)</Typography>
      </Box>

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Event Definitions */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FileText size={20} color="#5B5FED" />
                  <Typography variant="h5">Event Definitions</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Upload CSV file with event schemas
                </Typography>
              </Box>
              <Tooltip title="Download">
                <span>
                  <Button
                    size="small"
                    onClick={handleDownloadEvents}
                    disabled={!hasEvents}
                    sx={{ minWidth: 'auto', p: 1 }}
                    data-testid="download-events-button"
                    aria-label="Download event definitions"
                  >
                    <Download size={16} />
                  </Button>
                </span>
              </Tooltip>
            </Box>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setEventFile(e.target.files[0])}
                style={{ display: 'none' }}
                id="event-file-input"
                data-testid="event-file-input"
              />
              <label htmlFor="event-file-input">
                <Button
                  component="span"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ justifyContent: 'flex-start', py: 1.5, textAlign: 'left' }}
                >
                  {eventFile ? eventFile.name : 'Choose CSV file...'}
                </Button>
              </label>
            </Box>
            <Button 
              onClick={handleUploadEvents} 
              disabled={!eventFile || uploading}
              variant="contained"
              fullWidth
              size="small"
              startIcon={<Upload size={16} />}
              data-testid="upload-events-button"
            >
              Upload Events
            </Button>
          </CardContent>
        </Card>

        {/* Event Data - Excel */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileSpreadsheet size={20} color="#4CAF50" />
                  <Typography variant="h5">Event Data (Excel)</Typography>
                </Box>
                <Tooltip title="View data">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => { if (typeof onViewEvent === 'function' && selectedEvent) onViewEvent(selectedEvent); }}
                      disabled={!(selectedEvent && eventDataSummary.some(it => it.event_name === selectedEvent && (it.row_count || 0) > 0))}
                      data-testid="view-event-data-button"
                      sx={{ color: '#5B5FED' }}
                      aria-label="View event data"
                    >
                      <Eye size={16} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Excel file with event data (each sheet = one event)
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setExcelDataFile(e.target.files[0])}
                style={{ display: 'none' }}
                id="excel-data-file-input"
                data-testid="excel-data-file-input"
              />
              <label htmlFor="excel-data-file-input">
                <Button
                  component="span"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ justifyContent: 'flex-start', py: 1.5, textAlign: 'left' }}
                >
                  {excelDataFile ? excelDataFile.name : 'Choose Excel file...'}
                </Button>
              </label>
            </Box>
            {excelDataFile && (
              <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CheckCircle size={12} />
                {excelDataFile.name}
              </Typography>
            )}
            <Button 
              onClick={handleUploadExcelData} 
              disabled={!excelDataFile || uploading}
              variant="contained"
              fullWidth
              size="small"
              startIcon={<Upload size={16} />}
              data-testid="upload-excel-data-button"
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#388E3C' },
              }}
            >
              Upload Excel Data
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Instructions */}
      <Card sx={{ mt: 3, bgcolor: '#EEF0FE', border: '1px solid #D4D6FA' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: '#5B5FED' }}>Upload Instructions</Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1, fontSize: '0.8125rem', color: '#495057', lineHeight: 1.6 } }}>
            <li><strong>Event Definitions (CSV):</strong> Columns: EventName, EventField, DataType, EventType</li>
            <li><strong>Event Data (Excel):</strong> Sheet name must match event name</li>
            <li><strong>Required Columns:</strong> PostingDate, EffectiveDate, InstrumentId + event fields</li>
            <li><strong>DSL Functions:</strong> 100+ pre-loaded financial functions available</li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileUploadPanel;