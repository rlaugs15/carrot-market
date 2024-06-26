import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(100).keys())].forEach(async (item) => {
    await client.stream.create({
      data: {
        name: String(item),
        description: String(item),
        price: item,
        user: {
          connect: {
            id: 41,
          },
        },
      },
    });
    console.log(`${item} / 100`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);
