import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"), // Optional email for paid users
  hasAccessPass: boolean("has_access_pass").default(false).notNull(),
  quizRetakesRemaining: integer("quiz_retakes_remaining").default(0).notNull(),
  totalQuizRetakesUsed: integer("total_quiz_retakes_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz attempts table to track when users take the quiz
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  quizData: jsonb("quiz_data").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Payments table to track quiz retake purchases
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("usd").notNull(),
  type: varchar("type").notNull(), // "access_pass" or "retake_bundle"
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  status: varchar("status").default("pending").notNull(), // "pending", "completed", "failed"
  retakesGranted: integer("retakes_granted").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Temporary email tracking for unpaid users (expires after 24 hours)
export const unpaidUserEmails = pgTable("unpaid_user_emails", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(), // Browser session ID
  email: text("email").notNull(),
  quizData: jsonb("quiz_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertUnpaidUserEmailSchema = createInsertSchema(unpaidUserEmails);
export const insertPasswordResetTokenSchema =
  createInsertSchema(passwordResetTokens);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type UnpaidUserEmail = typeof unpaidUserEmails.$inferSelect;
export type InsertUnpaidUserEmail = z.infer<typeof insertUnpaidUserEmailSchema>;
