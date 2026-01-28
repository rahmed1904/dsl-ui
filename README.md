# DSL UI Repository

## DSL helper: `days_to_next`

`days_to_next(current_date, next_date, default=0)`

- Description: Calculate signed days from a current line item's date to the next line item's date. Returns `(next - current).days` as an integer. If `next_date` is missing or invalid, returns the provided `default` (0 by default).
- Input formats: Accepts `YYYY-MM-DD` strings or datetime objects (uses existing `normalize_date` parsing).

Example:

```
# Inside a `schedule()` column expression
days_to_next(period_date, period_start)
```

This helper is useful for accruals, proration, duration metrics, and other schedule-based calculations.

Project structure: see repository files for frontend, backend, and examples.
# Here are your Instructions
