// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const { spawn } = require('child_process');
// const { execSync } = require('child_process');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // Store sessions for each connected user
// const sessions = new Map();

// // Serve static files (frontend)
// app.use(express.static('public'));

// // Docker container name/ID - UPDATE THIS!
// const DOCKER_CONTAINER = 'my-terminal-container';

// // Find docker binary path
// function findDockerPath() {
//   try {
//     return execSync('which docker', { encoding: 'utf8' }).trim();
//   } catch (e) {
//     return '/usr/local/bin/docker';
//   }
// }

// const DOCKER_PATH = findDockerPath();
// console.log(`Docker found at: ${DOCKER_PATH}`);

// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id}`);

//   socket.on('create-terminal', () => {
//     try {
//       // Verify container exists and is running
//       try {
//         const result = execSync(`${DOCKER_PATH} inspect -f '{{.State.Running}}' ${DOCKER_CONTAINER}`, 
//           { encoding: 'utf8' }).trim();
        
//         if (result !== 'true') {
//           socket.emit('terminal-error', `Container '${DOCKER_CONTAINER}' is not running. Start it first.`);
//           return;
//         }
//       } catch (e) {
//         socket.emit('terminal-error', `Container '${DOCKER_CONTAINER}' not found.`);
//         return;
//       }

//       // Spawn docker exec process using child_process
//       const dockerProcess = spawn(DOCKER_PATH, [
//         'exec',
//         '-i',
//         DOCKER_CONTAINER,
//         '/bin/bash'
//       ], {
//         env: {
//           ...process.env,
//           PATH: '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:' + process.env.PATH
//         }
//       });

//       // Store the process
//       sessions.set(socket.id, dockerProcess);

//       // Send welcome message
//       socket.emit('terminal-output', '\r\n*** Connected to Docker container ***\r\n');
//       socket.emit('terminal-output', '*** (Using basic mode - some features limited) ***\r\n\r\n');

//       // Listen to stdout
//       dockerProcess.stdout.on('data', (data) => {
//         socket.emit('terminal-output', data.toString());
//       });

//       // Listen to stderr
//       dockerProcess.stderr.on('data', (data) => {
//         socket.emit('terminal-output', data.toString());
//       });

//       // Handle process exit
//       dockerProcess.on('exit', (code, signal) => {
//         console.log(`Docker process exited for ${socket.id}. Code: ${code}, Signal: ${signal}`);
//         sessions.delete(socket.id);
//         socket.emit('terminal-output', '\r\n*** Session ended ***\r\n');
//       });

//       // Handle process errors
//       dockerProcess.on('error', (error) => {
//         console.error(`Docker process error for ${socket.id}:`, error);
//         socket.emit('terminal-error', error.message);
//       });

//       socket.emit('terminal-ready');
//       console.log(`Terminal created for ${socket.id}`);

//     } catch (error) {
//       console.error('Error creating terminal:', error);
//       socket.emit('terminal-error', `Failed to create terminal: ${error.message}`);
//     }
//   });

//   // Handle input from client
//   socket.on('terminal-input', (data) => {
//     const process = sessions.get(socket.id);
//     if (process && process.stdin) {
//       process.stdin.write(data);
//     }
//   });

//   // Terminal resize not supported in basic mode
//   socket.on('terminal-resize', ({ cols, rows }) => {
//     // Not supported with child_process
//   });

