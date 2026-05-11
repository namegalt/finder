import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "sqlite-crud",
		identifier: "sqlitecrud.electrobun.dev",
		version: "0.0.1",
	},
	build: {
		bun: {
			entrypoint: "src/bun/index.ts",
		},
		views: {
			mainview: {
				entrypoint: "src/mainview/index.ts",
			},
		},
		copy: {
			"src/mainview/index.html": "views/mainview/index.html",
			"src/mainview/index.css": "views/mainview/index.css",
			// "src/mainview/assets/orlan.jpg": "views/mainview/assets/orlan.jpg",
			// "src/mainview/assets/supercam.jpg": "views/mainview/assets/supercam.jpg",
			// "src/mainview/assets/zala.jpg": "views/mainview/assets/zala.jpg",
			// "src/mainview/assets/merlin.jpg": "views/mainview/assets/merlin.jpg",
			// "src/mainview/assets/gerbera.jpg": "views/mainview/assets/gerbera.jpg",
		},
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: false,
		},
		win: {
			bundleCEF: false,
		},
	},
} satisfies ElectrobunConfig;
