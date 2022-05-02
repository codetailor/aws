import AWS from 'aws-sdk';
import fs from 'fs';

import { AWS_REGION } from '../../lib/constants';

AWS.config.update({ region: AWS_REGION });
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function downloadFile(bucket: string, key: string, localFilePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const s3Params = {
			Bucket: bucket,
			Key: key,
		};

		const localWriteStream = fs.createWriteStream(localFilePath);
		const s3ReadStream = S3.getObject(s3Params).createReadStream();

		s3ReadStream
			.on('error', reject)
			.on('close', resolve)
			.pipe(localWriteStream);
	});
}
