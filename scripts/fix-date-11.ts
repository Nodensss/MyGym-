import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.workout.updateMany({
    where: { number: 11 },
    data: { date: new Date('2026-05-11T00:00:00.000Z') }
  });
  console.log(`Updated ${result.count} workout(s) with number=11`);

  const after = await prisma.workout.findFirst({ where: { number: 11 } });
  console.log('Workout #11 after update:', after);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
