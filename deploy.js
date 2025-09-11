const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function deploy() {
  try {
    console.log('Deploying to GitHub...');
    await execPromise('git add .');
    await execPromise('git commit -m "Auto-deploy: Update Mangpong Delivery app"');
    await execPromise('git push origin main');
    console.log('GitHub deployment completed.');

    console.log('Deploying to Google Apps Script...');
    await execPromise('clasp push');
    const { stdout } = await execPromise('clasp deploy --description "Mangpong Delivery App v1.0"');
    console.log('Google Apps Script deployment completed.');
    console.log(stdout);
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();