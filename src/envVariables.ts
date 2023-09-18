const devConfig = {
  API_URL: 'http://localhost:3000/api/v1',
};

const prodConfig = {
  API_URL: process.env['TRANSACTION_API_URL'],
};

const config =
  process.env['NODE_ENV'] === 'production' ? prodConfig : devConfig;

export default config;
