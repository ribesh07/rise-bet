const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const password = 'ChangeMe123!'; // change immediately
  const hash = await bcrypt.hash(password, 12);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists:', email);
    return;
  }

  const user = await prisma.admin.create({
    data: {
      email,
      password: hash,
      role: 'ADMIN', 
      username: 'admin',
    },
  });

  console.log('Created admin user:', user.id, email, 'password:', password);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
