import { CodeSearch } from '@opencode-ai/tool';

const search = new CodeSearch({
  patterns: ['*.ts', '*.js'],
  directories: ['/src', '/lib'],
});
