import { db } from '@config/db';
import { expenses } from '@config/db/schema';
import { env } from '@config/env';
import { tool } from 'ai';
import { z } from 'zod';
import { appendToSpreadsheet } from '../../excel';

export const saveExpense = (userId: string) =>
	tool({
		description: `Esta ferramenta é usada para salvar uma despesa ou receita de um usuário. 
    
    Se o usuário não informar a data da transação, a data atual será usada.
    A data atual é ${new Date().toISOString()}
    `,
		parameters: z.object({
			cost: z.string().describe('O valor da despesa ou receita'),
			category: z.string().describe('A categoria da despesa ou receita'),
			type: z.string().describe('O tipo da transação (receita ou despesa)'),
			date: z.string().optional().describe('A data da transação'),
		}),
		execute: async ({ cost, category, type, date }) => {
			const formattedDate = date
				? new Date(date).toISOString()
				: new Date().toISOString();

			const values = {
				category,
				cost,
				type,
				created_at: formattedDate,
				description: '',
				updated_at: formattedDate,
				user_id: userId,
			};

			const promises = [db.insert(expenses).values(values).execute()];

			if (env.FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET) {
				promises.push(
					// @ts-ignore
					appendToSpreadsheet({
						...values,
						cost: Number.parseFloat(cost).toString().replace('.', ','),
					}),
				);
			}

			const [data] = await Promise.all(promises);

			return data;
		},
	});
