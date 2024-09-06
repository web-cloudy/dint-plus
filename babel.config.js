module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@constants": "./src/constants",
          "@assets": "./src/assets",
          "@contexts": "./src/contexts",
          "@hooks": "./src/hooks",
          "@store": "./src/store",
          "@utils": "./src/utils",
          "@types": "./src/types",
          "@navigator": "./src/navigator",
          "@services": "./src/services",
        },
      },
    ],
  ],
};
