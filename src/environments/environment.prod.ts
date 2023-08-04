import { b2cPolicies } from "src/app/auth-config";

export const environment = {
  production: true,
  max_file_size: 12,
  max_file_size_pqrs: 20,
  pageLenght: 10,
  baseUrl: {
    url: "https://apimanagementfinotex.azure-api.net/"
  },
  methods: {
    Sketch: "SalesDev/api/V1",
    Shared: "SharedDev/api/V1",
    Product: "SalesDev/api/V1",
    Sales: "SalesDev/api/V1",
    Customer: "CustomerDev/api/V1",
    MasterSales: "SalesDev/api/V1",
    MasterProduct: "SalesDev/api/V1",
    NotificationPush: "NotificationPushDev/api/V1",
    Brand: "BrandDev/api/V1",
    ShippingMasters: "ShippingMastersDev/api/V1",
    CommonMasters: "CommonMastersDev/api/V1",
    ProductionMasters: "ProductionMastersDev/api/V1",
    ApMaster:"ApMastersDev/api/V1",
    InventoryMasters:"inventorymastersdev/api/V1",
    Pqrs: "FinancialDev/api/V1",
    Redis: "UtilsQa/api/V1",
  },
  config: {    
    urlNotifications: "https://finotexfunctionsnotificationspushdev.azurewebsites.net/api/notifications/"
  },
  authB2c: {
    clientId: 'e8529ad6-7364-454a-afac-6c74edc7d5d3', // This is the ONLY mandatory field that you need to supply.
    authority: "https://FinotexB2C.b2clogin.com/FinotexB2C.onmicrosoft.com/B2C_1_Finotex_SignIn/", // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: '/',
    cacheLocation: 'localStorage'
  },
  auth: {
    clientId: '98c68b8e-0d50-4961-b352-5cd5040b1e1e',
    authority: 'https://login.microsoftonline.com/171cc8e3-fbee-43e4-b757-b08386005972',
    redirectUri: '/',
    cacheLocation: 'localStorage',
  }
};
