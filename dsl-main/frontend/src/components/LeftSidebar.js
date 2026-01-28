import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Code2, RefreshCw, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const FYNTRAC_LOGO = "/logo.png";

const LeftSidebar = ({ events, selectedEvent, onEventSelect, onDownloadEvents, onSignOut }) => {
  const [expandedEvent, setExpandedEvent] = React.useState(null);

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

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Event Configuration Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Manrope' }}>
              <RefreshCw className="w-4 h-4 inline-block mr-2 text-blue-600" />
              Event Configuration
            </h3>
            <Button
              variant="solid"
              size="sm"
              onClick={() => toast('Coming soon')}
              className="w-full py-2 text-sm rounded-md bg-blue-100 text-slate-600 border border-transparent shadow-sm hover:bg-blue-200"
              data-testid="import-events-button"
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
                      className={`p-0 overflow-hidden transition-colors duration-200 ${selectedEvent === event.event_name ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
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

                      <div className={`px-3 transition-[max-height] duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 py-3' : 'max-h-0'}`}>
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
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Sign Out Button at Bottom */}
      <div className="p-4 border-t border-slate-200">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSignOut}
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
          data-testid="signout-button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
