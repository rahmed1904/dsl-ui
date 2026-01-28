# ============================================================================
# REVENUE RECOGNITION DSL - Complete ASC 606 Workflow
# ============================================================================
# This DSL demonstrates:
#   1. Revenue Allocation (SSP-based)
#   2. Schedule Generation (monthly revenue schedules)
#   3. Revenue Recognition (posting date matching)
# ============================================================================
# Uses ONLY DSL functions - deterministic and auditable
# ============================================================================

# ============================================================================
# INPUTS - Define all input parameters here
# ============================================================================

# Posting date for revenue recognition
posting_date = "2026-03-15"

# Product line items
product_names = ["Product A", "Product B", "Discount"]
subinstrument_ids = ["PROD-001", "PROD-002", "DISC-001"]
esp_values = [1200, 800, -200]

# Recognition periods for each product
start_dates = ["2026-01-01", "2026-01-01", "2026-01-01"]
end_dates = ["2026-12-31", "2026-06-30", "2026-12-31"]

# ============================================================================
# SECTION 1: REVENUE ALLOCATION LOGIC (SSP-Based)
# ============================================================================

print("═══════════════════════════════════════════════════════════════════════")
print("SECTION 1: REVENUE ALLOCATION (SSP-Based)")
print("═══════════════════════════════════════════════════════════════════════")

# Step 1.1: Derive SSP for each line item
# Business Rule: Discount line items get SSP = 0
ssp_values = map_array(product_names, "name", "iif(eq_ignore_case(name, 'discount'), 0, array_get(esp_values, index, 0))", {"esp_values": esp_values})

print("Product Names:", product_names)
print("Subinstrument IDs:", subinstrument_ids)
print("ESP Values:", esp_values)
print("SSP Values (Discount=0):", ssp_values)

# Step 1.2: Calculate Total SSP
total_ssp = sum_vals(ssp_values)
print("Total SSP:", total_ssp)

# Step 1.3: Calculate Allocation Percentage for each item
# Formula: allocation_pct = ssp / total_ssp
alloc_pcts = map_array(ssp_values, "ssp", "iif(gt(total_ssp, 0), divide(ssp, total_ssp), 0)", {"total_ssp": total_ssp})
print("Allocation Percentages:", alloc_pcts)

# Step 1.4: Calculate Total Contract Value (Extended Sale Price)
total_esp = sum_vals(esp_values)
print("Total Contract Value (ESP):", total_esp)

# Step 1.5: Calculate Allocated Revenue for each item
# Formula: allocated_revenue = allocation_pct × total_esp
allocated_revenues = map_array(alloc_pcts, "pct", "multiply(pct, total_esp)", {"total_esp": total_esp})
print("Allocated Revenues:", allocated_revenues)

print("")

# ============================================================================
# SECTION 2: SCHEDULE GENERATION
# ============================================================================
# For each product with non-zero allocated revenue:
#   - Generate monthly schedule from start_date to end_date
#   - Schedule columns: period_date, days_in_period, period_amount
#   - Revenue calculation: daily_revenue = allocated_revenue / 365
#                         period_revenue = daily_revenue × days_in_period
# ============================================================================

print("═══════════════════════════════════════════════════════════════════════")
print("SECTION 2: REVENUE SCHEDULE GENERATION")
print("═══════════════════════════════════════════════════════════════════════")
print("Recognition Periods:")
print("  Start Dates:", start_dates)
print("  End Dates:", end_dates)
print("")

# Step 2.1: Generate revenue schedules for all products
# Using "revenue" template which calculates:
#   daily_amount = amount / 365
#   period_amount = daily_amount × days_in_period
schedule_results = generate_schedules(
    allocated_revenues,
    start_dates,
    end_dates,
    "revenue",
    "M",
    None,
    None,
    product_names,
    subinstrument_ids
)

# Step 2.2: Extract and print all schedules to console
all_schedules = get_schedules_array(schedule_results)
print_all_schedules(all_schedules, product_names)

# Step 2.3: Verify schedule totals match allocated revenues
schedule_totals = get_schedule_totals(schedule_results)
print("")
print("Schedule Verification:")
print("  Allocated Revenues:", allocated_revenues)
print("  Schedule Totals:", schedule_totals)

print("")

# ============================================================================
# SECTION 3: REVENUE RECOGNITION LOGIC
# ============================================================================
# Compare posting_date with period_date in each product's schedule
# If posting date falls within a schedule period:
#   - Recognized revenue = period_revenue for that period
#   - Create revenue recognition transaction
# ============================================================================

