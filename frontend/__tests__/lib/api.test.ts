import { appUrl, apiUrl } from '@/lib/api';

describe('api constants', () => {
  it('exports appUrl', () => {
    expect(appUrl).toBeDefined();
    expect(typeof appUrl).toBe('string');
  });

  it('exports apiUrl', () => {
    expect(apiUrl).toBeDefined();
    expect(typeof apiUrl).toBe('string');
  });
});
