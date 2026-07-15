#!/usr/bin/env python3
"""Extract INSERT statements from backup SQL and split into batched files."""
import os
import re
import sys

BACKUP_FILE = os.path.join(os.path.dirname(__file__), '..', 'backup_source_full.sql')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'sql_batches')
BATCH_SIZE = 50  # rows per batch

def main():
    table_filter = sys.argv[1] if len(sys.argv) > 1 else None
    
    with open(BACKUP_FILE, 'r') as f:
        lines = f.readlines()
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    current_table = None
    current_inserts = []
    batch_num = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect TRUNCATE lines to identify tables
        truncate_match = re.match(r'TRUNCATE TABLE (\w+)', line)
        if truncate_match:
            # Flush previous table
            if current_table and current_inserts:
                flush_batch(current_table, current_inserts, batch_num, OUTPUT_DIR, BATCH_SIZE, table_filter)
            current_table = truncate_match.group(1)
            current_inserts = []
            batch_num = 0
            continue
        
        # Detect INSERT lines
        insert_match = re.match(r'INSERT INTO (\w+)', line)
        if insert_match:
            table_name = insert_match.group(1)
            if table_name != current_table:
                if current_table and current_inserts:
                    flush_batch(current_table, current_inserts, batch_num, OUTPUT_DIR, BATCH_SIZE, table_filter)
                current_table = table_name
                current_inserts = []
                batch_num = 0
            current_inserts.append(line)
            continue
        
        # Comment lines like "-- products: 616 rows"
        comment_match = re.match(r'-- (\w+): (\d+) rows', line)
        if comment_match:
            if current_table and current_inserts:
                flush_batch(current_table, current_inserts, batch_num, OUTPUT_DIR, BATCH_SIZE, table_filter)
            current_table = None
            current_inserts = []
            batch_num = 0
            continue
    
    # Flush last table
    if current_table and current_inserts:
        flush_batch(current_table, current_inserts, batch_num, OUTPUT_DIR, BATCH_SIZE, table_filter)

def flush_batch(table_name, inserts, start_batch, output_dir, batch_size, table_filter=None):
    if table_filter and table_name != table_filter:
        return
    
    global_batch = 0
    for i in range(0, len(inserts), batch_size):
        batch = inserts[i:i + batch_size]
        batch_file = os.path.join(output_dir, f"{table_name}_batch_{start_batch:03d}.sql")
        with open(batch_file, 'w') as f:
            if global_batch == 0:
                f.write(f"TRUNCATE TABLE {table_name};\n")
            for insert in batch:
                f.write(insert + "\n")
            f.write(f"SELECT '{table_name}' as table_name, COUNT(*) as rows_inserted FROM {table_name};\n")
        print(f"  {batch_file} ({len(batch)} rows)")
        start_batch += 1
        global_batch += 1

if __name__ == '__main__':
    main()
