# Fyntrac DSL Studio - Product Requirements Document

## Original Problem Statement
Build a web application "Fyntrac DSL Studio" for finance professionals that allows:
1. Event & DSL Definition via CSV uploads
2. Data handling with MongoDB persistence
3. DSL Editor/Playground for calculation logic
4. AI Chatbot Assistant for DSL code help
5. Template management and execution
6. Transaction report generation

## Tech Stack
- **Frontend:** React + Shadcn UI + Monaco Editor + Tailwind CSS
- **Backend:** Python FastAPI
- **Database:** MongoDB
- **AI:** Google Gemini (`gemma-3-27b-it`) via `GOOGLE_API_KEY` (Google Cloud Generative AI) 

## Core Architecture
```
/app/
├── backend/
│   ├── server.py         # Main FastAPI app with all endpoints
│   ├── dsl_functions.py  # 112 hardcoded financial DSL functions
│   └── .env              # MONGO_URL, GOOGLE_API_KEY
├── frontend/
│   └── src/
│       ├── components/   # UI components
│       └── pages/
│           └── Dashboard.js  # Main dashboard
└── memory/
    └── PRD.md           # This file
```

## What's Been Implemented

### Core Features (Completed)
- [x] Event Definition Upload (CSV with EventName, EventField, DataType)
- [x] Event Data Upload per event type
- [x] DSL Editor with Monaco syntax highlighting
- [x] 112 Pre-loaded Financial DSL Functions (hardcoded)
- [x] DSL-to-Python conversion engine
- [x] Template saving and execution
- [x] Transaction Report generation with CSV download
- [x] AI Chatbot Assistant with context awareness
- [x] Test with Sample Data feature
- [x] Clear All Data feature

### Recent Additions (Jan 2026)
- [x] **Custom Function Builder** - UI for users to create their own DSL functions
  - CRUD operations (create, read, delete)
  - MongoDB persistence
  - Runtime registration for immediate use
  - Categories, parameters, return types, formulas
  - Validation against built-in function names
  
- [x] **Enhanced AI Assistant Context**
  - Now reads: events, editor code, console output, all DSL functions (including custom)
  - No copy-paste needed - assistant has full visibility
  - Active Context badges show what's visible
  
- [x] **Insert to Editor Formatting**
  - Text explanations get `//` comment prefix
  - DSL formulas remain uncommented
  - Proper code block handling

- [x] **Authentication & Branding**
  - Login page with Fyntrac logo
  - Single user authentication (admin@fyntrac.com)
  - Sign Out button in sidebar
  - Renamed from "Fyntrac DSL Studio" to "DSL Studio"
  - Fyntrac logo replaces "REFERENCE" text in sidebar

