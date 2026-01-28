# Array Lookup & Date Normalization

#### `lookup(value_array, match_array, target_value)`
Retrieve a value from `value_array` by matching an element in `match_array` to `target_value` (type-agnostic: supports date, string, number, enum, etc.).
- **Parameters:**
  - `value_array`: Array of values to return from
  - `match_array`: Array to match against `target_value`
  - `target_value`: Value to match (any comparable type)
- **Returns:** Value from `value_array` at the first index where `match_array[i] == target_value`, or `null` if not found
- **Validation:** Raises error if array lengths differ or unsupported types
- **Examples:**
  - `ExpectedCFA = lookup(ExpectedCF, StartDate, month_end_date)`
  - `ProductRate = lookup(Rates, ProductCodes, transaction.product_code)`
  - `lookup([10, 20, 30], ["A", "B", "C"], "B")` → 20
  - `lookup([100, 200], ["2026-01-01", "2026-02-01"], "2026-02-01")` → 200

#### `normalize_arraydate(array)`
Normalize all date values in an array to system-standard format (`yyyy-mm-dd`).
- **Parameters:**
  - `array`: Array of date values (strings, datetimes, etc.)
- **Returns:** New array with all dates normalized to `yyyy-mm-dd` format
- **Validation:** Raises error if a non-date value is encountered
- **Examples:**
  - `StartDate = normalize_arraydate(StartDate)`
  - `normalize_arraydate(["2026/01/20", "2026-01-21"])` → `["2026-01-20", "2026-01-21"]`
#### `normalize_date(date_value)`
Normalize a date value to `YYYY-MM-DD` string format. Handles strings, datetimes, timestamps, and common date formats.
- **Parameters:**
  - `date_value`: Date in any format (string, datetime, timestamp)
- **Returns:** Date string in `YYYY-MM-DD` format, or empty string if invalid
- **Example:** `normalize_date("2026-01-20")` → "2026-01-20"
  - `normalize_date("2026/01/20 12:00:00")` → "2026-01-20"

# Fyntrac DSL Studio - Complete Function Reference

## Python Native Syntax Support

The DSL fully supports native Python syntax, making it easy to write financial calculations using familiar patterns.

### Supported Python Features

| Feature | Syntax | Example |
|---------|--------|---------|
| List Comprehensions | `[expr for x in list]` | `[x * 2 for x in amounts]` |
| Native `sum()` | `sum(list)` | `sum([100, 200, 300])` → 600 |
| Native `len()` | `len(list)` | `len(items)` → 3 |
| Native `range()` | `range(n)` | `range(5)` → [0,1,2,3,4] |
| Conditional Expression | `a if cond else b` | `0 if name.lower() == "discount" else value` |
| String Methods | `.lower()`, `.upper()` | `"Hello".lower()` → "hello" |
| List Indexing | `list[index]` | `items[0]`, `items[-1]` |
| Direct Arithmetic | `+`, `-`, `*`, `/` | `a + b * c / d` |

### Important Variable Naming Rule

**Use lowercase variable names** to avoid conflicts with event references:
- ✅ `product_name = "Product A"` 
- ✅ `total_ssp = 2000`
- ❌ `PRODUCT_NAME = "Product A"` (interpreted as EVENT_FIELD reference)
- ❌ `TOTAL_SSP = 2000` (interpreted as EVENT_FIELD reference)

### Example: Revenue Allocation with Arrays

```python
# INPUT: Arrays of line items
product_names = ["Product A", "Product B", "Discount"]
esp_values = [1200, 800, -200]

# Derive SSP using conditional expression
ssp_values = [0 if product_names[i].lower() == "discount" else esp_values[i] for i in range(len(product_names))]

# Calculate totals using native sum()
total_ssp = sum(ssp_values)
total_esp = sum(esp_values)

# Calculate allocation percentages
alloc_pcts = [ssp / total_ssp for ssp in ssp_values]

# Calculate allocated revenues
allocated_revenues = [pct * total_esp for pct in alloc_pcts]

# Output results
print("SSP Values:", ssp_values)
print("Allocation %:", [round(p * 100, 2) for p in alloc_pcts])
print("Allocated Revenue:", allocated_revenues)
```

---

## Financial Functions

### Present Value & Future Value

#### `pv(rate, n, pmt, fv=0, type=0)`
Calculates present value of future cash flows discounted at a constant rate over periods.
- **Parameters:**
  - `rate`: Discount rate per period (decimal)
  - `n`: Number of periods
  - `pmt`: Payment per period
  - `fv`: Future value (default 0)
  - `type`: 0 = payment at end of period (default), 1 = payment at beginning
- **Returns:** Present value (float)
- **Example:** `pv(0.10, 5, 0, 1000)` → 620.92

