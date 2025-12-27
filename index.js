export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = 'https://eldardo.net' + url.pathname + url.search;

    try {
      const res = await fetch(target, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const contentType = res.headers.get('content-type') || '';
      const headers = new Headers(res.headers);
      headers.set('X-Frame-Options', 'ALLOWALL');
      headers.set('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; frame-ancestors *");

      if (contentType.includes('text/html')) {
        let html = await res.text();
        html = html.replace(/https:\/\/eldardo\.net\//g, '/');
        html = html.replace(/http:\/\/eldardo\.net\//g, '/');
        return new Response(html, { status: res.status, headers });
      }

      return new Response(await res.arrayBuffer(), { status: res.status, headers });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  }
}
