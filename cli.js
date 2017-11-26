#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const log = console.log;
const end = process.exit;
const spinner = ora();

if (!arg) {
	log(`
	⚡⚡ ${chalk.yellow('Celebrity Perv Apology Generator')} ⚡⚡

  Usage   : apolo <command>

  Command :
   -g       Generate apologies
   -c       Show credits
   -h       Show help

  Help    :
   $ apolo -g ${chalk.dim('[-c]')} or ${chalk.dim('[-h]')}
	`);
	end(1);
}

if (arg === '-c') {
	log(`
  ${chalk.red('💚')}  Apologies by Dana Swartz

  ${chalk.yellow('🌠')}  She is ${chalk.magenta('@DanaSchwartzzz')} on Twitter
    `);
	end(1);
}

dns.lookup('apologygenerator.com', err => {
	if (err) {
		logUpdate(`\n ${chalk.red('✖')}  ${chalk.dim('Seems like your Intenret connection is fucked!')}\n`);
		end(1);
	} else {
		logUpdate();
		spinner.text = 'Generating Apologies...';
		spinner.start();
	}
});

const returnMaxLength = obj => {
	const quote = obj.length;
	return Math.floor(Math.random() * quote);
};

// Add - const para = nux => { return nux[returnMaxLength(nux)] };

if (arg === '-g') {
	const url = 'https://apologygenerator.com/assets/apology.json';

	got(url, {json: true}).then(res => {
		const apology = res.body;

		const intro = apology.introduction;
		const sad = apology.sadness;
		const exp = apology.explanation;
		const con = apology.conclusion;

		const apologies = `  ${intro[returnMaxLength(intro)] + ' ' + sad[returnMaxLength(sad)] + '  \n   ' + exp[returnMaxLength(exp)] + ' ' + con[returnMaxLength(con)]}  `;

		logUpdate(
			`
 ${apologies}
			`);

		spinner.stop();
	}).catch(err => {
		if (err) {
			end(1);
		}
	});
}
