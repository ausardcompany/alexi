import { JBUI, Panels } from 'intellij-ui';

function diffOverflowPanel(open: () => void): JComponent {
  const message = new JBLabel('Diff exceeds inline preview limit');
  const link = new HyperlinkLabel('Open Diff').apply {
    addHyperlinkListener(() => open());
  };
  const body = Stack.vertical().next(message).next(link);
  return Panels.simplePanel(body).apply {
    border = JBUI.Borders.empty();
  };
}