const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      on: {
        proxyReq: (proxyReq) => {
          proxyReq.setHeader('x-api-key', process.env.REACT_APP_ANTHROPIC_KEY);
          proxyReq.setHeader('anthropic-version', '2023-06-01');
          proxyReq.setHeader('anthropic-dangerous-direct-browser-access', 'true');
        }
      }
    })
  );
};