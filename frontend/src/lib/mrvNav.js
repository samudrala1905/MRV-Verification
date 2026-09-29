// Maps a record id (ACT-/CALC-/EVD-/PCF-) to its module route for deep-linking
export function refRoute(id) {
  if (!id) return null;
  if (id.startsWith("ACT-")) return `/pcf/inventory?rec=${id}`;
  if (id.startsWith("CALC-")) return `/pcf/calculation?rec=${id}`;
  if (id.startsWith("EVD-")) return `/mrv/evidence?rec=${id}`;
  if (id.startsWith("PCF-")) return `/pcf/report?rec=${id}`;
  if (id.startsWith("EF-")) return `/pcf/calculation?rec=${id}`;
  return null;
}

export function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
