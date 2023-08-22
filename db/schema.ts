
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  pgEnum,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from "next-auth/adapters";

export const userRoles = pgEnum('role', ['USER', 'ADMIN']);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  created_at: timestamp('created_at').notNull().defaultNow(),
  hashedPassword: text('hashed_password'),
  role: userRoles('role').default('USER').notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const usersRelationships = relations(users, ({many}) => ({
  assets: many(assets),
  carts: many(carts),
  moderations: many(assetsModerations),
}))



export const reportCategories = pgTable(
  'report_categories',
  {
    id: serial('id').primaryKey(),
    name: text('name').unique(),
  }
)

export const reviews = pgTable(
  'review', 
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    description: text('description'),
    stars: integer('stars'),
    userBoughtAssetsId: integer('user_bought_assets_id').notNull().unique(),
  }
)

export const assets = pgTable(
  'assets',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    description: text('description').notNull(),
    priceCents: integer('price_cents').notNull(),
    name: text('name').notNull(),
    assetCategoryId: integer('asset_category_id').notNull(),
    authorId: text('author_id').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    thumbnailKey: text('thumbnail_key'),
    moderationId: integer('moderation_id').notNull(),
    assetFileKey: text('asset_file_key').notNull().unique(),
    assetFileUrl: text('asset_file_url').notNull(),
  },
  (t) => ({
    unq: unique().on(t.name, t.authorId)
  })
)


export const moderationState = pgEnum('moderation_state', ['ACCEPTED', 'REJECTED', 'PENDING'])

export const assetsModerations = pgTable(
  "assets_moderations", 
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    description: text('description'),
    moderatorId: text("moderator_id").references(() => users.id),
    updatedAt: timestamp('updated_at'),
    state: moderationState('moderation_state').notNull().default('PENDING')
  }
)

export const assetCategories = pgTable(
  'asset_categories',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    imagePath: text('image_path').notNull(),
  }
)

export const assetImages = pgTable(
  'asset_images',
  {
    id: serial('id').primaryKey(),
    assetId: integer('asset_id').notNull(),
    imageKey: text('image_key').notNull().unique(),
    imageUrl: text('image_url').notNull(),
  }
)

export const assetImagesRelations = relations(assetImages, ({one}) => ({
  asset: one(assets, {
    fields: [assetImages.assetId],
    references: [assets.id]
  })
}))

export const assetsRelations = relations(assets, ({one, many}) => ({
  assetCategory: one(assetCategories, {
    fields: [assets.assetCategoryId],
    references: [assetCategories.id]
  }),
  author: one(users, {
    fields: [assets.authorId],
    references: [users.id],
  }),
  assetsInCarts: many(assetsInCarts),
  assetImages: many(assetImages),
  assetModeration: one(assetsModerations, {fields: [assets.moderationId], references: [assetsModerations.id]})
}))



export const assetCategoriesRelations = relations(assetCategories, ({many}) => ({
  assets: many(assets),
}))

export const reports = pgTable(
  'reports',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    description: text('description').notNull(),
    reportCategoryId: integer('report_category_id').notNull(),
    reportIssuerId: integer('report_issuer_id').notNull(),
    reportedAssetId: integer('reported_asset_id').notNull(),
  },
  (t) => ({
    unq: unique().on(t.reportIssuerId, t.reportedAssetId)
  })
)

export const reportCategoriesRelations = relations(reportCategories, ({ many }) => ({
	reports: many(reports),
}));

export const reportRelations = relations(reports, ({one}) => ({
  reportCategory: one(reportCategories, {
    fields: [reports.reportCategoryId],
    references: [reportCategories.id]
  })
}))

export const carts = pgTable(
  'carts',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    bought_at: timestamp('bought_at'),
    userId: text('userId').notNull(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.bought_at)
  })
)

export const cartRelations = relations(carts, ({many}) => ({
  assetsInCarts: many(assetsInCarts),
}))

export const assetsInCarts = pgTable(
  'assets_in_carts',
  {
    created_at: timestamp('created_at').notNull().defaultNow(),
    assetId: integer('asset_id').notNull(),
    cartId: integer('cart_id').notNull(),
    price: integer('price').notNull(),
  },
  (t) => ({
    pk: primaryKey(t.assetId, t.cartId)
  })
)

export const assetsInCartsRelations = relations(assetsInCarts, ({one}) => ({
  cart: one(carts, {
    fields: [assetsInCarts.cartId],
    references: [carts.id]
  }),
  asset: one(assets, {
    fields: [assetsInCarts.assetId],
    references: [assets.id],
  })
}))