#### `fv(rate, n, pmt, pv=0, type=0)`
Calculates future value of current cash flows compounded over time.
- **Parameters:**
  - `rate`: Interest rate per period
  - `n`: Number of periods
  - `pmt`: Payment per period
  - `pv`: Present value (default 0)
  - `type`: 0 = payment at end of period (default), 1 = payment at beginning
- **Returns:** Future value (float)
- **Example:** `fv(0.10, 5, 0, 1000)` → 1610.51

#### `pmt(rate, n, pv, fv=0, type=0)`
Computes fixed periodic payment required to amortize a value.
- **Parameters:**
  - `rate`: Interest rate per period
  - `n`: Number of periods
  - `pv`: Present value (loan amount)
  - `fv`: Future value (default 0)
  - `type`: 0 = payment at end of period (default), 1 = payment at beginning
- **Returns:** Payment amount (float)
- **Example:** `pmt(0.12/12, 60, 100000)` → -2224.44

#### `rate(n, pmt, pv, fv=0, type=0, guess=0.1)`
Calculates the interest rate per period for an investment.
- **Parameters:**
  - `n`: Number of periods
  - `pmt`: Payment per period
  - `pv`: Present value
  - `fv`: Future value (default 0)
  - `type`: 0 = payment at end of period (default), 1 = payment at beginning
  - `guess`: Initial rate guess (default 0.1 = 10%)
- **Returns:** Interest rate per period as decimal
- **Example:** `rate(60, -2224.44, 100000)` → 0.01 (1% per month)

#### `nper(rate, pmt, pv, fv=0, type=0)`
Calculates the number of periods for a cash flow stream.
- **Parameters:**
  - `rate`: Interest rate per period
  - `pmt`: Payment per period
  - `pv`: Present value
  - `fv`: Future value (default 0)
  - `type`: 0 = payment at end of period (default), 1 = payment at beginning
- **Returns:** Number of periods (can be fractional)
- **Example:** `nper(0.01, -2224.44, 100000)` → 60

### Net Present Value & IRR

#### `npv(rate, cashflows)`
Discounts a series of cash flows to today's value. **Excel-compatible:** first cash flow is at period 1, not 0.
- **Parameters:**
  - `rate`: Discount rate
  - `cashflows`: List of cash flows
- **Returns:** Net present value (float)
- **Example:** `npv(0.10, [-1000, 300, 400, 500])` → 49.25
- **Note:** Changed to match Excel's NPV convention (periods start at 1, not 0)

#### `irr(cashflows, guess=0.1)`
Calculates internal rate of return where NPV equals zero. **Excel-compatible:** uses period 1 start like NPV.
- **Parameters:**
  - `cashflows`: List of cash flows (first must be negative)
  - `guess`: Initial guess for iteration (default 0.1)
- **Returns:** IRR as decimal (float)
- **Example:** `irr([-1000, 300, 400, 500])` → 0.145 (14.5%)
- **Note:** Fixed to match Excel's IRR convention (periods start at 1, not 0)

#### `xnpv(rate, cashflows, dates)`
Calculates NPV for cash flows occurring on specific dates. **Excel-compatible:** uses 365-day convention.
- **Parameters:**
  - `rate`: Discount rate
  - `cashflows`: List of cash flows
  - `dates`: List of dates (ISO format: YYYY-MM-DD)
- **Returns:** Net present value (float)
- **Example:** `xnpv(0.10, [-1000, 300, 400], ['2024-01-01', '2024-06-01', '2025-01-01'])` → ~30.45
- **Note:** Uses 365-day year (Excel convention), not 365.25

#### `xirr(cashflows, dates, guess=0.1)`
Calculates IRR for cash flows on specific dates. **Excel-compatible.**
- **Parameters:**
  - `cashflows`: List of cash flows
  - `dates`: List of dates (ISO format: YYYY-MM-DD)
  - `guess`: Initial rate guess (default 0.1)
- **Returns:** Annual IRR as decimal (float)
- **Example:** `xirr([-1000, 300, 400], ['2024-01-01', '2024-06-01', '2025-01-01'])` → ~0.10 (10%)

### Interest Calculations

#### `compound_interest(principal, rate, periods)`
Calculates compounded interest over discrete periods.
- **Parameters:**
  - `principal`: Principal amount
  - `rate`: Interest rate per period
  - `periods`: Number of compounding periods
- **Returns:** Total interest earned (float)
- **Example:** `compound_interest(100000, 0.10, 2)` → 21000

#### `interest_on_balance(balance, rate, days)`
Calculates interest using ACT/360 convention.
- **Parameters:**
  - `balance`: Account balance
  - `rate`: Annual interest rate
  - `days`: Number of days
- **Returns:** Interest amount (float)
- **Example:** `interest_on_balance(200000, 0.09, 30)` → 1500

### Balance Operations

#### `capitalization(interest, balance)`
Adds accrued interest to principal balance.
- **Parameters:**
  - `interest`: Interest to capitalize
  - `balance`: Current balance
- **Returns:** New balance (float)
- **Example:** `capitalization(5000, 200000)` → 205000

