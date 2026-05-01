import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from 'transbank-sdk';

const commerceCode = process.env.TBK_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.TBK_API_KEY_SECRET || IntegrationApiKeys.WEBPAY;

// Configuramos la opción con el código de comercio, api key y el entorno de integración.
const options = new Options(commerceCode, apiKey, Environment.Integration);

// Exportamos la instancia configurada explícitamente para Integración
export const webpayTransaction = new WebpayPlus.Transaction(options);
