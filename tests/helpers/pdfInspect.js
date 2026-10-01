// Reads back what PdfDoc writes, for the tests: the pages and their sizes,
// the embedded pictures, the title, and whether every cross-reference
// offset lands on the object it names. Not a general PDF reader.

function inspectPdf(bytes) {
  const buf = Buffer.from(bytes);
  const text = buf.toString('latin1');
  const startxref = Number(/startxref\n(\d+)\n%%EOF\n$/.exec(text)[1]);
  const xref = text.slice(startxref);
  const [, first, count] = /^xref\n(\d+) (\d+)\n/.exec(xref);
  const entries = xref.split('\n').slice(2, 2 + Number(count));
  const offsetsOk = entries.slice(1).every((e, i) => text.startsWith(`${i + 1} 0 obj\n`, Number(e.slice(0, 10))));
  const pages = [...text.matchAll(/\/Type \/Page \/Parent 2 0 R \/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const images = [...text.matchAll(/\/Subtype \/Image \/Width (\d+) \/Height (\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const hex = /\/Title <FEFF([0-9A-F]*)>/.exec(text)[1];
  let title = '';
  for (let i = 0; i < hex.length; i += 4) title += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  const declared = Number(/\/Type \/Pages \/Count (\d+)/.exec(text)[1]);
  return { header: text.slice(0, 8), eof: text.endsWith('%%EOF\n'), first: Number(first), offsetsOk, pages, declared, images, title };
}

module.exports = { inspectPdf };
