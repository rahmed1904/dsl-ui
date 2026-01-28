import React, { useState } from "react";
import { Card, CardContent, Button, IconButton, Box } from '@mui/material';
import { Play, FileText, Clock, Trash2 } from "lucide-react";

const TemplatesPanel = ({ templates, onLoadTemplate, onRunTemplate, onDeleteTemplate, selectedEvent }) => {
  const [deletingIds, setDeletingIds] = useState(new Set());
  return (
    <div className="p-6 bg-slate-50" data-testid="templates-panel">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Manrope' }}>Saved Templates</h2>
        <p className="text-sm text-slate-600">Load and execute your saved DSL templates</p>
      </div>

      {templates.length === 0 ? (
        <Card sx={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 6 }}>
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Templates Yet</h3>
            <p className="text-sm text-slate-500">Save your DSL code to create reusable templates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              sx={{ 
                border: '1px solid #e2e8f0', 
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 3 }
              }} 
              data-testid={`template-${template.id}`}
            >
              <CardContent sx={{ p: 3 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>{template.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton
                      size="small"
                      sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                      data-testid={`deploy-template-${template.id}`}
                      title="Deploy as Model"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M4 20l4-4a7 7 0 0 1 8-8l4-4-4 4a7 7 0 0 1-8 8l-4 4z" />
                        <path d="M9 13l3 3 3-3" />
                        <path d="M12 16v-6" />
                      </svg>
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const confirmed = window.confirm(`Are you sure you want to delete template "${template.name}"?`);
                        if (!confirmed) return;

                        try {
                          setDeletingIds(prev => new Set(prev).add(template.id));
                          if (typeof onDeleteTemplate === 'function') {
                            await onDeleteTemplate(template.id, template.name);
                          } else {
                            console.error('onDeleteTemplate not provided');
                          }
                        } catch (err) {
                          console.error('Error invoking onDeleteTemplate', err);
                        } finally {
                          setDeletingIds(prev => {
                            const copy = new Set(prev);
                            copy.delete(template.id);
                            return copy;
                          });
                        }
                      }}
                      sx={{ color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}
                      data-testid={`delete-template-${template.id}`}
                      title={`Delete template ${template.name}`}
                      disabled={deletingIds.has(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>

                <Box sx={{ mb: 2 }}>
                  <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-100 overflow-auto max-h-32">
                    {template.dsl_code}
                  </div>
                </Box>

                <div className="flex gap-2">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => onLoadTemplate(template)}
                    sx={{ flex: 1 }}
                    startIcon={<FileText className="w-4 h-4" />}
                    data-testid={`load-template-${template.id}`}
                  >
                    Load
                  </Button>
                  <Button 
                    variant="contained"
                    size="small" 
                    onClick={() => onRunTemplate(template.id)}
                    disabled={!selectedEvent}
                    sx={{ flex: 1 }}
                    startIcon={<Play className="w-4 h-4" />}
                    data-testid={`run-template-${template.id}`}
                  >
                    Run
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPanel;