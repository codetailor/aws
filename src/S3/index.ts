import AWS from 'aws-sdk';
import { S3Client, PutObjectCommand, GetObjectCommand, } from '@aws-sdk/client-s3';
import type { GetObjectCommandInput, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import fs from 'fs';

import { AWS_REGION } from '../../lib/constants';

AWS.config.update({ region: AWS_REGION });
const S3 = new S3Client({ region: AWS_REGION });

type Tag = {
	key: string;
	value: string;
};

export function downloadFile(bucket: string, key: string, localFilePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const localWriteStream = fs.createWriteStream(localFilePath);

		const s3Params: GetObjectCommandInput = {
			Bucket: bucket,
			Key: key
		};

		const command = new GetObjectCommand(s3Params);

		S3.send(command)
			.then(res => {
				res.Body.pipe(localWriteStream)
					.on('close', resolve)
					.on('error', reject);
			})
			.catch(reject);
	});
}

export function uploadFile(bucket: string, key: string, tags: Tag[], localFilePath: string): Promise<PutObjectCommandOutput> {
	return new Promise((resolve, reject) => {
		const localReadStream = fs.createReadStream(localFilePath);
		localReadStream.on('error', reject);

		const s3Params: PutObjectCommandInput = {
			Bucket: bucket,
			Key: key,
			Body: localReadStream,
			Tagging: tags.map(tag => tag.key + '=' + tag.value).join('&')
		};

		const command = new PutObjectCommand(s3Params);

		S3.send(command)
			.then(resolve)
			.catch(reject);
	});
}