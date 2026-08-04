import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { readViewerCss } from '../server/index.js';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omm-server-test-'));
  fs.mkdirSync(path.join(tmpDir, '.omm'));
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('readViewerCss', () => {
  it('returns null when .omm/viewer.css is absent', () => {
    expect(readViewerCss(tmpDir)).toBeNull();
  });

  it('reads .omm/viewer.css', () => {
    fs.writeFileSync(path.join(tmpDir, '.omm', 'viewer.css'), '.node-path { opacity: 1; }');

    expect(readViewerCss(tmpDir)).toBe('.node-path { opacity: 1; }');
  });

  it('warns and returns null when .omm/viewer.css cannot be read', () => {
    fs.mkdirSync(path.join(tmpDir, '.omm', 'viewer.css'));
    const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    expect(readViewerCss(tmpDir)).toBeNull();
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('warning: could not read .omm/viewer.css'));
  });
});
