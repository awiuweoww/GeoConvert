import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked
		],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ["./tsconfig.app.json", "./tsconfig.node.json"],
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			jsdoc
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true }
			],

			// JSDoc rules
			"jsdoc/check-access": 1,
			"jsdoc/check-alignment": 1,
			"jsdoc/check-param-names": 1,
			"jsdoc/check-property-names": 1,
			"jsdoc/check-tag-names": 1,
			"jsdoc/check-values": 1,
			"jsdoc/empty-tags": 1,
			"jsdoc/implements-on-classes": 1,
			"jsdoc/multiline-blocks": 1,
			"jsdoc/no-multi-asterisks": 1,
			"jsdoc/require-jsdoc": [
				"warn",
				{
					contexts: [
						"FunctionDeclaration",
						"MethodDefinition",
						"VariableDeclaration > VariableDeclarator > ArrowFunctionExpression"
					]
				}
			],
			"jsdoc/require-param": 1,
			"jsdoc/require-param-description": 1,
			"jsdoc/require-param-name": 1,
			"jsdoc/require-property": 1,
			"jsdoc/require-property-description": 1,
			"jsdoc/require-property-name": 1,
			"jsdoc/require-returns": 1,
			"jsdoc/require-returns-check": 1,
			"jsdoc/require-returns-description": 1,
			"jsdoc/require-yields": 1,
			"jsdoc/require-yields-check": 1,

			// TS rules
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/ban-ts-comment": "warn",
			"@typescript-eslint/no-inferrable-types": "off",

			"max-lines": [
				"warn",
				{ max: 500, skipBlankLines: true, skipComments: true }
			]
		}
	}
);