#### `amortized_cost(opening, interest, payment)`
Updates amortized balance after payment.
- **Parameters:**
  - `opening`: Opening balance
  - `interest`: Interest accrued
  - `payment`: Payment made
- **Returns:** Closing balance (float)
- **Example:** `amortized_cost(100000, 8000, 12000)` → 96000

### Rate Conversions

#### `effective_rate(nominal, freq)`
Converts nominal rate to effective annual rate.
- **Parameters:**
  - `nominal`: Nominal annual rate
  - `freq`: Compounding frequency per year
- **Returns:** Effective annual rate (float)
- **Example:** `effective_rate(0.12, 12)` → 0.1268 (12.68%)

#### `nominal_rate(effective, freq)`
Converts effective annual rate to nominal rate.
- **Parameters:**
  - `effective`: Effective annual rate
  - `freq`: Compounding frequency
- **Returns:** Nominal rate (float)
- **Example:** `nominal_rate(0.1268, 12)` → 0.12 (12%)

#### `discount_factor(rate, dcf)`
Returns discount factor for a period using day count convention.
- **Parameters:**
  - `rate`: Discount rate
  - `dcf`: Day count fraction
- **Returns:** Discount factor (float)
- **Example:** `discount_factor(0.10, 0.5)` → 0.9524

#### `accumulation_factor(rate, dcf)`
Returns growth factor for compounding over a fraction of a year.
- **Parameters:**
  - `rate`: Growth rate
  - `dcf`: Day count fraction
- **Returns:** Accumulation factor (float)
- **Example:** `accumulation_factor(0.10, 0.5)` → 1.05

---

## Depreciation Functions

#### `straight_line(cost, salvage, life)`
Allocates asset cost evenly across useful life.
- **Parameters:**
  - `cost`: Asset cost
  - `salvage`: Salvage value
  - `life`: Useful life in years
- **Returns:** Annual depreciation (float)
- **Example:** `straight_line(100000, 10000, 5)` → 18000

#### `reducing_balance(cost, rate)`
Applies declining balance depreciation.
- **Parameters:**
  - `cost`: Current book value
  - `rate`: Depreciation rate
- **Returns:** Depreciation for period (float)
- **Example:** `reducing_balance(100000, 0.2)` → 20000

#### `units_of_production(cost, units, total)`
Depreciates based on usage.
- **Parameters:**
  - `cost`: Total depreciable cost
  - `units`: Units produced this period
  - `total`: Total expected units
- **Returns:** Depreciation for period (float)
- **Example:** `units_of_production(100000, 10000, 50000)` → 20000

---

## Allocation Functions

#### `prorate(value, part, total)`
Allocates value proportionally across period.
- **Parameters:**
  - `value`: Total value to allocate
  - `part`: Partial period
  - `total`: Total period
- **Returns:** Prorated amount (float)
- **Example:** `prorate(12000, 90, 360)` → 3000

#### `allocate(value, weights)`
Allocates value using weight distribution.
- **Parameters:**
  - `value`: Total value
  - `weights`: List of weights
- **Returns:** List of allocated amounts
- **Example:** `allocate(1000, [0.4, 0.6])` → [400, 600]

#### `split(value, n)`
Equal split across n parts.
- **Parameters:**
  - `value`: Total value
  - `n`: Number of parts
- **Returns:** Amount per part (float)
- **Example:** `split(1200, 12)` → 100

---

## Balance & Movement Functions

#### `rolling_balance(opening, flows)`
Calculates running balance over time.
- **Parameters:**
  - `opening`: Opening balance
  - `flows`: List of cash flows
- **Returns:** Closing balance (float)
- **Example:** `rolling_balance(100000, [-2000, -2000])` → 96000

---

## Arithmetic Functions

#### `add(a, b)`
Returns the sum of two numbers.
- **Example:** `add(1200, 300)` → 1500

#### `subtract(a, b)`
Subtracts second value from first.
- **Example:** `subtract(1000, 250)` → 750

#### `multiply(a, b)`
Multiplies two numbers.
- **Example:** `multiply(500, 1.1)` → 550

#### `divide(a, b)`
Divides numerator by denominator.
- **Example:** `divide(1200, 12)` → 100

#### `power(a, b)`
Raises a to the power of b.
- **Example:** `power(1.05, 2)` → 1.1025

#### `sqrt(x)`
Square root of a number.
- **Example:** `sqrt(144)` → 12

#### `abs(x)`
Absolute value.
- **Example:** `abs(-500)` → 500

#### `sign(x)`
Returns -1, 0, or 1 based on sign.
- **Example:** `sign(-20)` → -1

#### `round(x, n=0)`
Rounds value to n decimals.
- **Example:** `round(12.3456, 2)` → 12.35

#### `floor(x)`
Rounds down to nearest integer.
- **Example:** `floor(4.9)` → 4

