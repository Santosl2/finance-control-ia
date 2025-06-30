import { db } from '@config/db';
import { tool } from 'ai';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

export const getTotalOnWallet = () =>
	tool({
		description: `
    Esta ferramenta é usada para trazer a soma e subtração de toda entrada e saída (em resumo entrada - saída). 
         `.trim(),
		parameters: z.object({
			userId: z.string().describe('O ID do usuário'),
		}),
		execute: async ({ userId }) => {
			const query = sql`
        SELECT COALESCE(SUM(
          CASE 
            WHEN type = 'income' THEN cost 
            WHEN type = 'expense' THEN -cost
            ELSE 0
          END
        ), 0) as total
        FROM expenses 
        WHERE user_id = ${userId}
      `;

			const result = await db.execute(query);

			return result;
		},
	});
