// Tiny stack VM for make.fun tiny-stack-vm-01 (ISA v1), written from scratch
// from generator/subject/ISA.md and its reference VM vm.mjs. One run answers
// every /input/<id>/program.bin, writing /output/<id>/stdout.bin + exit.txt.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function run(p: Uint8Array, q: Uint8Array): { code: number; out: Uint8Array } {
  const D = new Int32Array(256);
  let s = 0;
  const C = new Int32Array(64);
  let c = 0;
  const M = new Int32Array(256);
  const o = new Uint8Array(65536);
  let n = 0, ip = 0, pc = 0, st = 0;
  const L = p.length;
  const done = (code: number) => ({ code, out: o.slice(0, n) });
  for (;;) {
    if (st === 1000000) return done(10);
    if (pc < 0 || pc >= L) return done(9);
    const k = p[pc];
    // Valid opcodes: 00-07, 10-1E, 20-22, 30-34, 40-41, 50-53.
    if (!(k < 8 || (k >= 16 && k <= 30) || (k >= 32 && k <= 34)
      || (k >= 48 && k <= 52) || (k >= 64 && k <= 65) || (k >= 80 && k <= 83))) return done(5);
    const m = k === 1 ? 1 : k === 2 ? 4 : k >= 48 && k < 52 ? 2 : 0;
    if (pc + m >= L) return done(9); // immediate cut off by program end
    st++;
    const nx = pc + 1 + m;
    pc = nx;
    // Binary ops 10-16, 18-1A, 1C-1E, 20-22 (23 NEG, 27 NOT are unary).
    if ((k >= 16 && k <= 30 && k !== 23 && k !== 27) || (k >= 32 && k <= 34)) {
      if (s < 2) return done(2);
      const b = D[s - 1], a = D[s - 2];
      let r = 0;
      switch (k) {
        case 16: r = (a + b) | 0; break;
        case 17: r = (a - b) | 0; break;
        case 18: r = Math.imul(a, b); break; // low 32 bits of exact product
        case 19: if (!b) return done(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; break;
        case 20: if (!b) return done(4); r = b === -1 ? 0 : (a % b) | 0; break;
        case 21: if (!b) return done(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; break;
        case 22: if (!b) return done(4); r = ((a >>> 0) % (b >>> 0)) | 0; break;
        case 24: r = a & b; break;
        case 25: r = a | b; break;
        case 26: r = a ^ b; break;
        case 28: r = a << (b & 31); break;
        case 29: r = a >> (b & 31); break;
        case 30: r = (a >>> (b & 31)) | 0; break;
        case 32: r = a === b ? 1 : 0; break;
        case 33: r = a < b ? 1 : 0; break;
        case 34: r = (a >>> 0) < (b >>> 0) ? 1 : 0; break;
      }
      s -= 2;
      D[s++] = r;
      continue;
    }
    switch (k) {
      case 0x00: return done(0);
      case 0x01:
        if (s >= 256) return done(3);
        D[s++] = (p[nx - 1] << 24) >> 24; // PUSH8 sign-extended
        break;
      case 0x02:
        if (s >= 256) return done(3);
        D[s++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24);
        break;
      case 0x03:
        if (s < 1) return done(2);
        s--;
        break;
      case 0x04:
        if (s < 1) return done(2);
        if (s >= 256) return done(3);
        D[s] = D[s - 1];
        s++;
        break;
      case 0x05:
        if (s < 2) return done(2);
        { const t = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = t; }
        break;
      case 0x06:
        if (s < 2) return done(2);
        if (s >= 256) return done(3);
        D[s] = D[s - 2];
        s++;
        break;
      case 0x07:
        if (s < 3) return done(2);
        { const t = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = t; }
        break;
      case 0x17:
        if (s < 1) return done(2);
        D[s - 1] = (-D[s - 1]) | 0;
        break;
      case 0x1b:
        if (s < 1) return done(2);
        D[s - 1] = ~D[s - 1];
        break;
      case 0x30:
      case 0x31:
      case 0x32: {
        const rel = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16;
        let take = k === 0x30;
        if (k !== 0x30) {
          if (s < 1) return done(2);
          const v = D[--s];
          take = k === 0x31 ? v === 0 : v !== 0;
        }
        if (take) pc = nx + rel;
        break;
      }
      case 0x33:
        if (c >= 64) return done(7);
        C[c++] = nx;
        pc = p[nx - 2] | (p[nx - 1] << 8);
        break;
      case 0x34:
        if (c === 0) return done(8);
        pc = C[--c];
        break;
      case 0x40: {
        if (s < 1) return done(2);
        const a = D[s - 1];
        if (a < 0 || a > 255) return done(6);
        D[s - 1] = M[a];
        break;
      }
      case 0x41: {
        if (s < 2) return done(2);
        const a = D[s - 1];
        if (a < 0 || a > 255) return done(6);
        M[a] = D[s - 2];
        s -= 2;
        break;
      }
      case 0x50: {
        if (s < 1) return done(2);
        const t = String(D[s - 1]);
        if (n + t.length > 65536) return done(11);
        s--;
        for (let i = 0; i < t.length; i++) o[n++] = t.charCodeAt(i);
        break;
      }
      case 0x51:
        if (s < 1) return done(2);
        if (n + 1 > 65536) return done(11);
        o[n++] = D[--s] & 255;
        break;
      case 0x52:
        if (s >= 256) return done(3);
        D[s++] = ip < q.length ? q[ip++] : -1;
        break;
      case 0x53:
        if (s < 1) return done(2);
        return done(D[--s] & 255);
    }
  }
}

const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(readFileSync(join(I, id, 'program.bin')), readFileSync(join(I, id, 'input.bin')));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.out);
  writeFileSync(join(O, id, 'exit.txt'), `${r.code}\n`);
}