#### `ceil(x)`
Rounds up to nearest integer.
- **Example:** `ceil(4.1)` → 5

#### `mod(a, b)`
Returns remainder after division.
- **Example:** `mod(14, 3)` → 2

---

## Comparison Functions

#### `eq(a, b)`
Checks equality.
- **Returns:** Boolean
- **Example:** `eq(100, 100)` → TRUE

#### `neq(a, b)`
Checks inequality.
- **Returns:** Boolean
- **Example:** `neq(100, 90)` → TRUE

#### `gt(a, b)`
Greater than check.
- **Returns:** Boolean
- **Example:** `gt(120, 100)` → TRUE

#### `gte(a, b)`
Greater than or equal.
- **Returns:** Boolean
- **Example:** `gte(100, 100)` → TRUE

#### `lt(a, b)`
Less than check.
- **Returns:** Boolean
- **Example:** `lt(80, 100)` → TRUE

#### `lte(a, b)`
Less than or equal.
- **Returns:** Boolean
- **Example:** `lte(100, 120)` → TRUE

#### `between(x, l, u)`
Checks inclusive range.
- **Returns:** Boolean
- **Example:** `between(45, 30, 90)` → TRUE

#### `is_zero(x)`
Checks if value is zero.
- **Returns:** Boolean
- **Example:** `is_zero(0)` → TRUE

#### `is_null(x)`
Checks for null.
- **Returns:** Boolean
- **Example:** `is_null(rate)` → FALSE

---

## Logical Functions

#### `and(a, b)`
TRUE if both conditions true.
- **Returns:** Boolean
- **Example:** `and(gt(5, 3), lt(5, 10))` → TRUE

#### `or(a, b)`
TRUE if any condition true.
- **Returns:** Boolean
- **Example:** `or(eq(x, 0), gt(x, 0))` → TRUE

#### `not(a)`
Negates a condition.
- **Returns:** Boolean
- **Example:** `not(eq(5, 0))` → TRUE

#### `xor(a, b)`
TRUE if only one condition true.
- **Returns:** Boolean
- **Example:** `xor(TRUE, FALSE)` → TRUE

#### `all(list)`
TRUE if all conditions true.
- **Parameters:** List of booleans
- **Returns:** Boolean
- **Example:** `all([TRUE, TRUE])` → TRUE

#### `any(list)`
TRUE if any condition true.
- **Parameters:** List of booleans
- **Returns:** Boolean
- **Example:** `any([FALSE, TRUE])` → TRUE

#### `if(cond, t, f)`
Returns t if cond true, else f.
- **Parameters:**
  - `cond`: Condition to evaluate
  - `t`: Value if true
  - `f`: Value if false
- **Returns:** t or f
- **Example:** `if(gt(bal, 0), bal, 0)` → bal

#### `coalesce(*args)`
First non-null value.
- **Parameters:** Variable number of values
- **Returns:** First non-null value
- **Example:** `coalesce(null, 0, 5)` → 0

#### `default(x, v)`
Returns v if x is null.
- **Example:** `default(rate, 0.08)` → 0.08

#### `clamp(x, min_val, max_val)`
Restricts value within bounds.
- **Example:** `clamp(0.15, 0, 0.1)` → 0.1

---

## Date Functions

#### `days_between(d1, d2)`
Days between two dates.
- **Parameters:** Two ISO date strings (YYYY-MM-DD)
- **Returns:** Number of days (int)
- **Example:** `days_between("2024-01-01", "2024-01-31")` → 30

#### `months_between(d1, d2)`
Months between dates.
- **Returns:** Number of months (int)
- **Example:** `months_between("2024-01-01", "2024-04-01")` → 3

#### `years_between(d1, d2)`
Fractional years between dates.
- **Returns:** Years as decimal (float)
- **Example:** `years_between("2023-01-01", "2024-01-01")` → 1.0

#### `add_days(d, n)`
Adds days to date.
- **Parameters:**
  - `d`: Date string (YYYY-MM-DD)
  - `n`: Number of days to add
- **Returns:** New date string
- **Example:** `add_days("2024-01-01", 30)` → "2024-01-31"

#### `add_months(d, n)`
Adds months to date.
- **Returns:** New date string
- **Example:** `add_months("2024-01-01", 1)` → "2024-02-01"

#### `add_years(d, n)`
Adds years to date.
- **Returns:** New date string
- **Example:** `add_years("2024-01-01", 1)` → "2025-01-01"

#### `subtract_days(d, n)`
Subtracts days from date.
- **Parameters:**
  - `d`: Date string (YYYY-MM-DD)
  - `n`: Number of days to subtract
- **Returns:** New date string
- **Example:** `subtract_days("2024-01-31", 30)` → "2024-01-01"

#### `subtract_months(d, n)`
Subtracts months from date.
- **Returns:** New date string
- **Example:** `subtract_months("2024-02-01", 1)` → "2024-01-01"

