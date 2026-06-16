import http.server
import socketserver
import threading
import time
import os
import sys

# Change directory to the pagsefhs directory where this script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS and caching headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server(port):
    Handler = MyHTTPRequestHandler
    while True:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"SUCCESS_PORT:{port}")
                sys.stdout.flush()
                httpd.serve_forever()
        except OSError:
            # Port busy, try next one
            port += 1

if __name__ == '__main__':
    port = 8080
    server_thread = threading.Thread(target=start_server, args=(port,))
    server_thread.daemon = True
    server_thread.start()
    
    print(f"Server starting on http://localhost:{port}")
    print("Press Ctrl+C to stop the server.")
    sys.stdout.flush()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping server...")
