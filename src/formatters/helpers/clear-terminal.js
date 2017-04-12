export default function clearTerminal() {
  process.stdout.write('\x1Bc');
}
