import test from 'tape';
import fs from 'fs';
import * as AWS from '../src';

import { BUCKET, KEY } from '../lib/constants';

test('Test S3 download', (t) => {
	AWS.S3.downloadFile(BUCKET, KEY, 'test-index.html')
		.then(() => {
			t.assert(fs.existsSync('test-index.html'), 'File downloaded from S3');
			t.teardown(() => { fs.unlinkSync('test-index.html'); });
			t.end();
		});
});
