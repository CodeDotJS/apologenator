#!/usr/bin/env node

'use strict';

const os = require('os');
const fs = require('fs');
const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const online = require('is-online');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const opt = process.argv[3];
const dates = `${new Date()}`.split(' ')[4].split(':').join('-');
const saveOffline = `${os.homedir()}/.apology/`;
const saveApology = `${dates}.json`;
const end = process.exit;
const spinner = ora();

if (!arg) {
	console.log(`
	⚡⚡ ${chalk.yellow('Celebrity Perv Apology Generator')} ⚡⚡

  Usage   : apolo <command> ${chalk.dim('[option]')}

  Command :
   -g             Generate apologies

  Options :
   --offline      Generate apologies when offline [Default]
   --save         Save random apologies

  NOTE : --offline is auto if no connection found!

  Example :
   $ apolo -g
   $ apolo -g ${chalk.blue('--save')}
	`);
	end(1);
}

dns.lookup('apologygenerator.com', err => {
	if (err) {
		logUpdate();
		spinner.text = 'You are offline! Please wait...';
		spinner.start();
	} else {
		logUpdate();
		spinner.text = 'Generating apologies...';
		spinner.start();
	}
});

const returnMaxLength = obj => {
	const quote = obj.length;
	return Math.floor(Math.random() * quote);
};

const saveCheck = rootData => {
	if (!fs.existsSync(saveOffline)) {
		fs.mkdirSync(saveOffline);
		fs.writeFile(`${saveOffline}data.json`, rootData, err => {
			if (err) {
				logUpdate(err);
			}
		});
	}
};

if (arg === '-g') {
	online().then(res => {
		const data = res;
		const url = 'https://apologygenerator.com/assets/apology.json';
		if (data === true) {
			got(url, {
				json: true
			}).then(res => {
				spinner.text = 'Please wait...';
				const apology = res.body;
				const intro = apology.introduction;
				const sad = apology.sadness;
				const exp = apology.explanation;
				const con = apology.conclusion;
				got(url).then(res => {
					const resData = res.body;
					saveCheck(resData);
				});
				const apologies = `  ${intro[returnMaxLength(intro)] + ' ' + sad[returnMaxLength(sad)] + '  \n   ' + exp[returnMaxLength(exp)] + ' ' + con[returnMaxLength(con)]}  `;
				logUpdate(
					`
 ${apologies}
`
				);

				if ((arg === '-g') && opt === '--save') {
					const apg = {apology: []};
					apg.apology.push({apology: apologies});
					const savedApology = JSON.stringify(apg);
					fs.writeFile(saveApology, savedApology, 'utf-8', err => {
						if (err) {
							logUpdate(err);
						}
					});
					logUpdate(`
 Saved as ${chalk.green(saveApology)} in ${chalk.blue(process.cwd())}
 `);
				}
				spinner.stop();
			});
		}

		if (data === false) {
			const requireFile = `${saveOffline}data.json`;
			const dataSaved = require(requireFile);
			const intro = dataSaved.introduction;
			const sad = dataSaved.sadness;
			const exp = dataSaved.explanation;
			const con = dataSaved.conclusion;
			const apg = `  ${intro[returnMaxLength(intro)] + ' ' + sad[returnMaxLength(sad)] + '  \n   ' + exp[returnMaxLength(exp)] + ' ' + con[returnMaxLength(con)]}  `;
			logUpdate(
				`
  ${apg}
  `
			);
			end(1);
		}
	});
}
