export const DISK_COLORS = [
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-green-500',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-sky-400',
  'bg-blue-500',
  'bg-indigo-400',
  'bg-purple-400',
];

export const CODE_SNIPPET = `function hanoi(n, from, aux, to) {
  if (n === 0) return;

  hanoi(n - 1, from, to, aux);

  console.log(\`Move \${n} from \${from} to \${to}\`);

  hanoi(n - 1, aux, from, to);
}`;
