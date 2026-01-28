import React, { useState } from "react";
import { Card, CardContent, Button, IconButton, Box, Typography, Chip } from '@mui/material';
import { Play, FileText, Clock, Trash2 } from "lucide-react";

const TemplatesPanel = ({ templates, onLoadTemplate, onRunTemplate, onDeleteTemplate, selectedEvent }) => {
  const [deletingIds, setDeletingIds] = useState(new Set());
  
  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100%' }} data-testid="templates-panel">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>Saved Templates</Typography>
        <Typography variant="body2" color="text.secondary">Load and execute your saved DSL templates</Typography>
      </Box>

      {templates.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <FileText size={48} color="#CED4DA" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>No Templates Yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Save your DSL code to create reusable templates
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {templates.map((template) => (
            <Card 
              key={template.id}
              data-testid={`template-${template.id}`}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{template.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={12} color="#6C757D" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(template.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const confirmed = window.confirm(`Delete template "${template.name}"?`);
                      if (!confirmed) return;

                      try {
                        setDeletingIds(prev => new Set(prev).add(template.id));
                        await onDeleteTemplate(template.id, template.name);
                      } catch (err) {
                        console.error('Error deleting template', err);
                      } finally {
                        setDeletingIds(prev => {
                          const copy = new Set(prev);
                          copy.delete(template.id);
                          return copy;
                        });
                      }
                    }}
                    sx={{ color: '#DC3545' }}
                    data-testid={`delete-template-${template.id}`}
                    disabled={deletingIds.has(template.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>

                <Box sx={{ 
                  bgcolor: '#212529', 
                  borderRadius: 1, 
                  p: 1.5, 
                  mb: 2,
                  maxHeight: 120,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#F8F9FA',
                  lineHeight: 1.5
                }}>
                  {template.dsl_code}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => onLoadTemplate(template)}
                    sx={{ flex: 1 }}
                    startIcon={<FileText size={16} />}
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
                    startIcon={<Play size={16} />}
                    data-testid={`run-template-${template.id}`}
                  >
                    Run
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TemplatesPanel;
