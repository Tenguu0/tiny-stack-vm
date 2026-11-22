# tiny-stack-vm

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Tenguu0/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Tenguu0/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack VM for the [make.fun](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
tiny-stack-vm-01 bounty, written from scratch from the kit's ISA.
`main.ts` runs all 40 bytecode programs of a set and writes each
answer as `/output/<id>/stdout.bin` and `/output/<id>/exit.txt` —
full ISA, all ten traps, step/output limits, and every wrapping,
signed and unsigned edge case.

Grade locally: `node cli/makefun.mjs grade-local --kit <kit-dir> --bot . --driver process`

Practice set: 40/40 match the kit's reference VM, in ~0.3 s.
