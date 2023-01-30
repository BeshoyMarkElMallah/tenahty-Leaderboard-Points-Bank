import {z} from 'zod';
import { publicProcedure, router } from "../trpc";


export const scoresRouter = router({
    prepScores: publicProcedure
    .query(async ({ctx})=>{
        try {
            return await ctx.prisma?.prep.findMany({
                select:{
                    id: true,
                    name:true,
                    points:true,
                },
                orderBy:{
                    points: "desc",
                }
            });
        } catch (error) {
            console.log(`Cannot fetch prep scores ${error}`);
            
        }
    }),

    secScores: publicProcedure
    .query(async ({ctx})=>{
        try {
            return await ctx.prisma?.sec.findMany({
                select:{
                    id: true,
                    name:true,
                    points:true,
                },
                orderBy:{
                    points: "desc",
                }
            });
        } catch (error) {
            console.log(`Cannot fetch Sec scores ${error}`);
            
        }
    }),
})