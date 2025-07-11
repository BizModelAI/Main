import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  hasAccessPass: boolean("has_access_pass").default(false).notNull(),
  quizRetakesRemaining: integer("quiz_retakes_remaining").default(0).notNull(),
  totalQuizRetakesUsed: integer("total_quiz_retakes_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz attempts table to track when users take the quiz
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  quizData: jsonb("quiz_data").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Payments table to track quiz retake purchases
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("usd").notNull(),
  type: varchar("type").notNull(), // "access_pass" or "retake_bundle"
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  status: varchar("status").default("pending").notNull(), // "pending", "completed", "failed"
  retakesGranted: integer("retakes_granted").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
export const insertPaymentSchema = createInsertSchema(payments);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