print("═══════════════════════════════════════════════════════════════════════")
print("SECTION 3: REVENUE RECOGNITION FOR POSTING DATE")
print("═══════════════════════════════════════════════════════════════════════")
print("Posting Date:", posting_date)
print("")

# Step 3.1: Find period amounts for each product at the posting date
# This matches posting_date to the appropriate period in each schedule
recognition_results = find_period_amounts(schedule_results, posting_date, "period_amount")

print("Recognition Results by Product:")
print(recognition_results)

print("")

# ============================================================================
# SECTION 4: REVENUE RECOGNITION TRANSACTIONS
# ============================================================================
# Create transactions for each product with non-zero recognized amount
# Transaction includes subinstrumentid for proper tracking
# ============================================================================

print("═══════════════════════════════════════════════════════════════════════")
print("SECTION 4: REVENUE RECOGNITION TRANSACTIONS")
print("═══════════════════════════════════════════════════════════════════════")

# Step 4.1: Create revenue recognition transactions
# Only creates transactions for products with non-zero period amounts
transactions = create_schedule_transactions(recognition_results, posting_date, "Revenue Recognition")

print("Transactions Created:", array_length(transactions))

print("")

# ============================================================================
# EXECUTION SUMMARY
# ============================================================================

print("═══════════════════════════════════════════════════════════════════════")
print("EXECUTION SUMMARY")
print("═══════════════════════════════════════════════════════════════════════")
print("")
print("INPUT PARAMETERS:")
print("  Products:", array_length(product_names))
print("  Posting Date:", posting_date)
print("")
print("ALLOCATION RESULTS:")
print("  Total Contract Value (ESP):", total_esp)
print("  Total SSP:", total_ssp)
print("  Allocated Revenues:", allocated_revenues)
print("")
print("SCHEDULE GENERATION:")
print("  Schedules Created:", array_length(all_schedules))
print("  Schedule Totals:", schedule_totals)
print("")
print("REVENUE RECOGNITION:")
print("  Posting Date:", posting_date)
print("  Transactions Generated:", array_length(transactions))


// ============================================================================
// SECTION 2: LOAN & MORTGAGE CALCULATIONS
// ============================================================================

// Example 1: Calculate monthly payment for a $300,000 mortgage at 6% annual rate for 30 years
LOAN_AMOUNT = 300000
ANNUAL_RATE = 0.06
MONTHLY_RATE = ANNUAL_RATE / 12
NUM_PAYMENTS = 30 * 12

MONTHLY_PAYMENT = pmt(MONTHLY_RATE, NUM_PAYMENTS, LOAN_AMOUNT)
print("Monthly Mortgage Payment:", MONTHLY_PAYMENT)

// Example 2: Calculate future value of monthly savings
MONTHLY_SAVINGS = 500;
MONTHS = 60;  // 5 years
INTEREST_RATE = 0.04 / 12;

FUTURE_VALUE = fv(INTEREST_RATE, MONTHS, MONTHLY_SAVINGS);
OUTPUT "Future Value of $500/month savings" = FUTURE_VALUE;

// Example 3: Present value of annuity
ANNUAL_PAYMENT = 10000;
YEARS = 10;
DISCOUNT_RATE = 0.05;

ANNUITY_PV = pv(DISCOUNT_RATE, YEARS, ANNUAL_PAYMENT);
OUTPUT "Present Value of Annuity" = ANNUITY_PV;


// SECTION 2: INVESTMENT ANALYSIS (NPV & IRR)
// ============================================================================

// Example 4: NPV of a project investment
DISCOUNT_RATE = 0.10;
CASHFLOWS = [-100000, 30000, 35000, 40000, 45000, 50000];

PROJECT_NPV = npv(DISCOUNT_RATE, CASHFLOWS);
OUTPUT "Project NPV at 10% discount rate" = PROJECT_NPV;

// Example 5: Calculate IRR for investment opportunity
INVESTMENT_CASHFLOWS = [-50000, 15000, 18000, 22000, 25000];
RETURN_RATE = irr(INVESTMENT_CASHFLOWS);
OUTPUT "Investment Internal Rate of Return (IRR)" = RETURN_RATE;
OUTPUT "IRR as percentage" = RETURN_RATE * 100;


// SECTION 3: INTEREST CALCULATIONS
// ============================================================================

// Example 6: Interest on balance using ACT/360
BALANCE = 50000;
ANNUAL_RATE = 0.08;
DAYS = 90;

