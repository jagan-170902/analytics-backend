const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.locals.prisma = prisma;

async function main(){
  app.listen(PORT, () => {
    console.log(`Analytics API listening on port ${PORT}`);
  });
}

main().catch(e=>{
  console.error(e);
  process.exit(1);
});