import { escapeControl, description, KiloBundle } from 'utils';

export function updatePermissionView(card, permission) {
  const skillShell = permission.meta.raw['skillShell'] === 'true';
  const skill = permission.meta.raw['skill'];
  card.setHeader(
    skillShell && skill
      ? KiloBundle.message('session.permission.skillShell.title', escapeControl(skill))
      : KiloBundle.message('session.permission.title')
  );
  syncDescription(description(permission));
}
