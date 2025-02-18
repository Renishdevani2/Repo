const { exec } = require('child_process');
const fs = require('fs');
const path = require('path'); // Import the path module

async function buildAndRunBot(repoUrl, branch = "main") {
  try {
    const workdir = path.join(__dirname, 'renameDate'); // Use path.join and __dirname for relative path
    fs.mkdirSync(workdir, { recursive: true });

    // 1. Git clone
    console.log(`Cloning repository ${repoUrl} (branch: ${branch})...`);
    await runCommand(`git clone -b ${branch} ${repoUrl} ${workdir}`);

    // 2. Install dependencies (adjust path if needed)
    console.log('Installing dependencies...');

    // Construct the requirements path correctly
    const requirementsPath = path.join(workdir, 'requirements.txt');

    // Check if requirements.txt exists before attempting to install
    if (fs.existsSync(requirementsPath)) {
        await runCommand(`pip install -r ${requirementsPath}`);
    } else {
        console.log("requirements.txt not found. Skipping dependency installation.");
    }



    // 3. Run the bot (adjust path if needed)
    console.log('Running the bot...');

    const botPath = path.join(workdir, 'bot.py');

    if (fs.existsSync(botPath)) {
        await runCommand(`python ${botPath}`);
    } else {
        console.error("bot.py not found in the repository.");
    }


  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function runCommand(command, cwd = '/') {  // Added default cwd
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => { // Use provided or default cwd
      if (error) {
        console.error(`Command failed:\n${stderr}`);
        reject(error);
      } else {
        console.log(`Command output:\n${stdout}`);
        resolve();
      }
    });
  });
}

// Example usage:
const repoURL = "https://github.com/Renishdevani2/Rename-2.git";
const branchName = "main"; // Or a specific branch if needed

buildAndRunBot(repoURL, branchName);
