import bcrypt from 'bcrypt';

async function main() {
  const hash = await bcrypt.hash('1234', 10);

  console.log(hash);
}

void main();
