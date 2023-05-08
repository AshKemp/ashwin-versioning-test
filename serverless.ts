import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";
dotenv.config();

import hello from "@functions/hello";
import greeting from "@functions/greeting";

const functions = {
  hello,
  greeting,
};

const addVersionToFunctionName = (fnName: string) => {
  return fnName + process.env.VERSION;
};

const versionedFunctions = Object.fromEntries(
  Object.keys(functions).map((fName) => {
    return [[addVersionToFunctionName(fName)], functions[fName]];
  })
);

console.log(versionedFunctions);

const serverlessConfiguration: AWS = {
  // service: "api-version-test",
  service: "test" + process.env.VERSION,
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    region: "us-west-2",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      restApiId: process.env.REST_API_ID,
      restApiRootResourceId: process.env.VERSION_RESOURCE_ID,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  useDotenv: true,
  // import the function via paths
  functions: versionedFunctions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
