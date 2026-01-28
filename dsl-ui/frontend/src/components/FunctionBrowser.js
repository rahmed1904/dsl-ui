import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, Card, CardContent, Button, TextField, IconButton, InputAdornment, Chip, Box } from '@mui/material';
import { Search, BookOpen, Copy, X, Sparkles, Zap } from "lucide-react";
import { useToast } from "./ToastProvider";

const FunctionBrowser = ({ dslFunctions, onInsertFunction, onClose, onAskAI }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const toast = useToast();

  console.log('[FunctionBrowser] Received dslFunctions:', dslFunctions.length, 'items');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(dslFunctions.map(f => f.category))];
    return cats.filter(Boolean);
  }, [dslFunctions]);

  // Count custom functions
  const customCount = useMemo(() => {
    return dslFunctions.filter(f => f.is_custom).length;
  }, [dslFunctions]);

  // Filter functions based on search and category
  const filteredFunctions = useMemo(() => {
    return dslFunctions.filter(func => {
      const matchesSearch = !searchQuery || 
        func.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        func.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        func.params.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || func.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [dslFunctions, searchQuery, selectedCategory]);

  const handleCopyFunction = (func) => {
    const functionCall = `${func.name}(${func.params})`;
    navigator.clipboard.writeText(functionCall);
    toast.success(`Copied: ${functionCall}`);
  };

  const handleAskAI = (func) => {
    if (!onAskAI) return;
    
    const prompt = `Explain how the **${func.name}** function works with a detailed example.

  **Function:** ${func.name}(${func.params})
  **Category:** ${func.category}
  **Description:** ${func.description}

  Please provide:
  1. A clear explanation of what this function does
  2. How to use it with practical examples
  3. Sample code with hardcoded values showing typical usage.`;

    onAskAI(prompt);
    toast.success(`Sent to AI Assistant`);
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { height: '85vh', maxHeight: '85vh' } }}
      data-testid="function-browser"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Manrope' }}>DSL Function Browser</h2>
            <p className="text-sm text-slate-600">
              {dslFunctions.length} functions available
              {customCount > 0 && (
                <span className="ml-2 text-purple-600">
                  ({customCount} custom)
                </span>
              )}
            </p>
          </div>
        </div>
        <IconButton onClick={onClose} data-testid="close-browser">
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Search and Filters */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <TextField
            placeholder="Search functions by name, description, or parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            data-testid="function-search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-slate-400" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="text-sm text-slate-600">
            Showing {filteredFunctions.length} of {dslFunctions.length} functions
          </div>
        </Box>

        {/* Function List */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFunctions.map((func, idx) => (
              <Card 
                key={idx} 
                sx={{ 
                  border: '1px solid #e2e8f0',
                  borderLeft: func.is_custom ? '4px solid #a855f7' : '1px solid #e2e8f0',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 3 }
                }} 
                data-testid={`function-card-${func.name}`}
              >
                <CardContent sx={{ p: 2 }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-base font-semibold text-slate-900">
                          {func.name}({func.params})
                        </div>
                        {func.is_custom && (
                          <Chip
                            icon={<Sparkles className="w-3 h-3" />}
                            label="Custom"
                            size="small"
                            sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontSize: '0.75rem' }}
                          />
                        )}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">{func.category}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyFunction(func)}
                        data-testid={`copy-${func.name}`}
                      >
                        <Copy className="w-4 h-4" />
                      </IconButton>
                      {onAskAI && (
                        <IconButton
                          size="small"
                          onClick={() => handleAskAI(func)}
                          sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                          title="Ask AI Assistant"
                          data-testid={`ai-${func.name}`}
                        >
                          <Zap className="w-4 h-4" />
                        </IconButton>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{func.description}</p>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => {
                      onInsertFunction(`${func.name}(${func.params})`);
                      toast.success(`Inserted: ${func.name}()`);
                    }}
                    data-testid={`insert-${func.name}`}
                  >
                    Insert into Editor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFunctions.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No functions found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc', textAlign: 'center' }}>
          <p className="text-xs text-slate-600">
            Use "Build Function" to create your own custom DSL functions
          </p>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionBrowser;