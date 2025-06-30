import { db } from '@config/db';
import { logger } from '@shared/logs/logger';
import { tool } from 'ai';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

export const getExpenses = () =>
	tool({
		description: `
    Esta ferramenta é usada para obter o total de despesas ou receitas de um usuário.

    **Instruções:**
     - O usuário poderá filtrar as despesas ou entradas pela categoria e tipo da transação.
		 - O startDate padrão deve ser o primeiro dia do mês corrente e o endDate o último dia do mês corrente.
		 - Se o usuário não informar a data de início e fim da transação, será retornado o total do mês.
		 - O startDate e endDate são opcionais, caso não sejam informados deve ser retornado o inicio do mês e o final do mês.
		 - O tipo de transação pode ser 'income' para entradas e 'expense' para despesas.
		 - O valor retornado será em decimal

         `.trim(),
		parameters: z.object({
			type: z.string().describe('O tipo da transação'),
			userId: z.string().describe('O ID do usuário'),
			category: z.string().optional().describe('A categoria da transação'),
			startDate: z
				.string()
				.optional()
				.describe(
					'Data de inicio da transação. Caso não seja informado, será o primeiro dia do mês corrente.',
				),
			endDate: z
				.string()
				.optional()
				.describe(
					'A data final da transação. Caso não seja informado, será o último dia do mês corrente.',
				),
		}),
		execute: async ({ type, userId, category, startDate, endDate }) => {
			console.log({
				type,
				userId,
				category,
				startDate,
				endDate,
			});
			const query = sql`SELECT COALESCE(SUM(cost), 0) FROM expenses WHERE type = ${type} AND user_id = ${userId}`;

			if (category && category !== 'category') {
				query.append(sql` AND category = ${category}`);
			}

			if (startDate && endDate) {
				query.append(sql` AND created_at BETWEEN ${startDate} AND ${endDate}`);
			} else {
				const now = new Date();
				const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
				const lastDayOfMonth = new Date(
					now.getFullYear(),
					now.getMonth() + 1,
					0,
				);

				const firstDayFormatted = firstDayOfMonth.toISOString().split('T')[0];
				const lastDayFormatted = lastDayOfMonth.toISOString().split('T')[0];

				query.append(
					sql` AND created_at BETWEEN ${firstDayFormatted} AND ${lastDayFormatted}`,
				);
			}

			const result = await db.execute(query);

			return result;
		},
	});
