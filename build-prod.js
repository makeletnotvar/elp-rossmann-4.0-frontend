const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
	return new Promise((resolve, reject) => {
		const process = exec(command);

		process.stdout.on('data', data => {
			console.log(data.toString().trim());
		});

		process.stderr.on('data', data => {
			console.error(data.toString().trim());
		});

		process.on('exit', code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`>> Command "${command}" exited with code ${code}.`));
			}
		});
	});
}

async function runTests() {
	try {
		console.log('>> Running tests...');
		await runCommand('yarn test_project_coverage');
		console.log('>> Tests completed successfully.');
	} catch (error) {
		throw new Error('>> Tests failed.');
	}
}

async function copyChangelog() {
	try {
		const src = path.resolve(__dirname, 'changelog.md');
		const dest = path.resolve(__dirname, 'public', 'changelog.md');
		fs.copyFileSync(src, dest);
		console.log('>> changelog.md copied to public directory.');
	} catch (error) {
		throw new Error('>> Failed to copy changelog.md.');
	}
}

async function buildApp() {
	try {
		console.log('>> Copying changelog.md to public directory...');
		await copyChangelog();
		console.log('>> Building the application in production mode...');
		await runCommand('tsc && vite build --mode production');
		console.log('>> Application build completed successfully.');
	} catch (error) {
		throw new Error('>> Build failed.');
	}
}

async function runVersionScript() {
	try {
		console.log('>> Running version script...');
		await runCommand('node version.js');
		console.log('>> Version script completed successfully.');
	} catch (error) {
		throw new Error('>> Version script failed.');
	}
}

async function checkUnusedDependencies() {
	try {
		console.log('>> Checking for unused dependencies with depcheck...');
		const output = await new Promise((resolve, reject) => {
			exec('depcheck --skip-missing=true --ignores="typescript,@vitest/coverage-v8"', (error, stdout) => {
				if (error) {
					reject(new Error(stdout));
				} else {
					resolve(stdout);
				}
			});
		});
		console.log('>> Depcheck output:', output);
	} catch (error) {
		throw new Error(`>> Depcheck failed:\n${error.message}`);
	}
}

async function scanForVulnerabilities() {
	try {
		console.log('>> Scanning for vulnerabilities with Snyk...');
		await runCommand('snyk test');
		console.log('>> Vulnerability scan completed successfully.');
	} catch (error) {
		throw new Error('>> Snyk scan failed.');
	}
}

async function runAllTasks() {
	try {
		// await runTests();
		// await runVersionScript();
		await buildApp();
		// await checkUnusedDependencies();
		// await scanForVulnerabilities();
		console.log('>> All tasks completed successfully.');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

runAllTasks();
