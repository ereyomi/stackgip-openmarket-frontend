// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  identityApi: "https://openmarketauth.herokuapp.com/api/v1/",
  // identityApi: "http://localhost:59906/api/v1/",
  ecommerceApi: "https://openmarket-ecommerce.herokuapp.com/api/v1/",
  // ecommerceApi: "https://localhost:44319/api/v1/",
  paystackPublicKey: "pk_test_8e75de0f0e2bba17ee0b37ed227e176b92b52d0b",
  googleClientId: "473446857855-9fmn8dnefe3b9mvm046sdq35echrss1l.apps.googleusercontent.com",
  facebookAppId: "824459011487587",
  cloudinaryName: "dimxqjzpr",
  cloudinaryUploadPerset: "unsigned1_openmarket",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
