import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validMemoryDate} from '../src/validation.mjs';
test('memory dates support approximate years and leap days',()=>{
  for(const value of ['2010','2024-02-29','2026-11-10']) assert.equal(validMemoryDate(value),true);
});
test('invalid dates do not silently move to a different day',()=>{
  for(const value of ['2025-02-29','2026-02-31','2026-13-01','','hello','0000']) assert.equal(validMemoryDate(value),false);
});
