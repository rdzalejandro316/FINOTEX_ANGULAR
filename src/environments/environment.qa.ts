import { b2cPolicies } from 'src/app/auth-config';

export const environment = {
  production: true,
  max_file_size: 12,
  max_file_size_pqrs: 20,
  pageLenght: 10,
  baseUrl: {
    url: "https://apimanagementfinotex.azure-api.net/"
  },
  methods: {
    Sketch: "SalesQa/api/V1",
    Shared: "SharedQa/api/V1",
    Product: "SalesQa/api/V1",
    Sales: "SalesQa/api/V1",
    Customer: "FinancialQa/api/V1",
    MasterSales: "SalesQa/api/V1",
    MasterProduct: "SalesQa/api/V1",
    NotificationPush: "UtilsQa/api/V1",
    Brand: "BrandQa/api/V1",
    ShippingMasters: "ShippingMastersQa/api/V1",
    Shipping: "SupplychainQa/api/V1",
    CommonMasters: "FinancialQa/api/V1",
    ProductionMasters: "SupplychainQa/api/V1",
    ApMaster:"FinancialQa/api/V1",
    InventoryMasters:"SupplychainQa/api/V1",
    Pqrs: "FinancialQa/api/V1",
    Redis: "UtilsQa/api/V1"
  },
  config: {    
    urlNotifications: "https://finotexfunctionsnotificationspushqa.azurewebsites.net/api/notifications/"
  },
  authB2c: {
    clientId: 'e8529ad6-7364-454a-afac-6c74edc7d5d3', // This is the ONLY mandatory field that you need to supply.
    authority:
      'https://FinotexB2C.b2clogin.com/FinotexB2C.onmicrosoft.com/B2C_1_Finotex_SignIn/', // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: '/',
    cacheLocation: 'localStorage',
  },
  auth: {
    clientId: '98c68b8e-0d50-4961-b352-5cd5040b1e1e',
    authority:
      'https://login.microsoftonline.com/171cc8e3-fbee-43e4-b757-b08386005972',
    redirectUri: '/',
    cacheLocation: 'localStorage',
  }
};
