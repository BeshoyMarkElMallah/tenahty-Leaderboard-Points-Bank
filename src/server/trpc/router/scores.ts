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
            return await ctx.prisma?.prep.findMany({
                select: {
                    id: true,
                    name: true,
                    points: true,
                    color: true,
                    isShown: true,
                },
                orderBy: [{ points: "desc" }, { name: "asc" }]
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
            return await ctx.prisma?.sec.findMany({
                select: {
                    id: true,
                    name: true,
                    points: true,
                    color: true,
                    isShown: true,
                },
                orderBy: [{ points: "desc" }, { name: "asc" }]
            });
        } catch (error) {
            console.log(`Cannot fetch Sec scores ${error}`);
        }
    }),

    // Admin procedures
    updatePrepScore: publicProcedure
        .input(z.object({
            id: z.string(),
            points: z.number().int(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma?.prep.update({
                    where: { id: input.id },
                    data: { points: input.points },
                });
            } catch (error) {
                console.log(`Cannot update prep score: ${error}`);
                throw error;
            }
        }),

    updateSecScore: publicProcedure
        .input(z.object({
            id: z.string(),
            points: z.number().int(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma?.sec.update({
                    where: { id: input.id },
                    data: { points: input.points },
                });
            } catch (error) {
                console.log(`Cannot update sec score: ${error}`);
                throw error;
            }
        }),

    togglePrepVisibility: publicProcedure
        .input(z.object({
            id: z.string(),
            isShown: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma?.prep.update({
                    where: { id: input.id },
                    data: { isShown: input.isShown },
                });
            } catch (error) {
                console.log(`Cannot toggle prep visibility: ${error}`);
                throw error;
            }
        }),

    toggleSecVisibility: publicProcedure
        .input(z.object({
            id: z.string(),
            isShown: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma?.sec.update({
                    where: { id: input.id },
                    data: { isShown: input.isShown },
                });
            } catch (error) {
                console.log(`Cannot toggle sec visibility: ${error}`);
                throw error;
            }
        }),
})