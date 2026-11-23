import { relations } from "drizzle-orm/_relations";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
]);

const timeStamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("user"),
  passwordHash: text("password_hash").notNull(),
  ...timeStamps,
});

export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  ...timeStamps,
});

export const projectMembersTable = pgTable(
  "project_members",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.projectId, table.userId],
    }),
    // Supports queries such as:
    // "Find all projects this user belongs to."
    index("project_members_user_idx").on(table.userId),
  ],
);

export const tasksTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("pending"),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  assignedTo: uuid("assigned_to"),
  // Persistent drag-and-drop ordering.
  // position: integer("position"),
  ...timeStamps,
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(usersTable, ({ many }) => ({
  memberships: many(projectMembersTable),
  createdProjects: many(projectsTable),
  createdTasks: many(tasksTable, {
    relationName: "taskCreator",
  }),
  assignedTasks: many(tasksTable, {
    relationName: "taskAssignee",
  }),
}));

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [projectsTable.createdBy],
    references: [usersTable.id],
  }),
  members: many(projectMembersTable),
  tasks: many(tasksTable),
}));

export const projectMembersRelations = relations(
  projectMembersTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectMembersTable.projectId],
      references: [projectsTable.id],
    }),
    user: one(usersTable, {
      fields: [projectMembersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  }),
  creator: one(usersTable, {
    fields: [tasksTable.createdBy],
    references: [usersTable.id],
    relationName: "taskCreator",
  }),
  assignee: one(usersTable, {
    fields: [tasksTable.assignedTo],
    references: [usersTable.id],
    relationName: "taskAssignee",
  }),
}));
