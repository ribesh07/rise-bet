const { PrismaClient, Currency } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const password = 'ChangeMe123!'; // change immediately
  const hash = await bcrypt.hash(password, 12);

   await prisma.exchangeRate.createMany({
    data: [
      { currency: Currency.INR, rateInINR: 1 },
      { currency: Currency.USDT, rateInINR: 83.25 },
      { currency: Currency.USDC, rateInINR: 83.20 },
      { currency: Currency.BTC, rateInINR: 5600000 },
      { currency: Currency.ETH, rateInINR: 310000 },
      { currency: Currency.BNB, rateInINR: 21000 },
      { currency: Currency.SOL, rateInINR: 7500 },
      { currency: Currency.XRP, rateInINR: 52 },
      { currency: Currency.TRX, rateInINR: 7.2 },
      { currency: Currency.LTC, rateInINR: 6800 },
    ],
  });

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
