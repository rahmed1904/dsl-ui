import React from "react";
import { Card, CardContent, Button, IconButton, Box } from '@mui/material';
import { Code, Lightbulb, Copy } from "lucide-react";
import { useToast } from "./ToastProvider";

const DSL_EXAMPLES = [
  {
    id: 1,
    title: "Compound Interest with Transaction",
    description: "Calculate compound interest and create a transaction",
    category: "Interest",
    dslCode: `## Calculate compound interest
interest = compound_interest(10000, 0.05, 2)
new_balance = capitalization(interest, 10000)

## Create the transaction
createTransaction("2026-12-31", "2026-12-31", "Compound Interest", interest)`,
    fields: []
  },
  {
    id: 2,
    title: "Monthly Loan Payment",
    description: "Calculate fixed monthly payment for a loan",
    category: "Loans",
    dslCode: ` ## Calculate monthly payment
  monthly_rate = divide(0.045, 12)
  payment = pmt(monthly_rate, 360, 250000)

  ## Create the transaction
  createTransaction("2026-12-31", "2026-12-31", "Monthly Payment", abs(payment))`,
    fields: []
  },
  {
    id: 3,
    title: "Present Value Calculation",
    description: "Calculate present value of a future amount",
    category: "Financial",
    dslCode: `## Calculate present value
  discount_rate = divide(0.05, 12)
  present_val = pv(discount_rate, 12, 0, 10000)

  ## Create the transaction
  createTransaction("2026-12-31", "2026-12-31", "Present Value", abs(present_val))`,
    fields: []
  },
  {
    id: 4,
    title: "Straight Line Depreciation",
    description: "Calculate annual depreciation using straight line method",
    category: "Depreciation",
    dslCode: `## Calculate depreciation
  annual_depreciation = straight_line(50000, 5000, 5)

  ## Create the transaction
  createTransaction("2026-12-31", "2026-12-31", "Depreciation Expense", annual_depreciation)`,
    fields: []
  },
  {
    id: 5,
    title: "Interest with Day Count",
    description: "Calculate interest using ACT/360 convention",
    category: "Interest",
    dslCode: `## Calculate days and interest
  days = days_between("2026-01-01", "2026-01-31")
  interest = interest_on_balance(10000, 0.05, days)

  ## Create the transaction
  createTransaction("2026-01-31", "2026-01-31", "Accrued Interest", interest)`,
    fields: []
  },
  {
    id: 6,
    title: "Conditional Payment Logic",
    description: "Apply payment only if balance is positive",
    category: "Logic",
    dslCode: `## Calculate payment with condition
  payment_due = pmt(0.05, 12, 1000)
  actual_payment = iif(gt(500, 0), abs(payment_due), 0)

  ## Create the transaction (only if payment > 0)
  createTransaction("2026-01-31", "2026-01-31", "Conditional Payment", actual_payment)`,
    fields: []
  },
  {
    id: 7,
    title: "Prorated Allocation",
    description: "Allocate amount proportionally across partial period",
    category: "Allocation",
    dslCode: `## Calculate prorated amount
  days_in_period = days_between("2026-01-01", "2026-01-15")
  prorated_amount = prorate(12000, days_in_period, 360)

  ## Create the transaction
  createTransaction("2026-01-15", "2026-01-15", "Prorated Allocation", prorated_amount)`,
    fields: []
  },
  {
    id: 8,
    title: "Net Present Value Analysis",
    description: "Calculate NPV of cash flow series",
    category: "Financial",
    dslCode: `## Define cashflows and calculate NPV
  cashflows = [-100000, 30000, 40000, 50000]
  net_pv = npv(0.08, cashflows)

  ## Create the transaction
  createTransaction("2026-12-31", "2026-12-31", "NPV Analysis", net_pv)`,
    fields: []
  },
  {
    id: 9,
    title: "Currency Conversion",
    description: "Convert amount from one currency to another",
    category: "Conversion",
    dslCode: `## Convert currency
  converted = fx_convert(1000, 1.12)
  rounded = round(converted, 2)

  ## Create the transaction
  createTransaction("2026-06-30", "2026-06-30", "FX Conversion", rounded)`,
    fields: []
  },
  {
    id: 10,
    title: "Clamped Rate Interest",
    description: "Apply rate with minimum and maximum bounds",
    category: "Logic",
    dslCode: `## Clamp rate within bounds
  clamped_rate = clamp(0.06, 0.03, 0.08)
  interest = multiply(100000, clamped_rate)

  ## Create the transaction
  createTransaction("2026-12-31", "2026-12-31", "Bounded Rate Interest", interest)`,
    fields: []
  },
  {
    id: 12,
    title: "Loan Amortization Schedule",
    description: "Generate loan payment schedule with interest and principal",
    category: "Schedule",
    dslCode: `## Define loan parameters
loan_amount = 100000
annual_rate = 0.06
monthly_rate = divide(annual_rate, 12)
loan_term_months = 12

## Calculate fixed monthly payment
monthly_payment = abs(pmt(monthly_rate, loan_term_months, loan_amount))

## Create schedule period
p = period("2026-01-01", "2026-12-01", "M")

## Generate amortization schedule
sched = schedule(p, {
    "date": "period_date",
    "opening_bal": "lag('closing_bal', 1, loan_amount)",
    "interest": "multiply(opening_bal, monthly_rate)",
    "principal": "subtract(monthly_payment, interest)",
    "closing_bal": "subtract(opening_bal, principal)"
},{"loan_amount": loan_amount,"monthly_rate":monthly_rate,"monthly_payment":monthly_payment})

## Get totals
total_interest = schedule_sum(sched, "interest")

## Execute Results
print(sched)
print("Total_Interest",total_interest)`,
    fields: ["postingdate (date)", "effectivedate (date)"]
  }
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
    <div className="p-6 bg-slate-50" data-testid="dsl-examples">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>DSL Example Snippets</h2>
            <p className="text-sm text-slate-600">Ready-to-use examples for common financial calculations</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedCategory(category)}
              data-testid={`example-category-${category}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Box sx={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExamples.map((example) => (
            <Card 
              key={example.id} 
              sx={{ 
                border: '1px solid #e2e8f0',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 3 }
              }} 
              data-testid={`example-${example.id}`}
            >
              <CardContent sx={{ p: 2.5 }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Code className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope' }}>{example.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{example.description}</p>
                    <div className="text-xs text-blue-600 mt-1">{example.category}</div>
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyCode(example.dslCode)}
                    data-testid={`copy-example-${example.id}`}
                  >
                    <Copy className="w-4 h-4" />
                  </IconButton>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-slate-500 mb-1">Required Fields:</div>
                  <div className="flex flex-wrap gap-1">
                    {example.fields.map((field, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded p-3 mb-3">
                  <pre className="text-xs text-slate-100 font-mono whitespace-pre-wrap">{example.dslCode}</pre>
                </div>

                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => {
                    onLoadExample(example.dslCode);
                    toast.success(`Loaded example: ${example.title}`);
                  }}
                  data-testid={`load-example-${example.id}`}
                >
                  Load into Editor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default DSLExamples;