import "dotenv/config";
import { db } from "./index";
import { users, groups, groupMembers, matches, matchJoins, matchComments } from "./schema";
import bcrypt from "bcrypt";

const PASSWORD = "pass123";
const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Delete existing data (for fresh seeding)
    await db.delete(matchComments);
    await db.delete(matchJoins);
    await db.delete(matches);
    await db.delete(groupMembers);
    await db.delete(groups);
    await db.delete(users);

    console.log("✓ Cleared existing data");

    // Create users
    const userEmails = [
      "steve@gmail.com",
      "peter@gmail.com",
      "dave@gmail.com",
      "john@gmail.com",
      "nick@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    const hashedPassword = await hashPassword(PASSWORD);

    const createdUsers = await db
      .insert(users)
      .values(
        userEmails.map((email) => ({
          email,
          passwordHash: hashedPassword,
          name: email.split("@")[0],
          photoUrl: null,
        }))
      )
      .returning();

    console.log(`✓ Created ${createdUsers.length} users`);

    // Create a map for easy user lookup
    const userMap = new Map(createdUsers.map((u) => [u.email, u.id]));

    // Helper function to get user ID by email
    const getUserId = (email: string) => userMap.get(email)!;

    // Create groups
    const sofiaDebury = await db
      .insert(groups)
      .values({
        title: "Sofia Derby",
        description: "Weekly Sunday matches in Sofia",
      })
      .returning();

    const sundayHeroes = await db
      .insert(groups)
      .values({
        title: "Sunday Heroes",
        description: "Fun weekend football matches",
      })
      .returning();

    console.log("✓ Created 2 groups");

    // Sofia Derby members: steve, dave, nick, user1-user9
    const sofiaMembers = [
      "steve@gmail.com",
      "dave@gmail.com",
      "nick@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    // Sunday Heroes members: steve, peter, john, user1-user9
    const sundayMembers = [
      "steve@gmail.com",
      "peter@gmail.com",
      "john@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    // Add Sofia Derby members
    await db
      .insert(groupMembers)
      .values(
        sofiaMembers.map((email) => ({
          groupId: sofiaDebury[0].id,
          userId: getUserId(email),
          isManager: email === "steve@gmail.com",
        }))
      );

    // Add Sunday Heroes members
    await db
      .insert(groupMembers)
      .values(
        sundayMembers.map((email) => ({
          groupId: sundayHeroes[0].id,
          userId: getUserId(email),
          isManager: email === "steve@gmail.com" || email === "peter@gmail.com",
        }))
      );

    console.log("✓ Added group members and managers");

    // Create matches
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const match1Date = new Date(today);
    match1Date.setDate(match1Date.getDate() + 3);
    match1Date.setHours(19, 0, 0, 0);

    const match2Date = new Date(today);
    match2Date.setDate(match2Date.getDate() + 5);
    match2Date.setHours(19, 0, 0, 0);

    const match3Date = new Date(today);
    match3Date.setDate(match3Date.getDate() + 6);
    match3Date.setHours(18, 0, 0, 0);

    const match4Date = new Date(today);
    match4Date.setDate(match4Date.getDate() - 20);
    match4Date.setHours(19, 0, 0, 0);

    const match5Date = new Date(today);
    match5Date.setDate(match5Date.getDate() - 30);
    match5Date.setHours(18, 0, 0, 0);

    const createdMatches = await db
      .insert(matches)
      .values([
        {
          groupId: sofiaDebury[0].id,
          date: match1Date,
          location: "The School",
          capacity: 12,
          canceled: false,
        },
        {
          groupId: sofiaDebury[0].id,
          date: match2Date,
          location: "Students Town",
          capacity: 12,
          canceled: false,
        },
        {
          groupId: sundayHeroes[0].id,
          date: match3Date,
          location: "Arena 111",
          capacity: 10,
          canceled: false,
        },
        {
          groupId: sofiaDebury[0].id,
          date: match4Date,
          location: "Students Town",
          capacity: 12,
          canceled: false,
        },
        {
          groupId: sundayHeroes[0].id,
          date: match5Date,
          location: "Arena 111",
          capacity: 12,
          canceled: false,
        },
      ])
      .returning();

    console.log("✓ Created 5 matches");

    // Add match joins (half of the group members for each match)
    const sofiaHalfMembers = sofiaMembers.slice(0, Math.ceil(sofiaMembers.length / 2));
    const sundayHalfMembers = sundayMembers.slice(0, Math.ceil(sundayMembers.length / 2));

    // Match 1 (Sofia Derby) - half members join
    await db
      .insert(matchJoins)
      .values(
        sofiaHalfMembers.map((email) => ({
          matchId: createdMatches[0].id,
          userId: getUserId(email),
          extraSlots: 0,
        }))
      );

    // Match 2 (Sofia Derby) - half members join
    await db
      .insert(matchJoins)
      .values(
        sofiaHalfMembers.map((email) => ({
          matchId: createdMatches[1].id,
          userId: getUserId(email),
          extraSlots: email === "steve@gmail.com" ? 1 : 0,
        }))
      );

    // Match 3 (Sunday Heroes) - half members join
    await db
      .insert(matchJoins)
      .values(
        sundayHalfMembers.map((email) => ({
          matchId: createdMatches[2].id,
          userId: getUserId(email),
          extraSlots: 0,
        }))
      );

    // Match 4 (Sofia Derby - past) - half members joined
    await db
      .insert(matchJoins)
      .values(
        sofiaHalfMembers.map((email) => ({
          matchId: createdMatches[3].id,
          userId: getUserId(email),
          extraSlots: 0,
        }))
      );

    // Match 5 (Sunday Heroes - past) - half members joined
    await db
      .insert(matchJoins)
      .values(
        sundayHalfMembers.map((email) => ({
          matchId: createdMatches[4].id,
          userId: getUserId(email),
          extraSlots: 0,
        }))
      );

    console.log("✓ Added match joins");

    // Sample comments for each match
    const comments = [
      [
        { email: "steve@gmail.com", text: "Looking forward to this match! Let's show what we got!" },
        { email: "dave@gmail.com", text: "Will be there early to warm up" },
        { email: "nick@gmail.com", text: "Great location, easy to get to" },
      ],
      [
        { email: "steve@gmail.com", text: "This should be a good one. Bring your A-game!" },
        { email: "user1@gmail.com", text: "Can't wait! See you all there" },
        { email: "user5@gmail.com", text: "What time does it start exactly?" },
      ],
      [
        { email: "peter@gmail.com", text: "Excited for this match with the Sunday Heroes squad" },
        { email: "john@gmail.com", text: "Let's make this a memorable one" },
      ],
      [
        { email: "steve@gmail.com", text: "Great match yesterday! We dominated the second half" },
        { email: "dave@gmail.com", text: "Amazing teamwork everyone!" },
        { email: "user3@gmail.com", text: "That was intense but fun" },
      ],
      [
        { email: "peter@gmail.com", text: "What a game! Best match we've had this season" },
        { email: "john@gmail.com", text: "Everyone played their hearts out" },
        { email: "user2@gmail.com", text: "Looking forward to the next one" },
      ],
    ];

    // Add comments
    for (let i = 0; i < createdMatches.length; i++) {
      await db
        .insert(matchComments)
        .values(
          comments[i].map((comment) => ({
            matchId: createdMatches[i].id,
            userId: getUserId(comment.email),
            text: comment.text,
          }))
        );
    }

    console.log("✓ Added match comments");

    console.log("\n✅ Database seed completed successfully!");
    console.log("\nSample credentials:");
    console.log("  Email: steve@gmail.com");
    console.log("  Password: pass123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
