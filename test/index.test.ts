import test from 'tape';
import fs from 'fs';
import * as AWS from '../src';

import { BUCKET } from '../lib/constants';

test('Test S3 download', (t) => {
	AWS.S3.downloadFile(BUCKET, 'index.html', 'test-download.html')
		.then(() => {
			t.assert(fs.existsSync('test-download.html'), 'File downloaded from S3');
			t.teardown(() => { fs.unlinkSync('test-download.html'); });
			t.end();
		});
});

test('Test S3 upload', (t) => {
	fs.writeFileSync('test-upload.html', '', { encoding: 'utf-8' });
	AWS.S3.uploadFile(BUCKET, 'test-upload.html', [], 'test-upload.html')
		.then(() => {
			t.teardown(() => { fs.unlinkSync('test-upload.html'); });
			t.end();
		});
});
