import axios from 'axios';

const oracleHTTPService = axios.create({
  timeout: 60000,
});

oracleHTTPService.interceptors.response.use((res) => {
  return res.data;
});

export const gnosisOracleService = oracleHTTPService;
