# tiny-stack-vm

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Tenguu0/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Tenguu0/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack VM for the [make.fun](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
tiny-stack-vm-01 bounty. `main.ts` runs all 40 bytecode programs of a
set and writes each answer as `/output/<id>/stdout.bin` and
`/output/<id>/exit.txt`.

It implements the full ISA (`generator/subject/ISA.md` in the kit):
32-bit wrapping arithmetic, 256-value stack, 64-deep call stack, 256
words of memory, and all ten traps with their edge cases (unsigned
DIVU/MODU/LTU, 5-bit shifts, PUSH8 sign extension, EXIT's low byte).

## Grade locally

`node cli/makefun.mjs grade-local --kit <kit-dir> --bot . --driver process`

Practice set: 40/40 instances match the kit's reference VM, in ~0.3 s.
