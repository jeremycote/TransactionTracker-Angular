const devConfig = {
  API_URL: 'http://localhost:3000/api/v1',
};

const prodConfig = {
  API_URL: 'https://api.transactions.afetiveau.com/api/v1',
};

const config =
  process.env['NODE_ENV'] === 'production' ? prodConfig : devConfig;

export default config;
