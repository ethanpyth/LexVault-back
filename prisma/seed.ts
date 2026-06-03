import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database with realistic data...');

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.sentence.deleteMany({});
  await prisma.decisionJudiciaire.deleteMany({});
  await prisma.infraction.deleteMany({});
  await prisma.audience.deleteMany({});
  await prisma.casierJudiciaire.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tribunal.deleteMany({});
  await prisma.personne.deleteMany({});
  await prisma.adresse.deleteMany({});

  // Create 10 adresses
  const adresses = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.adresse.create({
        data: {
          avenue: faker.location.streetAddress(),
          commune: faker.location.city(),
          ville: String(faker.location.city()),
          pays: 'République démocratique ddu congo',
        },
      }),
    ),
  );

  // Create 10 persons
  const persons = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.personne.create({
        data: {
          nom: faker.person.lastName(),
          prenom: faker.person.firstName(),
          dateNaissance: faker.date.birthdate({
            min: 18,
            max: 80,
            mode: 'age',
          }),
          nationalite: 'Sénégalaise',
          nin: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
          email: faker.internet.email(),
          telephone: faker.phone.number(),
          adresseId: adresses[Math.floor(Math.random() * adresses.length)].id,
        },
      }),
    ),
  );

  // Create 10 users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const roles = ['ADMIN', 'GREFFIER', 'JUGE', 'PROCUREUR', 'ACCUSE'];
  await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          username: faker.internet.username(),
          passwordHash: hashedPassword,
          role: roles[i % roles.length] as any,
          personneId: persons[i].id,
        },
      }),
    ),
  );

  // Create 10 tribunals
  const tribunals = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.tribunal.create({
        data: {
          nom: `Tribunal ${faker.location.city()}`,
          typeTribunal: faker.helpers.arrayElement([
            'Tribunal Régional',
            'Tribunal de Première Instance',
            'Tribunal Correctionnel',
          ]),
          ville: String(faker.location.city()),
        },
      }),
    ),
  );

  // Create 10 casiers judiciaires
  const casiers = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.casierJudiciaire.create({
        data: {
          numeroCasier: `CJ-2026-${String(i + 1).padStart(6, '0')}`,
          statut: faker.helpers.arrayElement([
            'ACTIF',
            'SUSPENDU',
            'ARCHIVE',
          ]) as any,
          personneId: persons[i].id,
        },
      }),
    ),
  );

  // Create 10 audiences
  const audiences = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.audience.create({
        data: {
          dateAudience: faker.date.future(),
          statut: faker.helpers.arrayElement([
            'EN_ATTENTE',
            'EN_COURS',
            'TERMINE',
          ]) as any,
          casierId: casiers[Math.floor(Math.random() * casiers.length)].id,
          tribunalId:
            tribunals[Math.floor(Math.random() * tribunals.length)].id,
          jugeId: persons[Math.floor(Math.random() * persons.length)].id,
        },
      }),
    ),
  );

  // Create 10 infractions
  await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.infraction.create({
        data: {
          qualification: faker.helpers.arrayElement([
            'Vol',
            'Agression',
            'Fraude',
            'Faux documents',
            'Blanchiment',
          ]),
          articleViole: `Article ${faker.number.int({ min: 1, max: 500 })}`,
          gravite: faker.helpers.arrayElement(['LEGERE', 'MOYENNE', 'GRAVE']),
          dateInfraction: faker.date.past(),
          casierId: casiers[Math.floor(Math.random() * casiers.length)].id,
        },
      }),
    ),
  );

  // Create 10 decisions
  const decisions = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.decisionJudiciaire.create({
        data: {
          reference: `REF-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 100000, max: 999999 })}`,
          contenu: faker.lorem.paragraph(),
          dateDecision: faker.date.past(),
          typeDecision: faker.helpers.arrayElement([
            'CONDAMNATION',
            'ACQUITTEMENT',
            'SURSIS',
          ]),
          verdict: faker.helpers.arrayElement(['CULPABLE', 'INNOCENT']),
          motivation: faker.lorem.paragraph(),
          audienceId:
            audiences[Math.floor(Math.random() * audiences.length)].id,
          casierId: casiers[Math.floor(Math.random() * casiers.length)].id,
        },
      }),
    ),
  );

  // Create 10 sentences (one per decision)
  await Promise.all(
    decisions.map((decision) =>
      prisma.sentence.create({
        data: {
          typeSentence: faker.helpers.arrayElement([
            'PRISON',
            'SURSIS',
            'AMENDE',
          ]) as any,
          duree: faker.number.int({ min: 1, max: 20 }),
          uniteDuree: faker.helpers.arrayElement(['mois', 'ans']),
          dateSentence: faker.date.past(),
          montantAmende: faker.number.int({ min: 100000, max: 5000000 }),
          decisionId: decision.id,
        },
      }),
    ),
  );

  console.log('✅ Database seeded successfully!');
  console.log('📋 Created 10 realistic rows in each table');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
