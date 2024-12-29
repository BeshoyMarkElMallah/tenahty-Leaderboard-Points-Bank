-- CreateTable
CREATE TABLE "Prep" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "isShown" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Prep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sec" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "isShown" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sec_pkey" PRIMARY KEY ("id")
);
