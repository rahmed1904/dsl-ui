import io
import pytest
from fastapi.testclient import TestClient
from backend import server


# Ensure an event definition exists for the test
@pytest.fixture()
def client_with_events():
    # Create an app client and upload event definition once per test
    with TestClient(server.app) as c:
        csv_def = "EventName,EventField,DataType\nREV,PRODUCT_NAME,string\nREV,AMOUNT,decimal\nREV,postingdate,date\n"
        files = {"file": ("events.csv", io.BytesIO(csv_def.encode('utf-8')), "text/csv")}
        resp = c.post('/events/upload', files=files)
        assert resp.status_code == 200
        yield c


def test_csv_header_normalization_maps_headers(client_with_events):
    # Create a CSV where header varies in spacing/case/special chars
    csv_content = "Product Name,amount,Posting Date\nMy Product, ,2026-01-01\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content.encode('utf-8')), "text/csv")}
    # Call upload endpoint for event 'REV' using the fixture client
    c = client_with_events
    response = c.post('/event-data/upload/REV', files=files)
    assert response.status_code == 200
    data = response.json()

    # Confirm remapped_headers returned and PRODUCT_NAME mapped
    assert 'remapped_headers' in data
    remapped = data['remapped_headers']
    assert any(r['incoming'].lower().replace(' ', '') == 'productname' and r['mapped_to'] == 'PRODUCT_NAME' for r in remapped)

    # Confirm coercions indicates AMOUNT was coerced to 0
    assert data['coercions'] is not None
    assert data['coercions'].get('AMOUNT', 0) >= 1
 