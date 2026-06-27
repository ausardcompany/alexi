const EditParams = Schema.Struct({
  path: Path,
  expected_revision: Schema.optional(Revision).annotate({
    description:
      'Required for insert, replace, and delete. Omit for create, which has no prior revision.',
  }),
  index: Schema.optional(Index).annotate({
    description:
      'Zero-based cell index. Required for insert, replace, and delete. Ignored for create.',
  }),
  action: Schema.Literals(['insert', 'replace', 'delete', 'create']).annotate({
    description:
      'insert and replace require kind and source; delete ignores cell fields; create makes a new empty .ipynb at path and ignores cell fields, index, and expected_revision',
  }),
});