#### `subtract_years(d, n)`
Subtracts years from date.
- **Returns:** New date string
- **Example:** `subtract_years("2025-01-01", 1)` → "2024-01-01"

#### `start_of_month(d)`
First day of month.
- **Returns:** Date string
- **Example:** `start_of_month("2024-03-15")` → "2024-03-01"

#### `end_of_month(d)`
Last day of month.
- **Returns:** Date string
- **Example:** `end_of_month("2024-02-15")` → "2024-02-29"

#### `day_count_fraction(d1, d2, conv="ACT/360")`
Year fraction using day count convention.
- **Parameters:**
  - `d1`, `d2`: Date strings
  - `conv`: Convention ("ACT/360", "ACT/365", "30/360")
- **Returns:** Fraction of year (float)
- **Example:** `day_count_fraction("2024-01-01", "2024-01-31", "ACT/360")` → 0.0833

---

## String Functions

#### `lower(s)`
Convert string to lowercase.
- **Example:** `lower("HELLO")` → "hello"

#### `upper(s)`
Convert string to uppercase.
- **Example:** `upper("hello")` → "HELLO"

#### `concat(s1, s2, ...)`
Concatenate multiple strings.
- **Example:** `concat("Hello", " ", "World")` → "Hello World"

#### `contains(s, substring)`
Check if string contains substring.
- **Returns:** Boolean
- **Example:** `contains("Product A", "Product")` → true

#### `eq_ignore_case(a, b)`
Case-insensitive string equality comparison.
- **Returns:** Boolean
- **Example:** `eq_ignore_case("Discount", "DISCOUNT")` → true

#### `starts_with(s, prefix)`
Check if string starts with prefix.
- **Returns:** Boolean
- **Example:** `starts_with("Product A", "Prod")` → true

#### `ends_with(s, suffix)`
Check if string ends with suffix.
- **Returns:** Boolean
- **Example:** `ends_with("file.txt", ".txt")` → true

#### `trim(s)`
Remove leading and trailing whitespace.
- **Example:** `trim("  hello  ")` → "hello"

#### `str_length(s)`
Get string length.
- **Returns:** Integer
- **Example:** `str_length("hello")` → 5

---

## Schedule Functions

Schedule functions create deterministic time-based schedules for amortization, revenue recognition, FAS-91, accruals, depreciation, and other period-based calculations.

### Core Schedule Functions

#### `period(start, end, freq, conv?)`
Define a time axis with start date, end date, and frequency.
- **Parameters:**
  - `start`: Start date (YYYY-MM-DD)
  - `end`: End date (YYYY-MM-DD)
  - `freq`: Frequency - "M" (monthly), "Q" (quarterly), "A" (annual), "W" (weekly), "D" (daily)
  - `conv`: Optional day count convention ("ACT/360", "ACT/365", "30/360")
- **Returns:** Period definition object
- **Example:** `period("2026-01-01", "2026-12-31", "M")`

#### `schedule(period, columns)`
Create a schedule table from a period definition with computed columns.
- **Parameters:**
  - `period`: Period definition from `period()`
  - `columns`: Dict of column names to expressions
- **Returns:** List of row dicts
- **Example:**
  ```python
  p = period("2026-01-01", "2026-12-31", "M")
  sched = schedule(p, {
      "period_date": "period_date",
      "days_in_period": "add(days_between(start_of_month(period_date), end_of_month(period_date)), 1)",
      "daily_amount": "divide(1200, 365)",
      "period_amount": "multiply(daily_amount, days_in_period)"
  })
  ```

### Schedule Utility Functions

#### `schedule_sum(schedule, column)`
Sum all values in a schedule column.
- **Example:** `schedule_sum(sched, "period_amount")` → 1200.0
#### `schedule_first(schedule, column)` / `schedule_last(schedule, column)`
Get the first or last value of a column.
- **Example:** `schedule_last(sched, "period_amount")` → Final period amount

#### `schedule_filter(schedule, column, operator, value)`
Filter schedule rows. Operators: "eq", "gt", "gte", "lt", "lte", "between".
- **Example:** `schedule_filter(sched, "period_amount", "gt", 100)`

---

## Generic Multi-Item Schedule Functions

These functions generate schedules for **multiple items** (sub-instruments, products, assets) using pre-defined templates or custom column definitions. This is the recommended approach for:
- Revenue recognition (ASC 606)
- Expense amortization
- Interest/fee accruals
- FAS-91 fee amortization
- Asset depreciation
- Lease schedules (ASC 842)
- Any time-based allocation across multiple items

### Available Templates

| Template | Description | Key Columns |
|----------|-------------|-------------|
| `revenue` | Revenue recognition (ASC 606) - daily proration | period_amount, daily_amount |
| `straight_line` | Straight-line amortization (equal periods) | period_amount, cumulative, remaining |
| `accrual` | Interest/fee accrual - daily basis | period_accrual, cumulative_accrual |
| `fas91` | FAS-91 fee amortization | period_amortization |
| `depreciation` | Asset depreciation - straight line | period_depreciation, accumulated_depreciation |
| `lease` | Lease schedule (ASC 842) | lease_expense, cumulative_expense, remaining_liability |

