const pty = require('node-pty');
console.log('node-pty loaded successfully!');

const shell = '/bin/bash';
const term = pty.spawn(shell, ['-c', 'echo "It works!"'], {
  name: 'xterm-color',
  env: process.env
});

term.onData((data) => console.log('Output:', data));
term.onExit(() => console.log('Done!'));
