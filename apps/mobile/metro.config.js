// Expo + NativeWind + pnpm 모노레포 Metro 설정.
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 모노레포: 루트와 packages/core 까지 watch + node_modules 탐색 경로 확장.
// node-linker=hoisted 라서 심링크/계층탐색 오버라이드는 불필요(expo 기본값 사용).
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
