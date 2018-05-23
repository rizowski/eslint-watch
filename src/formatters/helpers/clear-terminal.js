export default function clearTerminal() {
  process.stdout.write('\u001B[2J\u001B[0;0f');
}
