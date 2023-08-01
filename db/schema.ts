
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const accounts = pgTable(
  'accounts',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    access_token: text('access_token'),
    expires_in: integer('expires_in'),
    id_token: text('id_token'),
    refresh_token: text('refresh_token'),
    refresh_token_expires_in: integer('refresh_token_expires_in'),
    scope: varchar('scope', { length: 255 }),
    token_type: varchar('token_type', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  account => ({
    providerProviderAccountIdIndex: uniqueIndex(
      'accounts__provider__providerAccountId__idx'
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index('accounts__userId__idx').on(account.userId),
  })
);

export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    sessionToken: varchar('sessionToken', { length: 255 }).notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    expires: timestamp('expires').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  session => ({
    sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
      session.sessionToken
    ),
    userIdIndex: index('sessions__userId__idx').on(session.userId),
  })
);

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('emailVerified'),
    image: varchar('image', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    hashedPassword: text('hashed_password'),
  },
  user => ({
    emailIndex: uniqueIndex('users__email__idx').on(user.email),
  })
);

export const usersRelationships = relations(users, ({many}) => ({
  assets: many(assets),
  userBoughtAssets: many(userBoughtAssets),
}))

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: varchar('identifier', { length: 255 }).primaryKey().notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  verificationToken => ({
    tokenIndex: uniqueIndex('verification_tokens__token__idx').on(
      verificationToken.token
    ),
  })
);

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

export const userBoughtAssets = pgTable(
  'user_bought_assets',
  {
    userId: integer('user_id').notNull(),
    assetId: integer('asset_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    price: integer('price').notNull(),
  }, (t) => ({
		pk: primaryKey(t.userId, t.assetId),
	})
)

export const userBoughtAssetsRelations = relations(userBoughtAssets, ({one}) => ({
  user: one(users, {
    fields: [userBoughtAssets.userId],
    references: [users.id]
  }),
  asset: one(assets, {
    fields: [userBoughtAssets.assetId],
    references: [assets.id],
  })
}))

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
    thumbnailPath: text('thumbnail_path'),
  },
  (t) => ({
    unq: unique().on(t.name, t.authorId)
  })
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
    imagePath: text('image_path').notNull().unique(),
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
  userBoughtAssets: many(userBoughtAssets),
  assetImages: many(assetImages),
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

