# nginx conf changes (farvees.xyz)

Added to both `server` blocks (hides the nginx version):

```nginx
server_tokens off;
```

Port 80 block: replaced the Certbot `if ($host = ...)` redirects and `return 404` with:

```nginx
listen 80;
return 301 https://$host$request_uri;
```
