const { exec } = require('child_process');

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

async function buildApp() {
	try {
		console.log('>> Building the application in dev mode...');
		await runCommand('tsc && vite build --mode development');
		console.log('>> Application build completed successfully.');
	} catch (error) {
		throw new Error('>> Build failed.');
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

// async function scanForVulnerabilities() {
// 	try {
// 		console.log('>> Scanning for vulnerabilities with Snyk...');
// 		await runCommand('snyk test');
// 		console.log('>> Vulnerability scan completed successfully.');
// 	} catch (error) {
// 		throw new Error('>> Snyk scan failed.');
// 	}
// }

async function runAllTasks() {
	try {
		await runTests();
		await buildApp();
		await checkUnusedDependencies();
		// await scanForVulnerabilities();
		console.log('>> All tasks completed successfully.');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

runAllTasks();
