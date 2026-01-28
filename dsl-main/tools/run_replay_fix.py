import sys, os, requests
sys.path.insert(0, os.getcwd())
from backend.server import dsl_to_python_multi_event

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

# Load DSL from memory/replay_fix.dsl
with open('memory/replay_fix.dsl', 'r') as f:
    dsl = f.read()

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
