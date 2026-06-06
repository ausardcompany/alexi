// updated test cases for edit tool
import { editFile } from './edit';

describe('editFile', () => {
  it('should apply edits correctly', async () => {
    const result = await editFile('test.txt', 'replace this', 'with this');
    expect(result).toBe(true);
  });
});