### `generate_schedules(amounts, start_dates, end_dates, columns, freq?, context?, item_names?, subinstrument_ids?)`

Generate schedules for multiple items with custom column definitions.

- **Parameters:**
  - `amounts`: Array of amounts per item
  - `start_dates`: Array of start dates per item
  - `end_dates`: Array of end dates per item
  - `columns`: Dictionary of column_name: DSL_expression
  - `freq`: Frequency - "M", "Q", "A", "W", "D" (default "M")
  - `context`: Additional variables for expressions (e.g., `{"rate": 0.05}`)
  - `item_names`: Optional names for each item
  - `subinstrument_ids`: Optional sub-instrument IDs
- **Returns:** Array of result objects containing:
  - `item_index`, `item_name`, `subinstrument_id`
  - `amount`, `start_date`, `end_date`, `total_periods`
  - `schedule`: The generated schedule array
  - `total`: Sum of period amounts

**Example - Revenue Recognition:**
```python
# Generate revenue schedules for 3 products
results = generate_schedules(
    [1200, 600, 0],                              # Amounts
    ["2026-01-01", "2026-01-01", "2026-01-01"],  # Start dates
    ["2026-12-31", "2026-06-30", "2026-12-31"],  # End dates
    {                                            # Column definitions
        "period_date": "period_date",
        "days_in_period": "add(days_between(start_of_month(period_date), end_of_month(period_date)), 1)",
        "daily_revenue": "divide(amount, 365)",
        "period_revenue": "multiply(daily_revenue, days_in_period)"
    },
    "M",                                         # Monthly
    None,                                         # No extra context
    ["Product A", "Product B", "Discount"],      # Names
    ["SUB-001", "SUB-002", "SUB-003"]           # Sub-instrument IDs
)
```

**Example - Asset Depreciation:**
```python
# Depreciate 2 assets over time with salvage value
results = generate_schedules(
    [50000, 30000],                    # Asset costs
    ["2026-01-01", "2026-01-01"],      # Start dates
    ["2030-12-31", "2028-12-31"],      # End dates
    {
        "period_date": "period_date",
        "period_depreciation": "divide(subtract(amount, salvage_value), total_periods)",
        "accumulated": "multiply(period_depreciation, add(period_index, 1))"
    },
    "A",                               # Annual
    {"salvage_value": 5000},           # Salvage value in context
    ["Equipment", "Vehicle"]
)
```

### `get_schedules_array(results)`
Extract just the schedule arrays from results for printing or further processing.
- **Example:** `schedules = get_schedules_array(results)`

### `get_schedule_totals(results, column?)`
Extract the totals from results. If column is specified, sums that column from each schedule; otherwise uses the default total.
- **Example:** `totals = get_schedule_totals(results)` → [1200.0, 600.0, 0]
- **Example:** `ltd_totals = get_schedule_totals(results, "LTD_revenue")` → [sum of LTD_revenue for each item]

### `find_period_amounts(results, posting_date, amount_column?)`
Find the period amounts for each item at a specific posting date.
- **Returns:** Array of recognition results with `item_name`, `subinstrument_id`, `period_amount`
- **Example:**
  ```python
  recognition = find_period_amounts(results, "2026-03-15")
  # Returns: [
  #   {"item_name": "Product A", "subinstrument_id": "SUB-001", "period_amount": 101.92},
  #   {"item_name": "Product B", "subinstrument_id": "SUB-002", "period_amount": 50.96},
  #   ...
  # ]
  ```

### `create_schedule_transactions(recognition_results, posting_date, transaction_type?)`
Create transactions from period recognition results.
- **Example:**
  ```python
  recognition = find_period_amounts(results, postingdate)
  transactions = create_schedule_transactions(recognition, postingdate, "Revenue Recognition")
  ```

### `print_schedule(sched, title?)`
Print a schedule as a formatted table in the console.
- **Parameters:**
  - `sched`: Schedule array from `schedule()` or individual schedule
  - `title`: Optional title to display (default: "Schedule")
- **Example:**
  ```python
  s = schedule(period("2025-01-01", "2025-03-31", "M"), {"month": "period_date", "amt": "multiply(100, period_num)"})
  print_schedule(s, "Monthly Amounts")
  ```

### `print_all_schedules(schedules_or_results, item_names?)`
Print all schedules from generate_schedules results or schedule arrays.
- **Parameters:**
  - `schedules_or_results`: Either generate_schedules results dict or array of schedules
  - `item_names`: Optional list of names for each schedule
- **Example:**
  ```python
  results = generate_schedules(amounts, starts, ends, columns, "M", None, names)
  print_all_schedules(results)
  # Or with array:
  schedules = get_schedules_array(results)
  print_all_schedules(schedules, ["Product A", "Product B"])
  ```

