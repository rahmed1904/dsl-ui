import sys, os
# Ensure the parent directory is in PYTHONPATH for backend imports
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
from backend.server import dsl_to_python_multi_event

dsl = "REV_PRODUCTID = REV.PRODUCTID\nCATALOG_PRICE_arr = collect_all(CATALOG.PRICE)\nprint(CATALOG_PRICE_arr)"
all_event_fields = {
    'REV': {'fields':[{'name':'PRODUCTID','datatype':'string'},{'name':'SALE_PRICE','datatype':'decimal'}],'eventType':'activity'},
    'CATALOG': {'fields':[{'name':'PRODUCTID','datatype':'string'},{'name':'PRICE','datatype':'decimal'}],'eventType':'reference'}
}
print(dsl_to_python_multi_event(dsl, all_event_fields))