INTEREST = interest_on_balance(BALANCE, ANNUAL_RATE, DAYS);
OUTPUT "Interest on Balance (90 days, ACT/360)" = INTEREST;
OUTPUT "Total Amount Due" = BALANCE + INTEREST;

// Example 7: Compound interest
PRINCIPAL = 10000;
RATE = 0.05;
PERIODS = 3;  // 3 years

COMPOUND_INT = compound_interest(PRINCIPAL, RATE, PERIODS);
TOTAL_AMOUNT = PRINCIPAL + COMPOUND_INT;
OUTPUT "Compound Interest over 3 periods" = COMPOUND_INT;
OUTPUT "Total Amount" = TOTAL_AMOUNT;

// Example 8: Interest on balance using ACT/360
BALANCE = 100000;
RATE = 0.06;
DAYS = 30;

ACCRUED = interest_on_balance(BALANCE, RATE, DAYS);
OUTPUT "Interest on balance (ACT/360)" = ACCRUED;


// SECTION 4: DEPRECIATION
// ============================================================================

// Example 9: Straight-line depreciation
ASSET_COST = 50000;
SALVAGE_VALUE = 5000;
USEFUL_LIFE = 5;

ANNUAL_DEPRECIATION = straight_line(ASSET_COST, SALVAGE_VALUE, USEFUL_LIFE);
OUTPUT "Annual Straight-Line Depreciation" = ANNUAL_DEPRECIATION;

// Example 10: Double declining balance depreciation
ASSET_COST = 100000;
USEFUL_LIFE = 10;

DDB_DEPRECIATION = double_declining(ASSET_COST, USEFUL_LIFE);
OUTPUT "Year 1 Double Declining Depreciation" = DDB_DEPRECIATION;


// SECTION 5: ALLOCATIONS & SPLITS
// ============================================================================

// Example 11: Prorate a value
TOTAL_EXPENSE = 12000;
DEPARTMENT_DAYS = 20;
TOTAL_DAYS = 30;

ALLOCATED_EXPENSE = prorate(TOTAL_EXPENSE, DEPARTMENT_DAYS, TOTAL_DAYS);
OUTPUT "Prorated Expense (20 of 30 days)" = ALLOCATED_EXPENSE;

// Example 12: Allocate by weights
REVENUE = 100000;
WEIGHT_DEPT_A = 3;
WEIGHT_DEPT_B = 2;
WEIGHT_DEPT_C = 1;
WEIGHTS = [WEIGHT_DEPT_A, WEIGHT_DEPT_B, WEIGHT_DEPT_C];

ALLOCATION = allocate(REVENUE, WEIGHTS);
OUTPUT "Department A allocation" = ALLOCATION[0];
OUTPUT "Department B allocation" = ALLOCATION[1];
OUTPUT "Department C allocation" = ALLOCATION[2];

// Example 13: Percentage calculation
TOTAL_SALES = 250000;
PERCENTAGE = 15;

AMOUNT = percentage_of(TOTAL_SALES, PERCENTAGE / 100);
OUTPUT "15% of 250000" = AMOUNT;


// SECTION 6: BALANCE OPERATIONS
// ============================================================================

// Example 14: Rolling balance calculation
OPENING = 50000;
DEPOSITS = [5000, 3000, 7500];
FINAL_BALANCE = rolling_balance(OPENING, DEPOSITS);

OUTPUT "Opening Balance" = OPENING;
OUTPUT "Total Balance After Deposits" = FINAL_BALANCE;

// Example 15: Average balance
BALANCES = [10000, 12000, 11000, 13000, 14000];
AVG_BAL = average_balance(BALANCES);
OUTPUT "Average Balance" = AVG_BAL;

// Example 16: Weighted average balance
BALANCES = [10000, 15000, 20000];
DAYS = [10, 10, 10];
WEIGHTED_AVG = weighted_balance(BALANCES, DAYS);
OUTPUT "Weighted Average Balance" = WEIGHTED_AVG;


// SECTION 7: ARITHMETIC OPERATIONS
// ============================================================================

// Example 17: Basic arithmetic with conditions
BASE_SALARY = 50000;
BONUS_RATE = 0.15;
BONUS = multiply(BASE_SALARY, BONUS_RATE);
TOTAL_COMP = add(BASE_SALARY, BONUS);

OUTPUT "Base Salary" = BASE_SALARY;
OUTPUT "Bonus (15%)" = BONUS;
OUTPUT "Total Compensation" = TOTAL_COMP;

