import {z} from 'zod';
import { publicProcedure, router } from "../trpc";


export const scoresRouter = router({
    // prepScores: publicProcedure
    // .query(async ({ctx})=>{
    //     try {
    //         return await ctx.prisma?.prep.findMany({
    //             select:{
    //                 id: true,
    //                 name:true,
    //                 points:true,
    //                 color:true,
    //                 isShown:true,
    //             },
    //             orderBy:{
    //                 points: "desc",
    //                 // name: "asc",
    //             }
    //         });
    //     } catch (error) {
    //         console.log(`Cannot fetch prep scores ${error}`);
            
    //     }
    // }),
    prepScores: publicProcedure
    .query(async ({ctx}) => {
        try {
            const scores = await ctx.prisma?.prep.findMany({
                select: {
                    points: true,
                }
            });

            const allScoresZero = scores?.every(score => score.points === 0);

            return await ctx.prisma?.prep.findMany({
                select: {
                    id: true,
                    name: true,
                    points: true,
                    color: true,
                    isShown: true,
                },
                orderBy: allScoresZero ? { name: "asc" } : { points: "desc" }
            });
        } catch (error) {
            console.log(`Cannot fetch prep scores ${error}`);
        }
    }),


    // secScores: publicProcedure
    // .query(async ({ctx})=>{
    //     try {
    //         return await ctx.prisma?.sec.findMany({
    //             select:{
    //                 id: true,
    //                 name:true,
    //                 points:true,
    //                 color:true,
    //                 isShown:true,
    //             },
    //             orderBy:{
    //                 points: "desc",
    //                 // name: "asc",
    //             }
    //         });
    //     } catch (error) {
    //         console.log(`Cannot fetch Sec scores ${error}`);
            
    //     }
    // }),
    secScores: publicProcedure
    .query(async ({ctx}) => {
        try {
            const scores = await ctx.prisma?.sec.findMany({
                select: {
                    points: true,
                }
            });

            const allScoresZero = scores?.every(score => score.points === 0);

            return await ctx.prisma?.sec.findMany({
                select: {
                    id: true,
                    name: true,
                    points: true,
                    color: true,
                    isShown: true,
                },
                orderBy: allScoresZero ? { name: "asc" } : { points: "desc" }
            });
        } catch (error) {
            console.log(`Cannot fetch Sec scores ${error}`);
        }
    }),
})