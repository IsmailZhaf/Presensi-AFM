import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { Emilys_Candy } from "next/font/google";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);

export const ADMIN = pgTable("admin", {
    id: serial("id").primaryKey(),
    nama: varchar("nama", { length: 50 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    password: varchar("password").notNull(),
});

export const KELAS = pgTable("Kelas", {
    id: serial("id").primaryKey(),
    kelas: varchar("kelas", { length: 10 }).notNull(),
});

export const Kegiatan = pgTable("Kegiatan", {
    id: serial("id").primaryKey(),
    kegiatan: varchar("kegiatan", { length: 10 }).notNull(),
});

export const SANTRI = pgTable("santri", {
    nama: varchar("nama", { length: 50 }).notNull(),
    kelas: varchar("kelas", { length: 10 }).notNull(),
    angkatan: varchar("angkatan", { length: 20 }).notNull(),
    poin: integer("poin", { length: 5 }).default(300),
    NIS: varchar("NIS", { length: 20 }).primaryKey().notNull(),
    lastUpdatedMonth: varchar("lastUpdatedMonth", { length: 7 }), // Adding column for last updated month
});

export const KBM_Pagi = pgTable("KBM_Pagi", {
    id: serial("id", { length: 11 }).primaryKey(),
    NIS: varchar("NIS", { length: 20 }).notNull(),
    present: boolean("present").default(false),
    day: integer("day", { length: 11 }).notNull(), //22
    date: varchar("date", { length: 20 }).notNull(), //05/2024
});

export const KBM_Malam = pgTable("KBM_Malam", {
    id: serial("id", { length: 11 }).primaryKey(),
    NIS: varchar("NIS", { length: 20 }).notNull(),
    present: boolean("present").default(false),
    day: integer("day", { length: 11 }).notNull(), //22
    date: varchar("date", { length: 20 }).notNull(), //05/2024
});
