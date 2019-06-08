// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  httpEndpoint: 'https://j4oowtw9ja.execute-api.us-west-2.amazonaws.com/dev',
  authEndpoint: 'https://garlic-xu.auth.us-west-2.amazoncognito.com/login',
  authClientId: '13fhbh31qgpmspg5369sr70cpr',
  authCallbackUrl: 'http://localhost:4200/login',
  userInfoEndpoint: 'https://garlic-xu.auth.us-west-2.amazoncognito.com/oauth2/userInfo',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
