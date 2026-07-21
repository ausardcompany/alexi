import { Schema, optionalOmitUndefined } from '../utils/schema';
import { PartID } from '../types';

const SessionRevert = Schema.Struct({
  partID: optionalOmitUndefined(PartID),
  snapshot: optionalOmitUndefined(Schema.String),
  diff: optionalOmitUndefined(Schema.String),
  workspace: optionalOmitUndefined(Schema.Literals(["restored", "snapshots-disabled", "unavailable"])),
});

export { SessionRevert };
