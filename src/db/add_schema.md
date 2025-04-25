# Add Schema

This file exists because it might be a while between adding new schema definitions.

To add a schema, you do the following.

1. Add the schema definition in `/db/schema` as a standalone TypeScript file following the conventions in that folder.
2. Edit the barrel export file in `/db/schema.ts`. This is so that you can actually use the Drizzle type definitions in the rest of the app.
3. Generate the Drizzle migrations `drizzle-kit generate`.
4. Run the Drizzle migration `drizzle-kit migrate`.