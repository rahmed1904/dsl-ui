import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Upload, FileText, Code, Play, List, BookOpen, Download, Sparkles, Trash2, BarChart3, Search as SearchIcon, Lightbulb, Settings, ChevronDown, Brackets, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Editor from "@monaco-editor/react";
import FileUploadPanel from "../components/FileUploadPanel";
import LeftSidebar from "../components/LeftSidebar";
import ChatAssistant from "../components/ChatAssistant";
import ConsoleOutput from "../components/ConsoleOutput";
import TemplatesPanel from "../components/TemplatesPanel";
import TransactionReports from "../components/TransactionReports";
import FunctionBrowser from "../components/FunctionBrowser";
import DSLExamples from "../components/DSLExamples";
import CustomFunctionBuilder from "../components/CustomFunctionBuilder";
import EventDataViewer from "../components/EventDataViewer";

// API URL - use relative path since setupProxy.js handles the forwarding
const API = '/api';

console.log('[Dashboard] Using API:', API);

const Dashboard = ({ onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [dslFunctions, setDslFunctions] = useState([]);
  const [dslCode, setDslCode] = useState(() => {
    try {
      const saved = localStorage.getItem('dslCode');
      return saved || "## Welcome to Fyntac DSL Code Editor ##";
    } catch (e) {
      return "## Welcome to Fyntac DSL Code Editor ##";
    }
  });
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [transactionReports, setTransactionReports] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  // Chat assistant is fixed and always visible
  const [showFunctionBrowser, setShowFunctionBrowser] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showCustomFunctionBuilder, setShowCustomFunctionBuilder] = useState(false);
  const [showEventDataViewer, setShowEventDataViewer] = useState(false);
  const settingsRef = useRef(null);
  const chatAssistantRef = useRef(null);

  useEffect(() => {
    console.log('[useEffect] Loading initial data');
    loadEvents();
    loadDslFunctions();
    loadTemplates();
    loadTransactionReports();
  }, []);

  // Persist DSL editor content to localStorage whenever it changes
  useEffect(() => {
    try {
      if (dslCode && dslCode.length > 0) {
        localStorage.setItem('dslCode', dslCode);
      } else {
        localStorage.removeItem('dslCode');
      }
    } catch (e) {
      // ignore
    }
  }, [dslCode]);

  // Close settings menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
      if (response.data.length > 0 && !selectedEvent) {
        setSelectedEvent(response.data[0].event_name);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const loadDslFunctions = async () => {
    console.log('[loadDslFunctions] Starting to load functions from:', `${API}/dsl-functions`);
    try {
      const response = await axios.get(`${API}/dsl-functions`);
      console.log('[loadDslFunctions] Received', response.data.length, 'functions');
      console.log('[loadDslFunctions] Response data:', response.data.slice(0, 3));
      setDslFunctions(response.data);
      console.log('[loadDslFunctions] State updated with', response.data.length, 'functions');
    } catch (error) {
      console.error("Error loading DSL functions:", error);
      console.error('[loadDslFunctions] Error details:', error.response?.status, error.response?.data);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const loadTransactionReports = async () => {
    try {
      const response = await axios.get(`${API}/transaction-reports`);
      setTransactionReports(response.data);
    } catch (error) {
      console.error("Error loading transaction reports:", error);
    }
  };

  const addConsoleLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev, { timestamp, message, type }]);
  };

  const handleLoadSampleData = async () => {
    try {
      addConsoleLog("Loading sample data...", "info");
      const response = await axios.post(`${API}/load-sample-data`);
      
      addConsoleLog(`✓ Sample data loaded successfully!`, "success");
      addConsoleLog(`Events: ${response.data.events.join(", ")}`, "info");
      
      // Set the sample DSL code
      if (response.data.sample_dsl_code) {
        setDslCode(response.data.sample_dsl_code);
      }
      
      // Reload data
      await loadEvents();
      await loadDslFunctions();
      
      toast.success("Sample data loaded! Ready to test.");
    } catch (error) {
      addConsoleLog(`✗ Error loading sample data: ${error.message}`, "error");
      toast.error("Failed to load sample data");
    }
  };

  const handleClearAllData = async () => {
    const confirmed = window.confirm("Are you sure you want to clear all data? This will delete all events, DSL functions, event data, and templates. This action cannot be undone.");
    if (!confirmed) return;

    try {
      addConsoleLog("Clearing all data...", "info");
      const response = await axios.delete(`${API}/clear-all-data`);
      
      addConsoleLog(`✓ ${response.data.message}`, "success");
      
      // Reset UI state
      setEvents([]);
      setDslFunctions([]);
      setTemplates([]);
      setTransactionReports([]);
      setSelectedEvent("");
      // Clear the editor instead of injecting sample placeholder after clearing data
      setDslCode('');

      // Also clear persisted editor and chat data so hard-refresh no longer restores them
      try {
        localStorage.removeItem('dslCode');
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('chatSessionId');
      } catch (e) {
        // ignore
      }

      // Reload from backend to ensure UI is in sync
      await loadDslFunctions();
      await loadTemplates();
      await loadTransactionReports();

      toast.success("All data cleared! Fresh environment ready.");
    } catch (error) {
      addConsoleLog(`✗ Error clearing data: ${error.message}`, "error");
      toast.error("Failed to clear data");
    }
  };

  const handleDownloadEvents = async () => {
    try {
      const response = await axios.get(`${API}/events/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event_definitions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Event definitions downloaded!");
    } catch (error) {
      toast.error("Failed to download events");
    }
  };

  const handleDownloadEventData = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }
    
    try {
      const response = await axios.get(`${API}/event-data/download/${selectedEvent}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedEvent}_data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Event data downloaded!");
    } catch (error) {
      toast.error("Failed to download event data");
    }
  };

  const handleValidateDSL = async () => {
    try {
      addConsoleLog("Validating DSL code...", "info");
      const response = await axios.post(`${API}/dsl/validate`, {
        dsl_code: dslCode
      });
      
      if (response.data.valid) {
        addConsoleLog("✓ DSL code is valid!", "success");
        toast.success("DSL code is valid!");
      } else {
        const errMsg = response.data.message || response.data.error || "Validation failed";
        addConsoleLog(`✗ Validation error: ${errMsg}`, "error");
        toast.error(`Validation failed: ${errMsg}`);
      }
    } catch (error) {
      addConsoleLog(`✗ Error: ${error.message}`, "error");
      toast.error("Validation failed");
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }
    
    const templateName = prompt("Enter template name:");
    if (!templateName) return;

    try {
      // Check if template name already exists
      const checkResponse = await axios.get(`${API}/templates/check-name/${encodeURIComponent(templateName)}`);
      
      let shouldReplace = false;
      if (checkResponse.data.exists) {
        shouldReplace = window.confirm(`A template named "${templateName}" already exists. Do you want to replace it?`);
        if (!shouldReplace) {
          toast.info("Template save cancelled");
          return;
        }
      }

      addConsoleLog(`Saving template '${templateName}'${shouldReplace ? ' (replacing existing)' : ''}...`, "info");
      const response = await axios.post(
        `${API}/templates`,
        {
          name: templateName,
          dsl_code: dslCode,
          event_name: selectedEvent,
          replace: shouldReplace
        }
      );
      addConsoleLog(`✓ Template ${shouldReplace ? 'replaced' : 'saved'} successfully!`, "success");
      toast.success(shouldReplace ? "Template replaced!" : "Template saved!");
      loadTemplates();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      addConsoleLog(`✗ Error saving template: ${errorMsg}`, "error");
      toast.error("Failed to save template");
    }
  };

  const handleRunTemplate = async (templateId) => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }

    try {
      addConsoleLog("Executing template on event data...", "info");
      const response = await axios.post(`${API}/templates/execute`, {
        template_id: templateId,
        event_name: selectedEvent
      });
      
      addConsoleLog(`✓ Execution completed! Generated ${response.data.transactions.length} transactions`, "success");
      addConsoleLog(`Report ID: ${response.data.report_id}`, "info");
      addConsoleLog(JSON.stringify(response.data.transactions, null, 2), "result");
      toast.success(`Generated ${response.data.transactions.length} transactions`);
      
      // Reload transaction reports
      loadTransactionReports();
    } catch (error) {
      addConsoleLog(`✗ Execution error: ${error.response?.data?.detail || error.message}`, "error");
      toast.error("Execution failed");
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await axios.get(`${API}/transaction-reports/download/${reportId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers['content-disposition']?.split('filename=')[1] || 'transactions.csv';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Transaction report downloaded!");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const handleDeleteReport = async (reportId, reportName) => {
    const confirmed = window.confirm(`Are you sure you want to delete report "${reportName}"?`);
    if (!confirmed) return;

    try {
      addConsoleLog(`Deleting report '${reportName}'...`, "info");
      await axios.delete(`${API}/transaction-reports/${reportId}`);
      
      addConsoleLog(`✓ Report deleted successfully!`, "success");
      toast.success("Report deleted!");
      loadTransactionReports();
    } catch (error) {
      addConsoleLog(`✗ Error deleting report: ${error.message}`, "error");
      toast.error("Failed to delete report");
    }
  };

  const handleDeleteTemplate = async (templateId, templateName) => {
    try {
      addConsoleLog(`Deleting template '${templateName}'...`, "info");
      await axios.delete(`${API}/templates/${templateId}`);
      
      addConsoleLog(`✓ Template deleted successfully!`, "success");
      toast.success("Template deleted!");
      loadTemplates();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      addConsoleLog(`✗ Error deleting template: ${errorMsg}`, "error");
      toast.error(`Failed to delete template: ${errorMsg}`);
      throw error; // rethrow so caller (TemplatesPanel) can handle state
    }
  };

  const handleLoadTemplate = (template) => {
    setDslCode(template.dsl_code);
    addConsoleLog(`Loaded template: ${template.name}`, "info");
    toast.success(`Loaded template: ${template.name}`);
  };

  const handleLoadExample = (exampleCode) => {
    setDslCode(exampleCode);
    addConsoleLog("Loaded DSL example", "info");
  };

  const handleInsertFunction = (functionCall) => {
    setDslCode(prev => prev + "\n" + functionCall);
  };

  const handleAskAIAboutFunction = (message) => {
    // Send message to chat
    if (chatAssistantRef.current && chatAssistantRef.current.sendMessage) {
      chatAssistantRef.current.sendMessage(message);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-x-hidden" data-testid="dashboard-container">
      {/* Left Sidebar */}
      <LeftSidebar 
        events={events} 
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
        onDownloadEvents={handleDownloadEvents}
        onSignOut={onSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope' }}>DSL Studio</h1>
              <p className="text-sm text-slate-600 mt-1">Design calculation logic using a Domain-Specific Language (DSL) that is intuitive for finance professionals</p>
            </div>
            <div className="flex gap-2">
              <div className="relative" ref={settingsRef}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFunctionBrowser(true)}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100"
                data-testid="browse-functions-button"
                title={`${dslFunctions.length} functions loaded`}
              >
                <SearchIcon className="w-4 h-4 mr-2 text-emerald-600" />
                Browse Functions ({dslFunctions.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCustomFunctionBuilder(true)}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:from-purple-100 hover:to-indigo-100"
                data-testid="custom-function-builder-button"
              >
                <Brackets className="w-4 h-4 mr-2 text-purple-600" />
                Build Function
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="border-slate-300"
                data-testid="settings-button"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50" data-testid="settings-menu">
                  <button
                    onClick={() => {
                      handleLoadSampleData();
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
                    data-testid="menu-sample-data"
                  >
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Test with Sample Data</span>
                  </button>
                  <button
                    onClick={() => {
                      handleClearAllData();
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2"
                    data-testid="menu-clear-data"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Clear All Data</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowEventDataViewer(true);
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-50 flex items-center gap-2"
                    data-testid="menu-view-data"
                  >
                    <Database className="w-4 h-4 text-cyan-600" />
                    <span>View Data</span>
                  </button>
                </div>
              )}
              {/* Chat assistant is fixed and always visible - toggled from assistant header (fixed) */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* Center - Editor and Console */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Tabs defaultValue="upload" className="flex-1 flex flex-col">
              <div className="bg-white border-b border-slate-200 px-6">
                <TabsList>
                  <TabsTrigger value="upload" data-testid="upload-tab">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Data
                  </TabsTrigger>
                  <TabsTrigger value="editor" data-testid="editor-tab">
                    <Code className="w-4 h-4 mr-2" />
                    DSL Editor
                  </TabsTrigger>
                  <TabsTrigger value="templates" data-testid="templates-tab">
                    <List className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="reports" data-testid="reports-tab">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Transaction Reports
                  </TabsTrigger>
                  <TabsTrigger value="examples" data-testid="examples-tab">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Examples
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upload" className="flex-1 m-0">
                <FileUploadPanel 
                  onUploadSuccess={loadEvents} 
                  events={events}
                  addConsoleLog={addConsoleLog}
                />
              </TabsContent>

              <TabsContent value="editor" className="flex-1 m-0 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 bg-[#0A0A0A] min-w-0" data-testid="dsl-editor">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    value={dslCode}
                    onChange={(value) => setDslCode(value || "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      minimap: { enabled: false },
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      // Keep editor lines wrapped so editor does not expand horizontally
                      wordWrap: "on",
                      tabSize: 2,
                      insertSpaces: true,
                      renderWhitespace: "none",
                      cursorStyle: "line",
                      cursorBlinking: "blink",
                      fixedOverflowWidgets: true,
                    }}
                    beforeMount={(monaco) => {
                      // Register DSL language completions
                      monaco.languages.registerCompletionItemProvider('python', {
                        provideCompletionItems: (model, position) => {
                          const suggestions = [];

                          // 1) DSL functions (from backend + custom). Show as functions.
                          const existingNames = new Set();
                          dslFunctions.forEach(func => {
                            existingNames.add(func.name);
                            suggestions.push({
                              label: func.name,
                              kind: monaco.languages.CompletionItemKind.Function,
                              insertText: `${func.name}()`,
                              detail: func.params || '',
                              documentation: func.description || ''
                            });
                          });

                          // 1b) Also include known helper functions that may not be present
                          // in the backend metadata (schedule-local helpers, runtime helpers, etc.)
                          const helperFunctions = [
                            { name: 'lag', params: "col, offset, default", description: 'Get previous row value in schedule' },
                            { name: 'schedule', params: 'period_def, columns, context?', description: 'Generate a schedule of periods and computed columns' },
                            { name: 'schedule_sum', params: 'sched, col', description: 'Sum a schedule column' },
                            { name: 'schedule_first', params: 'sched, col', description: 'First value of schedule column' },
                            { name: 'schedule_last', params: 'sched, col', description: 'Last value of schedule column' },
                            { name: 'period', params: 'start, end, freq, convention?', description: 'Create a period definition' },
                            { name: 'print', params: 'value', description: 'Print value to console' },
                            { name: 'collect', params: 'EVENT.field', description: 'Collect values for current instrument/postingdate' },
                            { name: 'for_each', params: 'dates_arr, amounts_arr, date_var, amount_var, expression', description: 'Iterate paired arrays and evaluate expression' },
                            { name: 'map_array', params: 'array, var_name, expression, context?', description: 'Transform array elements' },
                            { name: 'sum_vals', params: 'array', description: 'Sum numeric values in array' }
                          ];

                          helperFunctions.forEach(h => {
                            if (!existingNames.has(h.name)) {
                              existingNames.add(h.name);
                              suggestions.push({
                                label: h.name,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: `${h.name}()`,
                                detail: h.params,
                                documentation: h.description
                              });
                            }
                          });

                          // 2) Event fields: include both fully-qualified (EVENT.FIELD) and bare field names
                          events.forEach(event => {
                            // standard fields
                            ['postingdate', 'effectivedate', 'subinstrumentid'].forEach(sf => {
                              suggestions.push({
                                label: `${event.event_name}.${sf}`,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: `${event.event_name}.${sf}`,
                                detail: '(date)',
                                documentation: `Field from ${event.event_name}`
                              });
                              suggestions.push({
                                label: sf,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: sf,
                                detail: '(date)',
                                documentation: `Standard event field (from ${event.event_name})`
                              });
                            });

                            // event-specific fields
                            event.fields.forEach(field => {
                              suggestions.push({
                                label: `${event.event_name}.${field.name}`,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: `${event.event_name}.${field.name}`,
                                detail: `(${field.datatype})`,
                                documentation: `Event field from ${event.event_name}`
                              });
                              suggestions.push({
                                label: field.name,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: field.name,
                                detail: `(${field.datatype})`,
                                documentation: `Field from ${event.event_name}`
                              });
                            });
                          });

                          // 3) Variables currently defined in the editor
                          try {
                            const code = model.getValue();
                            // Find simple assignment targets: var_name =
                            const assignRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=.*$/gm;
                            const found = new Set();
                            let m;
                            while ((m = assignRegex.exec(code)) !== null) {
                              const name = m[1];
                              if (!found.has(name)) {
                                found.add(name);
                                suggestions.push({
                                  label: name,
                                  kind: monaco.languages.CompletionItemKind.Variable,
                                  insertText: name,
                                  detail: 'User-defined variable',
                                  documentation: 'Variable defined in editor'
                                });
                              }
                            }
                          } catch (e) {
                            // ignore parsing errors
                          }

                          // Only include the three categories above. Return suggestions.
                          return { suggestions };
                        }
                      });
                    }}
                  />
                  </div>
                  <ConsoleOutput 
                  output={consoleOutput} 
                  onClear={() => setConsoleOutput([])} 
                  dslCode={dslCode}
                  addConsoleLog={addConsoleLog}
                  onCodeChange={setDslCode}
                  events={events}
                  handleSaveTemplate={handleSaveTemplate}
                />
              </TabsContent>

              <TabsContent value="templates" className="flex-1 m-0">
                <TemplatesPanel 
                  templates={templates}
                  onLoadTemplate={handleLoadTemplate}
                  onRunTemplate={handleRunTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  selectedEvent={selectedEvent}
                />
              </TabsContent>

              <TabsContent value="reports" className="flex-1 m-0">
                <TransactionReports 
                  reports={transactionReports}
                  onDownloadReport={handleDownloadReport}
                  onDeleteReport={handleDeleteReport}
                />
              </TabsContent>

              <TabsContent value="examples" className="flex-1 m-0">
                <DSLExamples onLoadExample={handleLoadExample} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Chat Assistant */}
          <div className="flex-shrink-0">
            <ChatAssistant 
              ref={chatAssistantRef}
              dslFunctions={dslFunctions} 
              events={events}
              onInsertCode={(code) => setDslCode(prev => prev + "\n" + code)}
              onOverwriteCode={(code) => setDslCode(code)}
              editorCode={dslCode}
              consoleOutput={consoleOutput}
            />
          </div>
        </div>
      </div>

      {/* Function Browser Modal */}
      {showFunctionBrowser && (
        <FunctionBrowser 
          dslFunctions={dslFunctions}
          onInsertFunction={handleInsertFunction}
          onClose={() => setShowFunctionBrowser(false)}
          onAskAI={handleAskAIAboutFunction}
        />
      )}

      {/* Custom Function Builder Modal */}
      {showCustomFunctionBuilder && (
        <CustomFunctionBuilder 
          onClose={() => setShowCustomFunctionBuilder(false)}
          onFunctionSaved={loadDslFunctions}
        />
      )}

      {/* Event Data Viewer Modal */}
      {showEventDataViewer && (
        <EventDataViewer 
          onClose={() => setShowEventDataViewer(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
