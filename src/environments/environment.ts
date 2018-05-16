// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDTA8-Q-4yNAlA9YYgFklkGBZyjTR34Sck',
    authDomain: 'sofia-swing-dance-festival.firebaseapp.com',
    databaseURL: 'https://sofia-swing-dance-festival.firebaseio.com',
    projectId: 'sofia-swing-dance-festival',
    storageBucket: 'sofia-swing-dance-festival.appspot.com',
    messagingSenderId: '518270031868'
  }
};
