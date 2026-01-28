import React from "react";
import { Box, Button, Card, CardContent, Collapse } from '@mui/material';
import { FileText, Code2, RefreshCw, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "./ToastProvider";

const FYNTRAC_LOGO = "/logo.png";

const LeftSidebar = ({ events, selectedEvent, onEventSelect, onDownloadEvents, onSignOut }) => {
  const [expandedEvent, setExpandedEvent] = React.useState(null);
  const toast = useToast();

  const toggleExpand = (eventName) => {
    setExpandedEvent(prev => (prev === eventName ? null : eventName));
  };

  return (
    <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col" data-testid="left-sidebar">
      <div className="p-4 border-b border-slate-200 flex justify-center">
        <img
          src={process.env.PUBLIC_URL + '/logo.png'}
          alt="Fyntrac"
          className="h-14 w-auto object-contain mx-auto"
          data-testid="sidebar-logo"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://customer-assets.emergentagent.com/job_code-finance-2/artifacts/hdj19r3w_Fyntrac%20%28600%20x%20400%20px%29%20%284%29.png'; }}
        />
      </div>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <div className="p-6 space-y-6">
          {/* Event Configuration Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Manrope' }}>
              <RefreshCw className="w-4 h-4 inline-block mr-2 text-blue-600" />
              Event Configuration
            </h3>
            <Button
              variant="contained"
              size="small"
              onClick={() => toast.info('Coming soon')}
              fullWidth
              data-testid="import-events-button"
              sx={{
                py: 1,
                fontSize: '0.875rem',
                bgcolor: '#dbeafe',
                color: '#475569',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#bfdbfe',
                  boxShadow: 'none',
                },
              }}
            >
              Import
            </Button>
          </div>

          {/* Events Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-700" style={{ fontFamily: 'Manrope' }}>Events</h3>
            </div>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500">No events uploaded yet</p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => {
                  const isExpanded = expandedEvent === event.event_name;
                  return (
                    <Card 
                      key={event.id}
                      sx={{
                        p: 0,
                        borderRadius: 2,
                        border: selectedEvent === event.event_name ? '1px solid #2563eb' : '1px solid #e2e8f0',
                        bgcolor: selectedEvent === event.event_name ? '#eff6ff' : 'white',
                        transition: 'all 0.2s',
                      }}
                      data-testid={`event-${event.event_name}`}
                    >
                      <button
                        className={`w-full text-left p-3 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}
                        onClick={() => { toggleExpand(event.event_name); onEventSelect && onEventSelect(event.event_name); }}
                        aria-expanded={isExpanded}
                      >
                        <div className="font-medium text-sm text-slate-900">{event.event_name}</div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <Collapse in={isExpanded} timeout="auto">
                        <div className="px-3 py-3">
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600 break-all">
                              <span className="font-mono text-[11px] text-blue-600">• postingdate</span>
                              <span className="ml-1 text-slate-400">(date)</span>
                            </div>
                            <div className="text-xs text-slate-600 break-all">
                              <span className="font-mono text-[11px] text-blue-600">• effectivedate</span>
                              <span className="ml-1 text-slate-400">(date)</span>
                            </div>
                            <div className="text-xs text-slate-600 break-all">
                              <span className="font-mono text-[11px] text-blue-600">• subinstrumentid</span>
                              <span className="ml-1 text-slate-400">(string)</span>
                            </div>
                            {event.fields.map((field, idx) => (
                              <div key={idx} className="text-xs text-slate-600 break-all flex justify-between">
                                <span className="font-mono text-[11px]">{field.name}</span>
                                <span className="ml-1 text-slate-400">{`(${field.datatype})`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Collapse>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Box>

      {/* Sign Out Button at Bottom */}
      <div className="p-4 border-t border-slate-200">
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onSignOut}
          fullWidth
          startIcon={<LogOut className="w-4 h-4" />}
          data-testid="signout-button"
          sx={{
            justifyContent: 'flex-start',
            color: '#475569',
            borderColor: '#e2e8f0',
            '&:hover': {
              color: '#dc2626',
              borderColor: '#fecaca',
              bgcolor: '#fef2f2',
            },
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;