### Bug Fixes (Dec 2025)
- [x] **DSL Functions Library Bug Fixes (P0):**
  - Fixed `sum_of_years()` DivisionByZero when `life=0`
  - Fixed `switch()` fragility - now handles non-dict cases gracefully
  - Removed redundant top-level `lag()` function (schedule's internal lag still works)

### Feature Additions (Dec 2025)
- [x] **Beautify Button:** Added code beautification feature in console (formats indentation, spacing)
- [x] **createTransaction() Function:** New mandatory function for creating transactions
  - Syntax: `createTransaction(postingdate, effectivedate, transactiontype, amount)`
  - Replaced the old auto-detection of `amount =` pattern
  - instrumentid is automatically set from current data row context
  - Updated Browse Functions, chatbot context, and sample code
- [x] **Event-Specific Dates:** Access `EVENT.postingdate` and `EVENT.effectivedate` for each event in multi-event scenarios
- [x] **Import Inputs Button:** Removed date override inputs, added Import Inputs button
- [x] **Single Postingdate Validation:** Excel upload now validates all events have same postingdate
- [x] **Graceful Transaction Skip:** createTransaction skips if dates are empty (event data missing)
- [x] **Enhanced Import Inputs:** Now generates both single-value variables AND collected arrays for multi-row support
- [x] **Iteration Functions (4 new):** `for_each`, `for_each_with_index`, `map_array`, `array_filter`
- [x] **Array Utility Functions (7 new):** `zip_arrays`, `array_length`, `array_get`, `array_first`, `array_last`, `array_slice`, `array_reverse`
- [x] **subInstrumentId Support:** New standard field for child entities within an instrumentId
  - Hierarchy: postingDate → instrumentId → subInstrumentId → effectiveDates
  - Defaults to "1" if column missing or null in data
  - New functions: `collect_by_subinstrument()`, `collect_subinstrumentids()`, `collect_effectivedates_for_subinstrument()`
  - Updated sidebar, autocomplete, Import Inputs, and chatbot context
- [x] **Total 133 functions** across 16 categories (up from 118)

## Key API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | List all event definitions |
| `/api/events/upload` | POST | Upload event definitions CSV |
| `/api/event-data/upload/{event_name}` | POST | Upload event data CSV |
| `/api/dsl-functions` | GET | Get all DSL functions (built-in + custom) |
| `/api/custom-functions` | GET/POST/DELETE | CRUD for custom functions |
| `/api/templates` | GET/POST/DELETE | Manage DSL templates |
| `/api/templates/execute` | POST | Run template on event data |
| `/api/transaction-reports` | GET | List transaction reports |
| `/api/chat` | POST | AI chat with context |
| `/api/load-sample-data` | POST | Load demo data |
| `/api/clear-all-data` | DELETE | Reset all data |

## Data Models
- **EventDefinition:** id, event_name, fields[{name, datatype}], created_at
- **EventData:** id, event_name, data_rows[], created_at
- **DSLTemplate:** id, name, dsl_code, python_code, created_at
- **CustomFunction:** id, name, category, description, parameters[], return_type, formula, example
- **TransactionReport:** id, template_name, event_name, transactions[], executed_at

## Prioritized Backlog

### P1 (High Priority)
- [ ] Data Visualization - charts for transaction analysis

### P2 (Medium Priority)
- [ ] Template versioning and sharing
- [ ] Favorite/bookmark DSL functions
- [ ] Export/import templates

### P3 (Low Priority)
- [ ] Backend refactoring (split monolithic server.py)
- [ ] Frontend state management refactoring

## Known Deviations
- **Backend Language:** Implemented in Python/FastAPI instead of originally requested Java/Spring Boot. User has not complained.

## Test Coverage
- Backend: 19 tests covering custom functions CRUD, AI chat, existing APIs
- Frontend: UI testing verified all features working
- Test files: `/app/tests/test_custom_functions_and_chat.py`

---
*Last Updated: January 17, 2026*

## Updated DSL Example — Implicit multi-subInstrument schedules

This example shows the simplified, finance-friendly DSL where a single
`schedule(...)` call creates one schedule per `subinstrument_id` when arrays
of `start_dates`/`end_dates` are provided.

```dsl
##=== Single-value fields (latest/merged row) ===
EOD_postingdate = EOD.postingdate
EOD_effectivedate = EOD.effectivedate
EOD_subinstrumentid = EOD.subinstrumentid
EOD_BILLING = EOD.BILLING
EOD_UNBILLED = EOD.UNBILLED
EOD_REVENUE = collect_by_instrument(EOD.REVENUE)

##REV single value
posting_date = REV.postingdate

##=== REV collected arrays (all rows for instrument) ===
REV_effectivedates_arr = collect_by_instrument(REV.effectivedate)
subinstrument_ids = collect_by_instrument(REV.subinstrumentid)
product_names = collect_by_instrument(REV.PRODUCT_NAME)
REV_SALE_PRICE_arr = collect_by_instrument(REV.SALE_PRICE)
REV_QUANTITY_arr = collect_by_instrument(REV.QUANTITY)
esp_values = collect_by_instrument(REV.EXTENDED_SALEPRICE)
start_dates = collect_by_instrument(REV.ITEM_STARTDATE)
end_dates = collect_by_instrument(REV.ITEM_ENDDATE)

##=== SECTION 1: revenue allocation ===
ssp_values = map_array(product_names, "name",
  "iif(eq_ignore_case(name, 'discount'), 0, array_get(esp_values, index, 0))",
  {"esp_values": esp_values}
)
total_ssp = sum(ssp_values)

alloc_pcts = map_array(ssp_values, "ssp",
  "iif(gt(total_ssp, 0), divide(ssp, total_ssp), 0)",
  {"total_ssp": total_ssp}
)

total_esp = sum(esp_values)

allocated_revenues = map_array(alloc_pcts, "pct",
  "multiply(pct, total_esp)",
  {"total_esp": total_esp}
)

print("Allocated Revenues:", allocated_revenues)

##=== SECTION 2: per-sub-instrument schedules (implicit multi-item schedule) ===
# Create a period descriptor that represents arrays of per-item start/end dates
p = period(start_dates, end_dates, "M")

COLUMNS = {
  "period_date": "period_date",
  "month_end": "end_of_month(period_date)",
  "days": "iif(eq(start_date, end_date), add(days_between(start_of_month(period_date), end_of_month(period_date)), 1), iif(eq(period_index, 0), days_between(start_date, end_of_month(start_date)), iif(eq(period_index, subtract(total_periods, 1)), add(days_between(start_of_month(end_date), end_date), 1), add(days_between(start_of_month(period_date), end_of_month(period_date)), 1))))",
  "LTD_days": "iif(eq(normalize_date(start_date), normalize_date(end_date)), add(days_between(start_of_month(start_date), end_of_month(end_date)), 1), iif(eq(normalize_date(period_date), normalize_date(end_date)), days_between(start_date, end_date), days_between(start_date, end_of_month(period_date))))",
  "daily_revenue": "iif(eq(normalize_date(start_date), normalize_date(end_date)), divide(amount, days), divide(amount, 365))",
  "period_revenue": "multiply(multiply(daily_revenue, days), -1)",
  "LTD_revenue": "multiply(iif(lt(normalize_date(period_date), normalize_date(subtract_months(posting_date, 1))), multiply(daily_revenue, days), 0), -1)"
}

SCHEDULES = schedule(
  p,
  COLUMNS,
  {
    "start_dates": start_dates,
    "end_dates": end_dates,
    "amounts": allocated_revenues,
    "subinstrument_ids": subinstrument_ids,
    "posting_date": posting_date
  }
)



recognition_results = schedule_filter(SCHEDULES,"month_end","posting_date","period_revenue")

print(recognition_results)




# Sum LTD_revenue for each schedule separately

recognition_results_LTD = schedule_sum(SCHEDULES, "period_revenue")

print(recognition_results_LTD)


last = schedule_last(SCHEDULES, "period_revenue")

print(last)

first = schedule_first(SCHEDULES, "period_revenue")

print(first)

createTransaction(posting_date, posting_date, "Revenue", recognition_results,subinstrument_ids)

total_revenue = sum_field(recognition_results, "period_amount")
```
# ─── ECF Single Values (merged/latest row) ───

MeasurementType = collect_by_instrument(ECF.MeasurementType)
StartDate = collect_by_instrument(ECF.StartDate)
ExpectedCF = collect_by_instrument(ECF.ExpectedCF)

# ─── EOD Single Values (merged/latest row) ───
postingdate = EOD.postingdate
effectivedate = EOD.effectivedate
subinstrumentid = EOD.subinstrumentid
OriginationDate = EOD.OriginationDate
LoanAmount = EOD.LoanAmount
Term = EOD.Term
NoteRate = EOD.NoteRate
UPB = iif(eq(normalize_date(OriginationDate),normalize_date(postingdate)),LoanAmount,EOD.UPB)
priotImpairment = EOD.Impairment
Monthly_Rate = NoteRate/1200
PMT_AM = pmt(Monthly_Rate,Term,-LoanAmount)
First_Month = months_between(normalize_date(OriginationDate),normalize_date(postingdate))
maturitydate = add_months(normalize_date(OriginationDate),Term)

# --- Define the period
p = period(postingdate, maturitydate, "M")

#---- Create the schedule
sched = iif(eq(normalize_date(OriginationDate),normalize_date(postingdate)),0,schedule(p, {
        "period_date": "period_date",
        "month_end": "end_of_month(period_date)",
        "monthNumber": "iif(eq(period_index,0),First_Month,lag('monthNumber',1,First_Month)+1)",
        "openingBalance": "iif(eq(period_index,0),UPB,lag('closingBalance',1,0))",
         "interestAccrued": "multiply(openingBalance,Monthly_Rate)",
         "contractualCF": "iif(eq(normalize_date(month_end),normalize_date(maturitydate)),add(interestAccrued,lag('closingBalance',1,0)),PMT_AM)",
              "ExpectedCFA": "lookup(ExpectedCF, normalize_arraydate(StartDate), normalize_date(month_end))",
              "principalPayment": "contractualCF-interestAccrued",
              "closingBalance": "subtract(openingBalance,principalPayment)",
              "discountFactor": "1/pow(1+Monthly_Rate, monthNumber)",
              "PV_CCF": "multiply(discountFactor,contractualCF)",
              "PV_ECF": "multiply(discountFactor,ExpectedCFA)",
              "impairmentCurrent": "subtract(PV_ECF,PV_CCF)"

        
    }, {"postingdate": postingdate, "UPB": UPB, "Monthly_Rate":Monthly_Rate, "PMT_AM":PMT_AM, "ExpectedCF": ExpectedCF, "StartDate":StartDate, "maturitydate":maturitydate,"First_Month":First_Month}))


#----- Print the schedule
print(sched)

PeriodImpairment = schedule_sum(sched, "impairmentCurrent")

print("PeriodImpairment:", PeriodImpairment)

netImpairment = subtract(PeriodImpairment,priotImpairment)

print("priotImpairment:", priotImpairment)
print("netImpairment:", netImpairment)

interestAccrual = schedule_first(sched, "interestAccrued")

print("interestAccrual:", interestAccrual)


createTransaction(postingdate, effectivedate, "Impairment_Gain", iif(gt(PeriodImpairment,0),PeriodImpairment,0), subinstrumentid)
createTransaction(postingdate, effectivedate, "Impairment_Loss", iif(lt(netImpairment,0),netImpairment,0), subinstrumentid)
createTransaction(postingdate, effectivedate, "Interest_Accrual", iif(eq(normalize_date(OriginationDate),normalize_date(postingdate)),0,interestAccrual), subinstrumentid)
createTransaction(postingdate, effectivedate, "Origination_Principal", iif(eq(normalize_date(OriginationDate),normalize_date(postingdate)),LoanAmount,0), subinstrumentid)