### Complete Multi-Product Example

```python
# Multi-product revenue recognition workflow

# 1. Define product data (from CSV or hardcoded)
product_names = ["Software License", "Support", "Training"]
amounts = [12000, 2400, 600]
start_dates = ["2026-01-01", "2026-01-01", "2026-01-01"]
end_dates = ["2026-12-31", "2026-12-31", "2026-03-31"]
subinstrument_ids = ["PROD-001", "PROD-002", "PROD-003"]

# 2. Generate all schedules at once
results = generate_schedules(
    amounts, start_dates, end_dates,
    {
        "period_date": "period_date",
        "days_in_period": "add(days_between(start_of_month(period_date), end_of_month(period_date)), 1)",
        "daily_revenue": "divide(amount, 365)",
        "period_revenue": "multiply(daily_revenue, days_in_period)"
    },
    "M", None, product_names, subinstrument_ids
)

# 3. Get schedules for review
schedules = get_schedules_array(results)

# 4. Recognize revenue for posting date
recognition = find_period_amounts(results, postingdate)

# 5. Create transactions
transactions = create_schedule_transactions(recognition, postingdate, "Revenue Recognition")
```

---

## Aggregation Functions

#### `sum(col)`
Sum of values. None values are automatically ignored.
- **Parameters:** List of numbers
- **Returns:** Total (float)
- **Example:** `sum([100, 200, 300])` → 600
- **Example:** `sum([100, None, 200])` → 300

#### `sum_field(array, field)`
Sum a specific field from an array of objects/dictionaries. None values are treated as 0.
- **Parameters:**
  - `array`: List of dictionaries/objects
  - `field`: Name of the field to sum (string)
- **Returns:** Total (float)
- **Example:** `sum_field(recognition_results, "period_amount")` → 342.82
- **Use Case:** Summing amounts from results returned by `find_period_amounts()` or other functions that return arrays of objects

#### `avg(col)`
Average value.
- **Returns:** Mean (float)
- **Example:** `avg([100, 200, 300])` → 200

#### `min(col)`
Minimum value.
- **Returns:** Minimum (float)
- **Example:** `min([5, 2, 9])` → 2

#### `max(col)`
Maximum value.
- **Returns:** Maximum (float)
- **Example:** `max([5, 2, 9])` → 9

#### `count(col)`
Number of items.
- **Returns:** Count (int)
- **Example:** `count([1, 2, 3])` → 3

#### `weighted_avg(v, w)`
Weighted average.
- **Parameters:**
  - `v`: List of values
  - `w`: List of weights
- **Returns:** Weighted average (float)
- **Example:** `weighted_avg([10, 20], [1, 3])` → 17.5

#### `cumulative_sum(col)`
Running total.
- **Returns:** List of cumulative sums
- **Example:** `cumulative_sum([10, 20, 30])` → [10, 30, 60]

#### `mean(col)`
Arithmetic mean (same as avg).
- **Example:** `mean([10, 20])` → 15

#### `median(col)`
Middle value.
- **Example:** `median([10, 20, 30])` → 20

#### `variance(col)`
Statistical variance.
- **Example:** `variance([10, 20])` → 25

#### `std_dev(col)`
Standard deviation.
- **Example:** `std_dev([10, 20])` → 5

---

## Array & Iteration Functions

### Array Utility Functions

#### `array_length(arr)`
Get the length of an array.
- **Returns:** Integer count
- **Example:** `array_length([1, 2, 3])` → 3

#### `array_get(arr, index, default=None)`
Get element at index with optional default for out-of-bounds.
- **Example:** `array_get([10, 20, 30], 1)` → 20
- **Example:** `array_get([10, 20], 5, 0)` → 0

#### `array_first(arr, default=None)`
Get first element of array.
- **Example:** `array_first([10, 20, 30])` → 10

#### `array_last(arr, default=None)`
Get last element of array.
- **Example:** `array_last([10, 20, 30])` → 30

#### `array_slice(arr, start, end=None)`
Get slice of array from start to end index.
- **Example:** `array_slice([10, 20, 30, 40], 1, 3)` → [20, 30]

#### `array_reverse(arr)`
Reverse an array.
- **Example:** `array_reverse([1, 2, 3])` → [3, 2, 1]

#### `zip_arrays(arr1, arr2, ...)`
Combine multiple arrays into array of lists.
- **Example:** `zip_arrays([1, 2], ["a", "b"])` → [[1, "a"], [2, "b"]]

### Iteration Functions

#### `for_each(dates_arr, amounts_arr, date_var, amount_var, expression)`
Iterate over paired arrays and execute an expression for each pair.
- **Parameters:**
  - `dates_arr`: Array of dates
  - `amounts_arr`: Array of amounts
  - `date_var`: Variable name for date in expression
  - `amount_var`: Variable name for amount in expression
  - `expression`: DSL expression to execute
