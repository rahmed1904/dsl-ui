
import sys, os, requests
# Ensure the parent directory is in PYTHONPATH for backend imports
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
from backend.server import dsl_to_python_multi_event

# Fetch event definitions and data from local API
api = 'http://localhost:8000'
resp = requests.get(api + '/api/events')
events = resp.json()
print('events:', events)
# Build all_event_fields mapping
all_event_fields = {}
for ev in events:
    all_event_fields[ev['event_name']] = {'fields': ev.get('fields', []), 'eventType': ev.get('eventType','activity')}

# Fetch event data
event_data = {}
for name in all_event_fields.keys():
    r = requests.get(api + f'/api/event-data/{name}')
    event_data[name] = r.json().get('data_rows', [])

# DSL
dsl = "REV_PRODUCTID = REV.PRODUCTID\nprint('REV_PRODUCTID->', REV_PRODUCTID)\nCATALOG_PRICE_arr = collect_all(CATALOG.PRICE)\nprint('CATALOG_PRICE_arr->', CATALOG_PRICE_arr)\nREV_SALE_PRICE_arr = collect_by_instrument(REV.SALE_PRICE)\nprint('REV_SALE_PRICE_arr->', REV_SALE_PRICE_arr)"

python_code = dsl_to_python_multi_event(dsl, all_event_fields)
print('--- GENERATED TEMPLATE ---')
print(python_code)

# Execute template
exec_globals = {'__file__': os.path.abspath('backend/server.py'), '__name__': '__dsl_test__'}
exec(compile(python_code, '<dsl_test>', 'exec'), exec_globals)
if 'set_raw_event_data' in exec_globals:
    exec_globals['set_raw_event_data'](event_data)

process_fn = exec_globals.get('process_event_data')
if not process_fn:
    print('no process function')
else:
    results = process_fn([{}])
    print('Results:', results)
    if 'get_print_outputs' in exec_globals:
        print('prints:', exec_globals['get_print_outputs']())