// Example 18: Percentage change
LAST_YEAR = 100000;
THIS_YEAR = 115000;
GROWTH = change_pct(LAST_YEAR, THIS_YEAR);
OUTPUT "Revenue Last Year" = LAST_YEAR;
OUTPUT "Revenue This Year" = THIS_YEAR;
OUTPUT "Growth %" = GROWTH;

// Example 19: Rounding and truncation
VALUE = 1234.5678;
ROUNDED_2 = round_val(VALUE, 2);
TRUNCATED_2 = truncate(VALUE, 2);
FLOORED = floor(VALUE);
CEILED = ceil(VALUE);

OUTPUT "Original Value" = VALUE;
OUTPUT "Rounded to 2 decimals" = ROUNDED_2;
OUTPUT "Truncated to 2 decimals" = TRUNCATED_2;
OUTPUT "Floored" = FLOORED;
OUTPUT "Ceiled" = CEILED;


// SECTION 8: CONDITIONAL LOGIC
// ============================================================================

// Example 20: Simple if-else condition
REVENUE = 50000;
THRESHOLD = 100000;
STATUS = if_op(gt(REVENUE, THRESHOLD), "Exceeds Target", "Below Target");
OUTPUT "Revenue Status" = STATUS;

// Example 21: Clamp value within range
INTEREST_RATE = 0.15;  // Market rate
MIN_RATE = 0.03;
MAX_RATE = 0.10;

CLAMPED_RATE = clamp(INTEREST_RATE, MIN_RATE, MAX_RATE);
OUTPUT "Market Rate" = INTEREST_RATE;
OUTPUT "Clamped Rate (3-10%)" = CLAMPED_RATE;

// Example 22: Coalesce with null values
VALUE_A = null;
VALUE_B = null;
VALUE_C = 5000;
RESULT = coalesce(VALUE_A, VALUE_B, VALUE_C);
OUTPUT "First Non-Null Value" = RESULT;


// SECTION 9: DATE & TIME CALCULATIONS
// ============================================================================

// Example 23: Days between dates
START_DATE = "2025-01-01";
END_DATE = "2025-12-31";
DAYS_ELAPSED = days_between(START_DATE, END_DATE);
OUTPUT "Days between Jan 1 and Dec 31, 2025" = DAYS_ELAPSED;

// Example 24: Year fraction for interest calculations
DATE_1 = "2025-01-01";
DATE_2 = "2025-06-30";
YEAR_FRAC = years_between(DATE_1, DATE_2);
OUTPUT "Year fraction (Jan 1 to Jun 30)" = YEAR_FRAC;


// SECTION 10: COMPLEX SCENARIO - LOAN AMORTIZATION
// ============================================================================

// Example 25: Detailed loan analysis
LOAN_AMOUNT = 250000;
ANNUAL_RATE = 0.045;
LOAN_TERM_YEARS = 15;
MONTHLY_RATE = ANNUAL_RATE / 12;
NUM_PAYMENTS = LOAN_TERM_YEARS * 12;

// Calculate monthly payment
MONTHLY_PMT = pmt(MONTHLY_RATE, NUM_PAYMENTS, LOAN_AMOUNT);

// Calculate total interest paid
TOTAL_PAID = MONTHLY_PMT * NUM_PAYMENTS;
TOTAL_INTEREST = TOTAL_PAID - LOAN_AMOUNT;

OUTPUT "=== LOAN ANALYSIS ===";
OUTPUT "Loan Amount" = LOAN_AMOUNT;
OUTPUT "Annual Rate" = ANNUAL_RATE * 100;
OUTPUT "Loan Term (years)" = LOAN_TERM_YEARS;
OUTPUT "Monthly Payment" = MONTHLY_PMT;
OUTPUT "Total Paid" = TOTAL_PAID;
OUTPUT "Total Interest" = TOTAL_INTEREST;

// Example 26: Effective rate conversion
NOMINAL_RATE = 0.12;
COMPOUNDING_FREQ = 12;  // Monthly

EFFECTIVE = effective_rate(NOMINAL_RATE, COMPOUNDING_FREQ);
OUTPUT "Nominal Rate (12%)" = NOMINAL_RATE;
OUTPUT "Effective Annual Rate" = EFFECTIVE;
OUTPUT "Effective Rate %" = EFFECTIVE * 100;

// ============================================================================
// END OF DSL TEST EXAMPLES
// ============================================================================
