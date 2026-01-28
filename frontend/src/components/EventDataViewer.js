import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { X, Database, Table, Download } from "lucide-react";
import { Button, IconButton, Chip, Box } from '@mui/material';

const API = '/api';

const EventDataViewer = ({ onClose }) => {
  const [eventDataSummary, setEventDataSummary] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadEventDataSummary();
  }, []);

  const loadEventDataSummary = async () => {
    try {
      const response = await axios.get(`${API}/event-data`);
      setEventDataSummary(response.data);
    } catch (error) {
      console.error("Error loading event data summary:", error);
    }
  };

  const loadEventData = async (eventName) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/event-data/${eventName}`);
      setEventData(response.data);
      setSelectedEvent(eventName);
    } catch (error) {
      toast.error("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const downloadEventData = async (eventName) => {
    try {
      const response = await axios.get(`${API}/event-data/download/${eventName}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${eventName}_data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded successfully");
    } catch (error) {
      toast.error("Failed to download");
    }
  };

  const getColumnHeaders = () => {
    if (!eventData || !eventData.data_rows || eventData.data_rows.length === 0) return [];
    return Object.keys(eventData.data_rows[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="event-data-viewer">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Manrope' }}>
                Event Data Viewer
              </h2>
              <p className="text-sm text-slate-600">View uploaded event data by event type</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton onClick={onClose} data-testid="close-data-viewer">
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Event List */}
          <div className="w-64 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Events with Data</h3>
            </div>
            
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {eventDataSummary.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No event data uploaded yet</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {eventDataSummary.map((item) => (
                    <div
                      key={item.event_name}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedEvent === item.event_name 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-slate-100'
                      }`}
                      onClick={() => loadEventData(item.event_name)}
                      data-testid={`event-data-item-${item.event_name}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-slate-800">{item.event_name}</span>
                        <Chip
                          label={`${item.row_count} rows`}
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Box>
          </div>

          {/* Right Panel - Data Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!selectedEvent ? (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Table className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Select an Event</p>
                  <p className="text-sm mt-1">Click on an event to view its data</p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                {/* Data Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedEvent}</h3>
                    <p className="text-xs text-slate-600">
                      {eventData?.data_rows?.length || 0} rows × {getColumnHeaders().length} columns
                    </p>
                  </div>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => downloadEventData(selectedEvent)}
                    startIcon={<Download className="w-4 h-4" />}
                    data-testid="download-event-data"
                  >
                    Download CSV
                  </Button>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-auto p-4">
                  {eventData?.data_rows?.length > 0 ? (
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 px-2 py-1.5 text-left font-semibold text-slate-700 sticky top-0 bg-slate-100">
                            #
                          </th>
                          {getColumnHeaders().map((header, idx) => (
                            <th 
                              key={idx} 
                              className="border border-slate-300 px-2 py-1.5 text-left font-semibold text-slate-700 sticky top-0 bg-slate-100 whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {eventData.data_rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="border border-slate-200 px-2 py-1 text-slate-500 font-mono">
                              {rowIdx + 1}
                            </td>
                            {getColumnHeaders().map((header, colIdx) => (
                              <td 
                                key={colIdx} 
                                className="border border-slate-200 px-2 py-1 text-slate-700 whitespace-nowrap"
                              >
                                {row[header]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>No data rows found for this event</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDataViewer;