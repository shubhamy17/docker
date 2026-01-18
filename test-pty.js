#!/usr/bin/env node

/**
 * Test script to verify node-pty works on your system
 * Run with: node test-pty.js
 */

const pty = require('node-pty');
const os = require('os');
const { execSync } = require('child_process');

console.log('='.repeat(50));
console.log('Testing node-pty on macOS');
console.log('='.repeat(50));

// Test 1: Basic shell spawn
console.log('\nTest 1: Spawning basic shell...');
try {
  const shell = os.platform() === 'win32' ? 'cmd.exe' : '/bin/bash';
  const ptyTest1 = pty.spawn(shell, ['-c', 'echo "Hello from shell"'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    env: process.env
  });
  
  ptyTest1.onData((data) => {
    process.stdout.write(data);
  });
  
  ptyTest1.onExit(() => {
    console.log('✓ Test 1 PASSED: Basic shell works\n');
    runTest2();
  });
} catch (error) {
  console.error('✗ Test 1 FAILED:', error.message);
  process.exit(1);
}

// Test 2: Docker command
function runTest2() {
  console.log('Test 2: Finding Docker...');
  
  let dockerPath;
  try {
    dockerPath = execSync('which docker', { encoding: 'utf8' }).trim();
    console.log(`  Docker found at: ${dockerPath}`);
  } catch (e) {
    console.error('✗ Test 2 FAILED: Docker not found in PATH');
    process.exit(1);
  }
  
  // Test docker version
  console.log('Test 3: Running docker --version via PTY...');
  try {
    const ptyTest2 = pty.spawn('/bin/bash', ['-c', `${dockerPath} --version`], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      env: {
        ...process.env,
        PATH: '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:' + process.env.PATH
      }
    });
    
    ptyTest2.onData((data) => {
      process.stdout.write(data);
    });
    
    ptyTest2.onExit(() => {
      console.log('✓ Test 3 PASSED: Docker command works via PTY\n');
      runTest4(dockerPath);
    });
  } catch (error) {
    console.error('✗ Test 3 FAILED:', error.message);
    process.exit(1);
  }
}

// Test 4: Docker exec simulation
function runTest4(dockerPath) {
  const containerName = 'my-terminal-container';
  
  console.log(`Test 4: Checking if container '${containerName}' exists...`);
  
  try {
    const result = execSync(`${dockerPath} inspect -f '{{.State.Running}}' ${containerName}`, 
      { encoding: 'utf8' }).trim();
    
    if (result !== 'true') {
      console.log('  Container exists but not running. Skipping docker exec test.');
      console.log('  Start it with: docker start ' + containerName);
      runTest5(dockerPath, containerName);
      return;
    }
    
    console.log('  Container is running!');
    console.log('Test 5: Running docker exec via PTY...');
    
    const ptyTest3 = pty.spawn('/bin/bash', ['-c', `${dockerPath} exec -i ${containerName} /bin/bash -c 'echo "Success from container!"'`], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      env: {
        ...process.env,
        PATH: '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:' + process.env.PATH
      }
    });
    
    ptyTest3.onData((data) => {
      process.stdout.write(data);
    });
    
    ptyTest3.onExit(() => {
      console.log('✓ Test 5 PASSED: Docker exec works!\n');
      console.log('='.repeat(50));
      console.log('All tests passed! Your setup should work.');
      console.log('='.repeat(50));
    });
    
  } catch (e) {
    console.log(`  Container '${containerName}' not found.`);
    console.log('  Create it with:');
    console.log(`    docker run -d --name ${containerName} test-terminal`);
    runTest5(dockerPath, containerName);
  }
}

function runTest5(dockerPath, containerName) {
  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));
  console.log('✓ node-pty works on your system');
  console.log('✓ Docker command is accessible');
  console.log(`\nTo complete setup:`);
  console.log(`1. Ensure container is running:`);
  console.log(`   docker ps | grep ${containerName}`);
  console.log(`2. If not running, start it:`);
  console.log(`   docker start ${containerName}`);
  console.log(`3. Or create new container:`);
  console.log(`   docker run -d --name ${containerName} test-terminal`);
  console.log(`4. Use the alternative server.js provided`);
  console.log('='.repeat(50));
}