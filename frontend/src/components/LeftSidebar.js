import React from "react";
import { Box, Button, Card, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FileText, Code2, RefreshCw, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "./ToastProvider";

const FYNTRAC_LOGO = "/logo.png";

const LeftSidebar = ({ events, selectedEvent, onEventSelect, onDownloadEvents, onSignOut }) => {
  const [expandedEvent, setExpandedEvent] = React.useState(null);
  const toast = useToast();

  const toggleExpand = (eventName) => {
    setExpandedEvent(prev => (prev === eventName ? null : eventName));
  };

  return (
    <Box 
      sx={{ 
        width: 280, 
        bgcolor: '#FFFFFF', 
        borderRight: '1px solid #E9ECEF', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh'
      }} 
      data-testid="left-sidebar"
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF', display: 'flex', justifyContent: 'center' }}>
        <img
          src={process.env.PUBLIC_URL + '/logo.png'}
          alt="Fyntrac"
          style={{ height: 40, objectFit: 'contain' }}
          data-testid="sidebar-logo"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://customer-assets.emergentagent.com/job_code-finance-2/artifacts/hdj19r3w_Fyntrac%20%28600%20x%20400%20px%29%20%284%29.png'; }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Card sx={{ bgcolor: '#EEF0FE', border: '1px solid #D4D6FA', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <RefreshCw size={16} color="#5B5FED" />
              <Box component="span" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#212529' }}>
                Event Configuration
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => toast.info('Coming soon')}
              fullWidth
              data-testid="import-events-button"
              sx={{
                fontSize: '0.8125rem',
                borderColor: '#5B5FED',
                color: '#5B5FED',
                '&:hover': {
                  borderColor: '#4346C8',
                  bgcolor: '#F8F9FE',
                },
              }}
            >
              Import
            </Button>
          </Card>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 1 }}>
            <FileText size={16} color="#5B5FED" />
            <Box component="span" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#495057' }}>Events</Box>
          </Box>
          {events.length === 0 ? (
            <Box sx={{ px: 1, py: 2 }}>
              <Box component="p" sx={{ fontSize: '0.75rem', color: '#6C757D', m: 0 }}>No events uploaded yet</Box>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {events.map((event) => {
                const isExpanded = expandedEvent === event.event_name;
                const isSelected = selectedEvent === event.event_name;
                return (
                  <Box key={event.id} sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => { toggleExpand(event.event_name); onEventSelect && onEventSelect(event.event_name); }}
                      selected={isSelected}
                      data-testid={`event-${event.event_name}`}
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        px: 1.5,
                        '&.Mui-selected': {
                          bgcolor: '#EEF0FE',
                          '&:hover': {
                            bgcolor: '#E0E2FD',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={event.event_name} 
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem', 
                          fontWeight: isSelected ? 600 : 500,
                          color: '#495057'
                        }}
                      />
                    </ListItemButton>

                    <Collapse in={isExpanded} timeout="auto">
                      <Box sx={{ pl: 5, pr: 1.5, py: 1.5 }}>
                        <Box sx={{ fontSize: '0.75rem', color: '#6C757D', lineHeight: 1.6 }}>
                          {(() => {
                            const evtType = (event.eventType || event.event_type || '').toString().toLowerCase();
                            const showStandard = evtType !== 'reference';
                            return (
                              <>
                                {showStandard && (
                                  <>
                                    <Box sx={{ mb: 0.5 }}>
                                      <Box component="span" sx={{ fontFamily: 'monospace', color: '#5B5FED', fontWeight: 500 }}>• postingdate</Box>
                                      <Box component="span" sx={{ color: '#ADB5BD', ml: 0.5 }}>(date)</Box>
                                    </Box>
                                    <Box sx={{ mb: 0.5 }}>
                                      <Box component="span" sx={{ fontFamily: 'monospace', color: '#5B5FED', fontWeight: 500 }}>• effectivedate</Box>
                                      <Box component="span" sx={{ color: '#ADB5BD', ml: 0.5 }}>(date)</Box>
                                    </Box>
                                    <Box sx={{ mb: 0.5 }}>
                                      <Box component="span" sx={{ fontFamily: 'monospace', color: '#5B5FED', fontWeight: 500 }}>• subinstrumentid</Box>
                                      <Box component="span" sx={{ color: '#ADB5BD', ml: 0.5 }}>(string)</Box>
                                    </Box>
                                  </>
                                )}

                                {event.fields.map((field, idx) => (
                                  <Box key={idx} sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                                    <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{field.name}</Box>
                                    <Box component="span" sx={{ color: '#ADB5BD' }}>({field.datatype})</Box>
                                  </Box>
                                ))}
                              </>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </List>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #E9ECEF' }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onSignOut}
          fullWidth
          startIcon={<LogOut size={16} />}
          data-testid="signout-button"
          sx={{
            justifyContent: 'flex-start',
            color: '#6C757D',
            borderColor: '#CED4DA',
            '&:hover': {
              color: '#DC3545',
              borderColor: '#F8D7DA',
              bgcolor: '#FFF5F6',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default LeftSidebar;