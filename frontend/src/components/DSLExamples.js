import React from "react";
import { Card, CardContent, Button, Box, Typography, Chip } from '@mui/material';
import { Code, Lightbulb, Copy } from "lucide-react";
import { useToast } from "./ToastProvider";

const DSL_EXAMPLES = [
  {
    id: 1,
    title: "Compound Interest with Transaction",
    description: "Calculate compound interest and create a transaction",
    category: "Interest",
    dslCode: `## Calculate compound interest\ninterest = compound_interest(10000, 0.05, 2)\nnew_balance = capitalization(interest, 10000)\n\n## Create the transaction\ncreateTransaction("2026-12-31", "2026-12-31", "Compound Interest", interest)`,
  },
  {
    id: 2,
    title: "Monthly Loan Payment",
    description: "Calculate fixed monthly payment for a loan",
    category: "Loans",
    dslCode: ` ## Calculate monthly payment\n  monthly_rate = divide(0.045, 12)\n  payment = pmt(monthly_rate, 360, 250000)\n\n  ## Create the transaction\n  createTransaction("2026-12-31", "2026-12-31", "Monthly Payment", abs(payment))`,
  },
  {
    id: 3,
    title: "Present Value Calculation",
    description: "Calculate present value of a future amount",
    category: "Financial",
    dslCode: `## Calculate present value\n  discount_rate = divide(0.05, 12)\n  present_val = pv(discount_rate, 12, 0, 10000)\n\n  ## Create the transaction\n  createTransaction("2026-12-31", "2026-12-31", "Present Value", abs(present_val))`,
  },
];

const DSLExamples = ({ onLoadExample }) => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const toast = useToast();

  const categories = ["All", ...new Set(DSL_EXAMPLES.map(ex => ex.category))];

  const filteredExamples = selectedCategory === "All" 
    ? DSL_EXAMPLES 
    : DSL_EXAMPLES.filter(ex => ex.category === selectedCategory);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100%' }} data-testid="dsl-examples">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Lightbulb size={24} color="#5B5FED" />
          <Typography variant="h3">DSL Example Snippets</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Ready-to-use examples for common financial calculations
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? "primary" : "default"}
            sx={{ 
              cursor: 'pointer',
              bgcolor: selectedCategory === category ? '#5B5FED' : '#FFFFFF',
              color: selectedCategory === category ? '#FFFFFF' : '#495057',
              border: '1px solid',
              borderColor: selectedCategory === category ? '#5B5FED' : '#CED4DA',
              '&:hover': {
                bgcolor: selectedCategory === category ? '#4346C8' : '#F8F9FA',
              }
            }}
            data-testid={`example-category-${category}`}
          />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5 }}>
        {filteredExamples.map((example) => (
          <Card key={example.id} data-testid={`example-${example.id}`}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Code size={16} color="#5B5FED" />
                    <Typography variant="h6">{example.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {example.description}
                  </Typography>
                  <Chip 
                    label={example.category} 
                    size="small"
                    sx={{ 
                      bgcolor: '#EEF0FE', 
                      color: '#5B5FED',
                      fontSize: '0.75rem',
                      height: 20
                    }}
                  />
                </Box>
                <Button
                  size="small"
                  onClick={() => handleCopyCode(example.dslCode)}
                  sx={{ minWidth: 'auto', p: 1 }}
                  data-testid={`copy-example-${example.id}`}
                >
                  <Copy size={16} />
                </Button>
              </Box>

              <Box sx={{ 
                bgcolor: '#212529', 
                borderRadius: 1, 
                p: 2, 
                mb: 2,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#F8F9FA',
                lineHeight: 1.6,
                maxHeight: 200,
                overflow: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{example.dslCode}</pre>
              </Box>

              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  onLoadExample(example.dslCode);
                  toast.success(`Loaded: ${example.title}`);
                }}
                data-testid={`load-example-${example.id}`}
              >
                Load into Editor
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DSLExamples;