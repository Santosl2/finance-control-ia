import fs from 'node:fs';
import path from 'node:path';
import { env } from '@config/env';
import { logger } from '@shared/logs/logger';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { google } from 'googleapis';

function googleAuth() {
	if (!env.FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET) return;

	const credentialsPath = path.resolve(
		__dirname,
		'../../../../credentials/credentials.json',
	);
	const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

	const auth = new google.auth.JWT({
		email: credentials.client_email,
		key: credentials.private_key,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	return auth;
}

export async function getSpreadsheet() {
	const auth = googleAuth();

	if (!auth) {
		throw new Error('Google Auth not found');
	}

	const doc = new GoogleSpreadsheet(env.GOOGLE_SPREADSHEET_ID, auth);
	await doc.loadInfo();

	function getMonthYearString(date = new Date()): string {
		const months = [
			'jan',
			'fev',
			'mar',
			'abr',
			'mai',
			'jun',
			'jul',
			'ago',
			'set',
			'out',
			'nov',
			'dez',
		];
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		return `${month}/${year}`;
	}

	const currentMonthYear = getMonthYearString();

	let sheet = doc.sheetsByTitle[currentMonthYear];

	if (!sheet) {
		console.log(`Sheet ${currentMonthYear} not found`);
		sheet = await doc.addSheet({
			title: currentMonthYear,
			headerValues: [
				'id',
				'user_id',
				'cost',
				'category',
				'description',
				'type',
				'created_at',
				'updated_at',
			],
		});
	}

	return sheet;
}

export async function appendToSpreadsheet<T>(data: T) {
	try {
		const sheet = await getSpreadsheet();
		await sheet.addRow(data as any);
		console.log('Row added to spreadsheet');
	} catch {
		logger.error('Error adding row to spreadsheet');
	}
}
