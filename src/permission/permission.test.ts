it.effect('defects when an asked permission is declined', () =>
  Effect.gen(function* () {
    // Test logic...
    expect(declined).toBeInstanceOf(PermissionV2.DeclinedError);
  })
);
