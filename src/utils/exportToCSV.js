export default function exportToCSV(columns, rows) {
  const header = columns.filter(col => col.key !== 'action').map(col => col.key);
  const data = rows.map(data => {
    return header
      .map(key => {
        const d = data[key];
        return d ? (d.value ? d.value : d) : undefined;
      })
      .join(',');
  });
  data.unshift(header.join(','));

  const csv = 'data:text/csv;charset=utf-8,' + data.join('\r\n');
  const encodedUri = encodeURI(csv);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'wcl_char_stats.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
