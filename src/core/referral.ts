const metadata = await tx.select({ id: MetadataTable.id }).from(MetadataTable);
// integrate metadata with workspace IDs
