import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Copy, X, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

const FunctionBrowser = ({ dslFunctions, onInsertFunction, onClose, onAskAI }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    
    // Create a detailed prompt about the function
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="function-browser">
      <Card className="w-[90vw] h-[85vh] max-w-6xl bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
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
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-browser">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search functions by name, description, or parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="function-search-input"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
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
        </div>

        {/* Function List */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFunctions.map((func, idx) => (
              <Card 
                key={idx} 
                className={`p-4 border-slate-200 hover:shadow-md transition-shadow duration-200 ${func.is_custom ? 'border-l-4 border-l-purple-500' : ''}`} 
                data-testid={`function-card-${func.name}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-base font-semibold text-slate-900">
                        {func.name}({func.params})
                      </div>
                      {func.is_custom && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Custom
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">{func.category}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyFunction(func)}
                      className="h-8 w-8 p-0"
                      data-testid={`copy-${func.name}`}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {onAskAI && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAskAI(func)}
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                        title="Ask AI Assistant"
                        data-testid={`ai-${func.name}`}
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{func.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onInsertFunction(`${func.name}(${func.params})`);
                    toast.success(`Inserted: ${func.name}()`);
                  }}
                  className="w-full"
                  data-testid={`insert-${func.name}`}
                >
                  Insert into Editor
                </Button>
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
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-600 text-center">
            Use "Build Function" to create your own custom DSL functions
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FunctionBrowser;