//   // Clean up on disconnect
//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//     const process = sessions.get(socket.id);
//     if (process) {
//       try {
//         process.kill();
//       } catch (e) {
//         // Ignore
//       }
//       sessions.delete(socket.id);
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`\n========================================`);
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Mode: Basic (child_process)`);
//   console.log(`Docker path: ${DOCKER_PATH}`);
//   console.log(`Docker container: ${DOCKER_CONTAINER}`);
//   console.log(`========================================`);
//   console.log(`\nNote: This uses child_process instead of node-pty`);
//   console.log(`Most features work, but some advanced terminal`);
//   console.log(`features (like vim, colors) may not work perfectly.`);
//   console.log(`========================================\n`);
// });
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const { spawn } = require('child_process');
// const { execSync } = require('child_process');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const sessions = new Map();
// app.use(express.static('public'));

// const DOCKER_CONTAINER = 'my-terminal-container';

// function findDockerPath() {
//   try {
//     return execSync('which docker', { encoding: 'utf8' }).trim();
//   } catch (e) {
//     return '/usr/local/bin/docker';
//   }
// }

// const DOCKER_PATH = findDockerPath();

// io.on('connection', (socket) => {
//   console.log(`\n[${socket.id}] Client connected`);

//   socket.on('create-terminal', () => {
//     console.log(`[${socket.id}] Creating terminal session...`);
    
//     try {
//       // Verify container
//       try {
//         const result = execSync(`${DOCKER_PATH} inspect -f '{{.State.Running}}' ${DOCKER_CONTAINER}`, 
//           { encoding: 'utf8' }).trim();
        
//         if (result !== 'true') {
//           socket.emit('terminal-error', `Container not running. Start with: docker start ${DOCKER_CONTAINER}`);
//           return;
//         }
//       } catch (e) {
//         socket.emit('terminal-error', `Container not found`);
//         return;
//       }

//       console.log(`[${socket.id}] Spawning docker exec...`);
      
//       // Simple approach: Use expect (if available) or script command
//       // For macOS, we'll use a different approach - just accept the limitations
      
//       const dockerProcess = spawn(DOCKER_PATH, [
//         'exec',
//         '-i',
//         DOCKER_CONTAINER,
//         '/bin/bash',
//         '--norc',  // Don't load rc files
//         '--noprofile'  // Don't load profile
//       ], {
//         env: {
//           ...process.env,
//           PATH: '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:' + (process.env.PATH || ''),
//           PS1: '$ '  // Simple prompt
//         }
//       });

//       if (!dockerProcess.pid) {
//         socket.emit('terminal-error', 'Failed to spawn process');
//         return;
//       }

//       console.log(`[${socket.id}] Process spawned, PID: ${dockerProcess.pid}`);
//       sessions.set(socket.id, { process: dockerProcess, buffer: '' });

//       socket.emit('terminal-output', '\r\n*** Connected to Docker container ***\r\n');
//       socket.emit('terminal-output', '*** Type commands and press Enter ***\r\n');
//       socket.emit('terminal-output', '*** Prompt may not show - this is normal ***\r\n\r\n');

//       // Handle stdout with line buffering workaround
//       dockerProcess.stdout.setEncoding('utf8');
//       dockerProcess.stdout.on('data', (data) => {
//         console.log(`[${socket.id}] stdout (${data.length} bytes):`, data.replace(/\n/g, '\\n'));
//         socket.emit('terminal-output', data);
//       });

//       // Handle stderr
//       dockerProcess.stderr.setEncoding('utf8');
//       dockerProcess.stderr.on('data', (data) => {
//         console.log(`[${socket.id}] stderr:`, data);
//         socket.emit('terminal-output', data);
//       });

//       // Handle exit
//       dockerProcess.on('exit', (code, signal) => {
//         console.log(`[${socket.id}] Exited. Code: ${code}`);
//         sessions.delete(socket.id);
//         socket.emit('terminal-output', '\r\n*** Session ended ***\r\n');
//       });

//       // Handle errors
//       dockerProcess.on('error', (error) => {
//         console.error(`[${socket.id}] Error:`, error);
//         socket.emit('terminal-error', error.message);
//       });

//       // Send a test command to verify it works
//       setTimeout(() => {
//         if (dockerProcess.stdin && !dockerProcess.killed) {
//           console.log(`[${socket.id}] Sending test to verify output works`);
//           dockerProcess.stdin.write('echo "Connection successful - type your commands below:"\n');
//         }
//       }, 500);

//       socket.emit('terminal-ready');
//       console.log(`[${socket.id}] Terminal ready!`);

//     } catch (error) {
//       console.error(`[${socket.id}] Error:`, error);
//       socket.emit('terminal-error', `Failed: ${error.message}`);
//     }
//   });

//   // Handle input - collect until we get Enter
//   socket.on('terminal-input', (data) => {
//     const session = sessions.get(socket.id);
//     if (!session || !session.process || !session.process.stdin) {
//       return;
//     }

//     const process = session.process;
    
//     // Echo the input back to the user so they can see what they're typing
//     socket.emit('terminal-output', data);
    
//     console.log(`[${socket.id}] Input:`, data.replace(/\r/g, '<CR>').replace(/\n/g, '<LF>'));
    
//     try {
//       // Convert \r to \n for bash
//       const normalized = data.replace(/\r/g, '\n');
//       process.stdin.write(normalized);
      
//       // If it's Enter, flush to ensure command executes
//       if (data.includes('\r') || data.includes('\n')) {
//         console.log(`[${socket.id}] Enter pressed, command sent`);
//       }
//     } catch (error) {
//       console.error(`[${socket.id}] Write error:`, error);
//     }
//   });

//   // Resize
//   socket.on('terminal-resize', ({ cols, rows }) => {
//     console.log(`[${socket.id}] Resize: ${cols}x${rows}`);
//   });

//   // Disconnect
//   socket.on('disconnect', () => {
//     console.log(`[${socket.id}] Disconnected`);
//     const session = sessions.get(socket.id);
//     if (session && session.process) {
//       try {
//         session.process.kill();
//       } catch (e) {
//         // Ignore
//       }
//       sessions.delete(socket.id);
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log('\n' + '='.repeat(60));
//   console.log('Docker Terminal Server - Simple Mode');
//   console.log('='.repeat(60));
//   console.log(`Server: http://localhost:${PORT}`);
//   console.log(`Docker: ${DOCKER_PATH}`);
//   console.log(`Container: ${DOCKER_CONTAINER}`);
//   console.log('='.repeat(60));
//   console.log('Note: Bash prompt may not show (limitation without PTY)');
//   console.log('But commands will work - just type and press Enter');
//   console.log('='.repeat(60));
//   console.log('\nWaiting for connections...\n');
// });



