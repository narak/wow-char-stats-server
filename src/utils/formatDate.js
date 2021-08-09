const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export default function formatDate(date) {
  const fm = formatter.format(date);
  return fm;
}
