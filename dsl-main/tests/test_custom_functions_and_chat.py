"""
Backend API Tests for Fyntrac DSL Studio - Custom Functions and AI Chat Features
Tests: Custom Function CRUD, AI Chat with Context, DSL Functions API
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestCustomFunctionsCRUD:
    """Test Custom Functions CRUD operations"""
    
    test_function_id = None
    
    def test_get_custom_functions_list(self):
        """Test GET /api/custom-functions returns list"""
        response = requests.get(f"{BASE_URL}/api/custom-functions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Got {len(data)} custom functions")
    
    def test_create_custom_function(self):
        """Test POST /api/custom-functions creates new function"""
        payload = {
            "name": "test_interest_calc",
            "category": "Custom",
            "description": "Test function for calculating interest",
            "parameters": [
                {"name": "principal", "type": "decimal"},
                {"name": "rate", "type": "decimal"}
            ],
            "returnType": "decimal",
            "formula": "return principal * rate",
            "example": "result = test_interest_calc(1000, 0.05)"
        }
        
        response = requests.post(f"{BASE_URL}/api/custom-functions", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["message"] == "Custom function created successfully"
        TestCustomFunctionsCRUD.test_function_id = data["id"]
        print(f"SUCCESS: Created custom function with ID: {data['id']}")
    
    def test_verify_custom_function_created(self):
        """Verify the created function appears in the list"""
        response = requests.get(f"{BASE_URL}/api/custom-functions")
        assert response.status_code == 200
        data = response.json()
        
        # Find our test function
        test_func = next((f for f in data if f["name"] == "test_interest_calc"), None)
        assert test_func is not None, "Created function not found in list"
        assert test_func["description"] == "Test function for calculating interest"
        assert test_func["category"] == "Custom"
        assert len(test_func["parameters"]) == 2
        print("SUCCESS: Custom function verified in list")
    
    def test_custom_function_appears_in_dsl_functions(self):
        """Verify custom function appears in combined DSL functions list"""
        response = requests.get(f"{BASE_URL}/api/dsl-functions")
        assert response.status_code == 200
        data = response.json()
        
        # Find our test function with is_custom flag
        test_func = next((f for f in data if f["name"] == "test_interest_calc"), None)
        assert test_func is not None, "Custom function not found in DSL functions list"
        assert test_func.get("is_custom") == True, "Custom function should have is_custom=True"
        print("SUCCESS: Custom function appears in DSL functions with is_custom=True")
    
    def test_create_duplicate_function_fails(self):
        """Test creating duplicate function name fails"""
        payload = {
            "name": "test_interest_calc",  # Same name as before
            "category": "Custom",
            "description": "Duplicate function",
            "parameters": [{"name": "x", "type": "decimal"}],
            "returnType": "decimal",
            "formula": "return x",
            "example": ""
        }
        
        response = requests.post(f"{BASE_URL}/api/custom-functions", json=payload)
        assert response.status_code == 400
        print("SUCCESS: Duplicate function creation correctly rejected")
    
    def test_create_function_conflicting_with_builtin_fails(self):
        """Test creating function with built-in name fails"""
        payload = {
            "name": "compound_interest",  # Built-in function name
            "category": "Custom",
            "description": "Trying to override built-in",
            "parameters": [{"name": "x", "type": "decimal"}],
            "returnType": "decimal",
            "formula": "return x",
            "example": ""
        }
        
        response = requests.post(f"{BASE_URL}/api/custom-functions", json=payload)
        assert response.status_code == 400
        print("SUCCESS: Built-in function name conflict correctly rejected")
    
    def test_delete_custom_function(self):
        """Test DELETE /api/custom-functions/{id} removes function"""
        if not TestCustomFunctionsCRUD.test_function_id:
            pytest.skip("No test function ID available")
        
        response = requests.delete(f"{BASE_URL}/api/custom-functions/{TestCustomFunctionsCRUD.test_function_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Custom function deleted successfully"
        print("SUCCESS: Custom function deleted")
    
    def test_verify_function_deleted(self):
        """Verify deleted function no longer in list"""
        response = requests.get(f"{BASE_URL}/api/custom-functions")
        assert response.status_code == 200
        data = response.json()
        
        # Should not find our test function
        test_func = next((f for f in data if f["name"] == "test_interest_calc"), None)
        assert test_func is None, "Deleted function should not be in list"
        print("SUCCESS: Deleted function verified removed from list")
    
    def test_delete_nonexistent_function_returns_404(self):
        """Test deleting non-existent function returns 404"""
        response = requests.delete(f"{BASE_URL}/api/custom-functions/nonexistent-id-12345")
        assert response.status_code == 404
        print("SUCCESS: Delete non-existent function returns 404")


class TestAIChatWithContext:
    """Test AI Chat endpoint with context awareness"""
    
    def test_chat_endpoint_basic(self):
        """Test POST /api/chat returns response"""
        payload = {
            "message": "What is simple interest?",
            "session_id": None,
            "context": None
        }
        
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "session_id" in data
        assert len(data["response"]) > 0
        print(f"SUCCESS: Chat response received, session_id: {data['session_id'][:8]}...")
    
    def test_chat_with_context(self):
        """Test chat with full context (events, editor code, console output)"""
        payload = {
            "message": "Help me calculate interest for my loan event",
            "session_id": None,
            "context": {
                "events": [
                    {
                        "event_name": "LoanEvent",
                        "fields": [
                            {"name": "principal", "datatype": "decimal"},
                            {"name": "rate", "datatype": "decimal"},
                            {"name": "term", "datatype": "decimal"}
                        ]
                    }
                ],
                "editor_code": "// Calculate interest\nprincipal = 10000",
                "console_output": [
                    {"type": "info", "message": "Loading sample data..."},
                    {"type": "success", "message": "Sample data loaded"}
                ],
                "dsl_functions": [
                    {"name": "compound_interest", "params": "principal, rate, periods", "description": "Compound interest"}
                ]
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        # Response should reference the context (loan, interest, etc.)
        response_lower = data["response"].lower()
        assert any(word in response_lower for word in ["interest", "loan", "principal", "rate"]), \
            "Response should reference context"
        print("SUCCESS: Chat with context works correctly")
    
    def test_chat_session_continuity(self):
        """Test chat maintains session"""
        # First message
        payload1 = {
            "message": "Remember the number 42",
            "session_id": None,
            "context": None
        }
        
        response1 = requests.post(f"{BASE_URL}/api/chat", json=payload1)
        assert response1.status_code == 200
        session_id = response1.json()["session_id"]
        
        # Second message with same session
        payload2 = {
            "message": "What number did I mention?",
            "session_id": session_id,
            "context": None
        }
        
        response2 = requests.post(f"{BASE_URL}/api/chat", json=payload2)
        assert response2.status_code == 200
        assert response2.json()["session_id"] == session_id
        print("SUCCESS: Chat session continuity works")


class TestDSLFunctionsAPI:
    """Test DSL Functions API"""
    
    def test_get_dsl_functions(self):
        """Test GET /api/dsl-functions returns all functions"""
        response = requests.get(f"{BASE_URL}/api/dsl-functions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 100  # Should have 100+ built-in functions
        
        # Check structure of a function
        func = data[0]
        assert "name" in func
        assert "params" in func
        assert "description" in func
        assert "category" in func
        print(f"SUCCESS: Got {len(data)} DSL functions")
    
    def test_dsl_functions_include_custom(self):
        """Test DSL functions list includes custom functions with is_custom flag"""
        # First create a custom function
        payload = {
            "name": "test_custom_for_list",
            "category": "Custom",
            "description": "Test custom function",
            "parameters": [{"name": "x", "type": "decimal"}],
            "returnType": "decimal",
            "formula": "return x * 2",
            "example": ""
        }
        
        create_response = requests.post(f"{BASE_URL}/api/custom-functions", json=payload)
        assert create_response.status_code == 200
        func_id = create_response.json()["id"]
        
        try:
            # Get DSL functions
            response = requests.get(f"{BASE_URL}/api/dsl-functions")
            assert response.status_code == 200
            data = response.json()
            
            # Find custom function
            custom_func = next((f for f in data if f["name"] == "test_custom_for_list"), None)
            assert custom_func is not None
            assert custom_func.get("is_custom") == True
            print("SUCCESS: Custom functions included in DSL functions with is_custom flag")
        finally:
            # Cleanup
            requests.delete(f"{BASE_URL}/api/custom-functions/{func_id}")


class TestExistingAPIs:
    """Test existing APIs still work correctly"""
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Fyntrac DSL Studio API"
        print("SUCCESS: Root endpoint works")
    
    def test_get_events(self):
        """Test GET /api/events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Got {len(data)} events")
    
    def test_dsl_validate(self):
        """Test POST /api/dsl/validate"""
        payload = {
            "dsl_code": "interest = compound_interest(principal, rate, term)\ntransactiontype = \"Interest\"\namount = interest"
        }
        
        response = requests.post(f"{BASE_URL}/api/dsl/validate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        print("SUCCESS: DSL validation works")
    
    def test_get_templates(self):
        """Test GET /api/templates"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Got {len(data)} templates")
    
    def test_get_transaction_reports(self):
        """Test GET /api/transaction-reports"""
        response = requests.get(f"{BASE_URL}/api/transaction-reports")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Got {len(data)} transaction reports")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
