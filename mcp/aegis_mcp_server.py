# mcp/aegis_mcp_server.py (Updated handle_mcp_request function)

def send_json_rpc_response(request_id, result=None, error=None):
    response = {"jsonrpc": "2.0", "id": request_id}
    if error:
        response["error"] = error
    else:
        response["result"] = result
    
    print(json.dumps(response))
    sys.stdout.flush()

def handle_mcp_request(line):
    try:
        req = json.loads(line)
        method = req.get("method")
        req_id = req.get("id") # Will be None if it's a notification

        # JSON-RPC 2.0 Rule: Do not reply to notifications (requests without an ID)
        if req_id is None:
            return

        if method == "initialize":
            # ... [keep your existing initialize logic here] ...
            send_json_rpc_response(req_id, {
                "protocolVersion": "2026-07-28",
                "capabilities": {"tools": {}, "resources": {}},
                "serverInfo": {"name": "Project-AEGIS-MCP-Server", "version": "1.0.0"}
            })

        elif method == "tools/list":
            # ... [keep your existing tools/list logic here] ...
            pass 

        elif method == "tools/call":
            # ... [keep your existing tools/call logic here] ...
            pass

        else:
            # Standard JSON-RPC error for Method Not Found
            send_json_rpc_response(req_id, error={
                "code": -32601,
                "message": f"Method not found: {method}"
            })

    except json.JSONDecodeError:
        # Standard JSON-RPC error for Parse Error
        send_json_rpc_response(None, error={
            "code": -32700,
            "message": "Invalid JSON payload"
        })
    except Exception as e:
        sys.stderr.write(f"MCP Internal Error: {str(e)}\n")
        # Standard JSON-RPC error for Internal Error
        send_json_rpc_response(req.get("id"), error={
            "code": -32603,
            "message": "Internal A.E.G.I.S. error"
        })
