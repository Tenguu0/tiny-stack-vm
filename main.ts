// Tiny stack VM for make.fun tiny-stack-vm-01 (ISA v1), written from scratch
// from generator/subject/ISA.md and its reference VM vm.mjs. One run answers
// every /input/<id>/program.bin, writing /output/<id>/stdout.bin + exit.txt.
// All ten traps, the step/output limits and every wrapping/signed/unsigned
// edge case follow the reference VM exactly.
import { mkdirSync as A, readdirSync as B, readFileSync as C, writeFileSync as D } from 'node:fs';
import { join as E } from 'node:path';
function R(p, q) {
  let s = 0, c = 0, n = 0, ip = 0, pc = 0, st = 0;
  const L = p.length, S = new Int32Array(256), T = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  const d = (x) => ({ code: x, out: o.slice(0, n) });
  for (;;) {
    if (st == 1e6) return d(10);
    if (pc < 0 || pc >= L) return d(9);
    const k = p[pc];
    if (!(k < 8 || (k >= 16 && k <= 30) || (k >= 32 && k <= 34) || (k >= 48 && k <= 52) || (k >= 64 && k <= 65) || (k >= 80 && k <= 83))) return d(5);
    const m = k == 1 ? 1 : k == 2 ? 4 : k >= 48 && k < 52 ? 2 : 0;
    if (pc + m >= L) return d(9);
    st++;
    const x = pc + 1 + m;
    pc = x;
    if ((k >= 16 && k <= 30 && k != 23 && k != 27) || (k >= 32 && k <= 34)) {
      if (s < 2) return d(2);
      const b = S[s - 1], a = S[s - 2];
      let r = 0;
      switch (k) {
        case 16: r = (a + b) | 0; break;
        case 17: r = (a - b) | 0; break;
        case 18: r = Math.imul(a, b); break;
        case 19: if (!b) return d(4); r = a == -2147483648 && b == -1 ? a : (a / b) | 0; break;
        case 20: if (!b) return d(4); r = b == -1 ? 0 : (a % b) | 0; break;
        case 21: if (!b) return d(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; break;
        case 22: if (!b) return d(4); r = ((a >>> 0) % (b >>> 0)) | 0; break;
        case 24: r = a & b; break;
        case 25: r = a | b; break;
        case 26: r = a ^ b; break;
        case 28: r = a << (b & 31); break;
        case 29: r = a >> (b & 31); break;
        case 30: r = (a >>> (b & 31)) | 0; break;
        case 32: r = a == b ? 1 : 0; break;
        case 33: r = a < b ? 1 : 0; break;
        case 34: r = (a >>> 0) < (b >>> 0) ? 1 : 0; break;
      }
      s -= 2;
      S[s++] = r;
      continue;
    }
    switch (k) {
      case 0: return d(0);
      case 1: if (s > 255) return d(3); S[s++] = (p[x - 1] << 24) >> 24; break;
      case 2: if (s > 255) return d(3); S[s++] = p[x - 4] | (p[x - 3] << 8) | (p[x - 2] << 16) | (p[x - 1] << 24); break;
      case 3: if (s < 1) return d(2); s--; break;
      case 4: if (s < 1) return d(2); if (s > 255) return d(3); S[s] = S[s - 1]; s++; break;
      case 5: if (s < 2) return d(2); { const t = S[s - 1]; S[s - 1] = S[s - 2]; S[s - 2] = t; } break;
      case 6: if (s < 2) return d(2); if (s > 255) return d(3); S[s] = S[s - 2]; s++; break;
      case 7: if (s < 3) return d(2); { const t = S[s - 3]; S[s - 3] = S[s - 2]; S[s - 2] = S[s - 1]; S[s - 1] = t; } break;
      case 23: if (s < 1) return d(2); S[s - 1] = (-S[s - 1]) | 0; break;
      case 27: if (s < 1) return d(2); S[s - 1] = ~S[s - 1]; break;
      case 48: case 49: case 50: {
        const g = ((p[x - 2] | (p[x - 1] << 8)) << 16) >> 16;
        let t = k == 48;
        if (k != 48) {
          if (s < 1) return d(2);
          const v = S[--s];
          t = k == 49 ? v == 0 : v != 0;
        }
        if (t) pc = x + g;
        break;
      }
      case 51: if (c > 63) return d(7); T[c++] = x; pc = p[x - 2] | (p[x - 1] << 8); break;
      case 52: if (c == 0) return d(8); pc = T[--c]; break;
      case 64: if (s < 1) return d(2); { const a = S[s - 1]; if (a < 0 || a > 255) return d(6); S[s - 1] = M[a]; } break;
      case 65: if (s < 2) return d(2); { const a = S[s - 1]; if (a < 0 || a > 255) return d(6); M[a] = S[s - 2]; s -= 2; } break;
      case 80: if (s < 1) return d(2); { const t = String(S[s - 1]); if (n + t.length > 65536) return d(11); s--; for (let i = 0; i < t.length; i++) o[n++] = t.charCodeAt(i); } break;
      case 81: if (s < 1) return d(2); if (n > 65535) return d(11); o[n++] = S[--s] & 255; break;
      case 82: if (s > 255) return d(3); S[s++] = ip < q.length ? q[ip++] : -1; break;
      case 83: if (s < 1) return d(2); return d(S[--s] & 255);
    }
  }
}
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const i of B(I).sort()) {
  const r = R(C(E(I, i, 'program.bin')), C(E(I, i, 'input.bin')));
  A(E(O, i), { recursive: true });
  D(E(O, i, 'stdout.bin'), r.out);
  D(E(O, i, 'exit.txt'), r.code + '\n');
}
