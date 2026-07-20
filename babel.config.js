// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
  plugins: [
    [
      // Yeh plugin .env file se variables ko import karne ke liye hai
      'module:react-native-dotenv',

      {
        moduleName: '@env', // Is naam se aap keys ko code mein import karenge
        path: '.env',       // .env file project root mein hai
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};