- **Example:** `for_each(dates, amounts, "d", "amt", "createTransaction(postingdate, d, 'CF', amt)")`

#### `for_each_with_index(array, var_name, expression, context?)`
Iterate over array with index available.
- **Parameters:**
  - `array`: Array to iterate over
  - `var_name`: Variable name for current element
  - `expression`: Expression to execute
  - `context`: Optional dict of external variables (other arrays, totals)
- **Special Variables:** `index` (current position), `count` (array length)
- **Example:** `for_each_with_index([100, 200], "x", "x * 1.1")` → [110, 220]
- **With Context:** 
  ```python
  for_each_with_index(names, "n", "array_get(values, index, 0)", {"values": [10, 20]})
  ```

#### `map_array(array, var_name, expression, context?)`
Transform each element of an array.
- **Parameters:**
  - `array`: Array to transform
  - `var_name`: Variable name for current element
  - `expression`: Transformation expression
  - `context`: Optional dict of external variables
- **Example:** `map_array([100, 200], "x", "x * 2")` → [200, 400]
- **With Context:**
  ```python
  map_array(names, "n", "iif(eq(n, 'Discount'), 0, array_get(esp, index, 0))", {"esp": [1200, 800]})
  ```

#### `array_filter(array, var_name, condition, context?)`
Filter array elements based on condition.
- **Parameters:**
  - `array`: Array to filter
  - `var_name`: Variable name for current element
  - `condition`: Boolean expression
  - `context`: Optional dict of external variables
- **Example:** `array_filter([100, 500, 200], "x", "x > 150")` → [500, 200]

---

## Conversion Functions

#### `fx_convert(v, rate)`
Currency conversion.
- **Parameters:**
  - `v`: Amount to convert
  - `rate`: Exchange rate
- **Returns:** Converted amount (float)
- **Example:** `fx_convert(100, 280)` → 28000 (USD to PKR)

#### `scale(v, factor)`
Scaling units.
- **Example:** `scale(5, 1000)` → 5000

#### `normalize(v, base)`
Normalize to base.
- **Example:** `normalize(200, 100)` → 2.0

#### `basis_points(rate)`
Converts rate to basis points.
- **Example:** `basis_points(0.025)` → 250

#### `from_bps(bps)`
Converts basis points to rate.
- **Example:** `from_bps(250)` → 0.025

---

## Usage Tips

1. **Use Native Python Syntax:** For simple operations, use Python directly
   ```python
   total = sum([100, 200, 300])
   doubled = [x * 2 for x in amounts]
   result = 0 if is_discount else value
   ```

2. **Lowercase Variable Names:** Avoid uppercase to prevent event reference conflicts
   ```python
   # ✅ Correct
   product_name = "Product A"
   total_ssp = 2000
   
   # ❌ Avoid (interpreted as EVENT_FIELD)
   PRODUCT_NAME = "Product A"
   ```

3. **Chaining Functions:** You can nest function calls
   ```python
   final = add(multiply(principal, rate), fee)
   ```

4. **Conditional Logic:** Use Python conditional expression or iif()
   ```python
   # Python style (recommended)
   payment = pmt(rate, term, balance) if balance > 0 else 0
   
   # DSL function style
   payment = iif(gt(balance, 0), pmt(rate, term, balance), 0)
   ```

5. **Date Calculations:** Always use ISO format (YYYY-MM-DD)
   ```python
   days = days_between(effectivedate, postingdate)
   ```

6. **Array Operations:** Use list comprehensions or DSL array functions
   ```python
   # List comprehension
   ssp_values = [0 if names[i].lower() == "discount" else values[i] for i in range(len(names))]
   
   # DSL function
   filtered = array_filter(amounts, "x", "x > 1000")
   ```

7. **Transaction Creation:** Use createTransaction() to emit results
   ```python
   interest = principal * rate / 12
   createTransaction(postingdate, effectivedate, "Interest", interest)
   
   # With subinstrumentid
   createTransaction(postingdate, effectivedate, "Product Revenue", 1000, "PROD-001")
   ```

---

## Transaction Functions

#### `createTransaction(postingdate, effectivedate, transactiontype, amount, subinstrumentid='1')`
Create a transaction record. This is the ONLY way to emit transactions in DSL code.
- **Parameters:**
  - `postingdate`: Transaction posting date (YYYY-MM-DD)
  - `effectivedate`: Transaction effective date (YYYY-MM-DD)
  - `transactiontype`: Description/type of the transaction
  - `amount`: Transaction amount (numeric)
  - `subinstrumentid`: Optional sub-instrument identifier (defaults to '1')
- **Note:** `instrumentid` is automatically set from current data row context
- **Examples:**
  ```python
  createTransaction("2024-01-15", "2024-01-15", "Interest Accrual", 1250.50)
  createTransaction(postingdate, effectivedate, "Revenue", amount, "PROD-001")
  ```
