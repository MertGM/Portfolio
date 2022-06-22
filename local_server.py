import http.server
import socketserver

port = 8000

handler = http.server.SimpleHTTPRequestHandler
handler.extensions_map[".js"] = "text/javascript"
handler.extensions_map[".mjs"] = "text/javascript"

with socketserver.TCPServer(("", port), handler) as httpd:
    print("serving at port", port);
    httpd.serve_forever()