const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { spawn } = require('child_process');
const { execSync } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const sessions = new Map();
app.use(express.static('public'));

const DOCKER_CONTAINER = 'my-terminal-container';

function findDockerPath() {
  try {
    return execSync('which docker', { encoding: 'utf8' }).trim();
  } catch (e) {
    return '/usr/local/bin/docker';
  }
}

const DOCKER_PATH = findDockerPath();

io.on('connection', (socket) => {
  console.log(`\n[${socket.id}] Client connected`);

  socket.on('create-terminal', () => {
    console.log(`[${socket.id}] Creating terminal session...`);
    
    try {
      // Verify container
      try {
        const result = execSync(`${DOCKER_PATH} inspect -f '{{.State.Running}}' ${DOCKER_CONTAINER}`, 
          { encoding: 'utf8' }).trim();
        
        if (result !== 'true') {
          socket.emit('terminal-error', `Container not running. Start with: docker start ${DOCKER_CONTAINER}`);
          return;
        }
      } catch (e) {
        socket.emit('terminal-error', `Container not found`);
        return;
      }

      console.log(`[${socket.id}] Spawning docker exec...`);
      
      const dockerProcess = spawn(DOCKER_PATH, [
        'exec',
        '-i',
        DOCKER_CONTAINER,
        '/bin/bash'
      ], {
        env: {
          ...process.env,
          PATH: '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:' + (process.env.PATH || ''),
          TERM: 'xterm-256color',
          HOME: '/root'
        }
      });

      if (!dockerProcess.pid) {
        socket.emit('terminal-error', 'Failed to spawn process');
        return;
      }

      console.log(`[${socket.id}] Process spawned, PID: ${dockerProcess.pid}`);
      
      // Store session with input buffer for handling backspace
      sessions.set(socket.id, { 
        process: dockerProcess, 
        inputBuffer: '',
        promptShown: false
      });

      socket.emit('terminal-output', '\r\n*** Connected to Docker container ***\r\n');
      socket.emit('terminal-output', '*** You can now type commands ***\r\n\r\n');

      // Handle stdout
      dockerProcess.stdout.setEncoding('utf8');
      dockerProcess.stdout.on('data', (data) => {
        console.log(`[${socket.id}] stdout (${data.length} bytes)`);
        const session = sessions.get(socket.id);
        if (session) {
          session.promptShown = true;
        }
        socket.emit('terminal-output', data);
      });

      // Handle stderr
      dockerProcess.stderr.setEncoding('utf8');
      dockerProcess.stderr.on('data', (data) => {
        console.log(`[${socket.id}] stderr:`, data);
        socket.emit('terminal-output', data);
      });

      // Handle exit
      dockerProcess.on('exit', (code, signal) => {
        console.log(`[${socket.id}] Exited. Code: ${code}`);
        sessions.delete(socket.id);
        socket.emit('terminal-output', '\r\n*** Session ended ***\r\n');
      });

      // Handle errors
      dockerProcess.on('error', (error) => {
        console.error(`[${socket.id}] Error:`, error);
        socket.emit('terminal-error', error.message);
      });

      // Set up bash environment
      setTimeout(() => {
        if (dockerProcess.stdin && !dockerProcess.killed) {
          console.log(`[${socket.id}] Setting up bash`);
          dockerProcess.stdin.write('export PS1="$ "\n');
          dockerProcess.stdin.write('echo "Ready! Type your commands:"\n');
        }
      }, 300);

      socket.emit('terminal-ready');
      console.log(`[${socket.id}] Terminal ready!`);

    } catch (error) {
      console.error(`[${socket.id}] Error:`, error);
      socket.emit('terminal-error', `Failed: ${error.message}`);
    }
  });

  // Handle input with proper backspace support
  socket.on('terminal-input', (data) => {
    const session = sessions.get(socket.id);
    if (!session || !session.process || !session.process.stdin) {
      return;
    }

    const process = session.process;
    
    // Handle each character
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const code = char.charCodeAt(0);
      
      // Handle backspace (127 or 8)
      if (code === 127 || code === 8) {
        if (session.inputBuffer.length > 0) {
          // Remove last character from buffer
          session.inputBuffer = session.inputBuffer.slice(0, -1);
          
          // Send backspace sequence to terminal: backspace + space + backspace
          socket.emit('terminal-output', '\b \b');
          console.log(`[${socket.id}] Backspace, buffer now: "${session.inputBuffer}"`);
        }
      }
      // Handle Enter (carriage return)
      else if (code === 13 || code === 10) {
        console.log(`[${socket.id}] Executing command: "${session.inputBuffer}"`);
        
        // Send newline to terminal display
        socket.emit('terminal-output', '\r\n');
        
        // Send the complete command to bash
        process.stdin.write(session.inputBuffer + '\n');
        
        // Clear buffer
        session.inputBuffer = '';
      }
      // Regular character
      else {
        session.inputBuffer += char;
        
        // Echo character back to terminal
        socket.emit('terminal-output', char);
        console.log(`[${socket.id}] Added '${char}', buffer: "${session.inputBuffer}"`);
      }
    }
  });

  // Resize
  socket.on('terminal-resize', ({ cols, rows }) => {
    console.log(`[${socket.id}] Resize: ${cols}x${rows}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[${socket.id}] Disconnected`);
    const session = sessions.get(socket.id);
    if (session && session.process) {
      try {
        session.process.kill();
      } catch (e) {
        // Ignore
      }
      sessions.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('Docker Terminal Server - With Backspace Support');
  console.log('='.repeat(60));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Docker: ${DOCKER_PATH}`);
  console.log(`Container: ${DOCKER_CONTAINER}`);
  console.log('='.repeat(60));
  console.log('Features:');
  console.log('  ✓ Backspace/Delete works properly');
  console.log('  ✓ Input buffering on server side');
  console.log('  ✓ Clean command execution');
  console.log('='.repeat(60));
  console.log('\nWaiting for connections...\n');
});