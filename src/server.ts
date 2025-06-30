import 'dotenv/config';
import 'express-async-errors';
import './shared/provider/telegram';

import express from 'express';
import gracefulShutdown from 'http-graceful-shutdown';
import { aiRoutes } from './routes';
import { logger } from './shared/logs/logger';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.disable('x-powered-by');

app.use('/api/v1/', aiRoutes);

// Start the server
app.listen(port, () => {
	logger.info(`Server running on PORT ${port}`);
});

function shutdownFunction(signal?: string | undefined): Promise<void> {
	return new Promise((resolve) => {
		resolve();
	});
}

function finalFunction() {
	console.log('Server gracefulls shutted down.....');
}

gracefulShutdown(app, {
	forceExit: true,
	signals: 'SIGINT SIGTERM',
	timeout: 10000,
	onShutdown: shutdownFunction,
	finally: finalFunction,
});
