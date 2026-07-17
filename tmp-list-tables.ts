import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
async function main() {
  const res = await sql.query("select table_schema, table_name from information_schema.tables where table_type = 'BASE TABLE' order by table_schema, table_name");
  console.log(JSON.stringify(res, null, 2));
}
main().catch((err) => { console.error(err); process.exit(1); });
