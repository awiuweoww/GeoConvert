import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: {
		main: "./src/main.tsx"
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"]
	},
	experiments: {
		css: true
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: {
									"@tailwindcss/postcss": {},
									autoprefixer: {}
								}
							}
						}
					}
				],
				type: "css"
			},
			{
				test: /\.(ts|tsx)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic"
									}
								}
							}
						}
					}
				],
				type: "javascript/auto"
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.rspack.html"
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: "public",
					to: "."
				}
			]
		})
	],
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist-rspack"),
		clean: true
	}
});
