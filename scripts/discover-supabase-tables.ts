/**
 * Script to discover all tables in Supabase
 * Run: npx ts-node scripts/discover-supabase-tables.ts
 */

import { createClient } from "@supabase/supabase-js";

async function discoverTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Supabase credentials not found in environment variables");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("🔍 Discovering all tables in Supabase...\n");

  try {
    // Query information_schema to get all tables
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name");

    if (error) {
      console.error("Error querying tables:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No tables found.");
      return;
    }

    console.log(`Found ${data.length} tables:\n`);

    // Group tables by category
    const categories: Record<string, string[]> = {
      xtech: [],
      mantech: [],
      dod_contracts: [],
      news: [],
      gsa: [],
      stock: [],
      congressional: [],
      other: [],
    };

    data.forEach((table: any) => {
      const name = table.table_name;
      
      if (name.includes("army_innovation") || name.includes("xtech")) {
        categories.xtech.push(name);
      } else if (name.includes("mantech")) {
        categories.mantech.push(name);
      } else if (name.includes("dod_contract") || name.includes("defense_contract")) {
        categories.dod_contracts.push(name);
      } else if (name.includes("news") || name.includes("article")) {
        categories.news.push(name);
      } else if (name.includes("gsa")) {
        categories.gsa.push(name);
      } else if (name.includes("stock") || name.includes("ticker")) {
        categories.stock.push(name);
      } else if (name.includes("congressional")) {
        categories.congressional.push(name);
      } else {
        categories.other.push(name);
      }
    });

    // Print categorized tables
    console.log("📊 CATEGORIZED TABLES:\n");

    for (const [category, tables] of Object.entries(categories)) {
      if (tables.length > 0) {
        console.log(`\n${category.toUpperCase()} (${tables.length}):`);
        tables.forEach(table => console.log(`  - ${table}`));
      }
    }

    // Generate code snippet
    console.log("\n\n📝 CODE TO ADD TO lib/supabase-queries.ts:\n");
    console.log("const MATRIX_TABLES: Record<string, string[]> = {");
    
    for (const [category, tables] of Object.entries(categories)) {
      if (tables.length > 0 && category !== 'other') {
        console.log(`  ${category}: [`);
        tables.forEach(table => console.log(`    '${table}',`));
        console.log(`  ],`);
      }
    }
    
    console.log("};");

    // Sample row counts
    console.log("\n\n📈 CHECKING ROW COUNTS (first 5 tables):\n");
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const tableName = data[i].table_name;
      const { count, error: countError } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (!countError) {
        console.log(`  ${tableName}: ${count} rows`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

discoverTables();

