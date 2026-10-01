// ===================== PICTURES AS ONE PDF =====================
// features/review/pdfDoc.js: a page per picture, each the picture's shape,
// with a valid cross-reference table, so any PDF reader opens it.

const test = require('node:test');
const assert = require('node:assert');
const Pdf = require('../assets/js/features/review/pdfDoc.js');
const { inspectPdf } = require('./helpers/pdfInspect.js');

// An 8 x 10 JPEG, made by a browser's own canvas encoder.
const JPEG = new Uint8Array(Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYI/8QAJBAAAAMGBwEAAAAAAAAAAAAAABESAgMECBMVAQUGBxQWMTP/xAAVAQEBAAAAAAAAAAAAAAAAAAAHCP/EAB4RAAEDBAMAAAAAAAAAAAAAAAECAwQABRExITKx/9oADAMBAAIRAxEAPwCPlKl51HsN2rsEblcZdeJQtr142mlWUpbtgvoyRH5j4A0KAlidNduEhUl/srGccaAHgpKZZSwgNo0K/9k=', 'base64'));

test('one page per picture, each page the picture\'s shape, and the cross-references land', () => {
  const pdf = Pdf.build([{ jpeg: JPEG, width: 1080, height: 1350 }, { jpeg: JPEG, width: 1080, height: 3002 }, { jpeg: JPEG, width: 8, height: 10 }], { title: 'Money Padel — September 2026 Board Pack' });
  const r = inspectPdf(pdf);
  assert.strictEqual(r.header, '%PDF-1.4');
  assert.ok(r.eof);
  assert.strictEqual(r.offsetsOk, true, 'every xref offset points at its object');
  assert.strictEqual(r.declared, 3);
  assert.deepStrictEqual(r.pages, [[540, 675], [540, 1501], [4, 5]], '1080 px wide is 540 pt; a slide is 4:5, a tall sheet is tall');
  assert.deepStrictEqual(r.images, [[1080, 1350], [1080, 3002], [8, 10]]);
  assert.strictEqual(r.title, 'Money Padel — September 2026 Board Pack');
  assert.ok(Buffer.from(pdf).includes(Buffer.from(JPEG)), 'the picture is embedded as it was given');
});

test('a name with an accent, and a character outside the basic plane, survive in the title', () => {
  assert.strictEqual(Pdf.textString('é'), '<FEFF00E9>');
  assert.strictEqual(Pdf.textString('🎾'), '<FEFFD83CDFBE>');
  assert.strictEqual(inspectPdf(Pdf.build([{ jpeg: JPEG, width: 8, height: 10 }], { title: 'Zoë · Pack' })).title, 'Zoë · Pack');
});

test('refuses what it cannot make a page of', () => {
  assert.throws(() => Pdf.build([]), /no pages/);
  assert.throws(() => Pdf.build([{ jpeg: new Uint8Array([0x89, 0x50, 0x4e, 0x47]), width: 8, height: 10 }]), /not a JPEG/);
  assert.throws(() => Pdf.build([{ jpeg: JPEG, width: 0, height: 10 }]), /no size/);
});
