#!/usr/bin/env python3
"""Simplify audit_logs batch SQL files - v2: use regex to extract key fields."""
import re
import glob
import os

BATCH_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sql_batches')
OUTPUT_DIR = os.path.join(BATCH_DIR, 'simplified')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Each INSERT has this structure:
# INSERT INTO audit_logs (...) VALUES ('<id>', NULL, 'products', '<record_id>', 'UPDATE', '<old_data>', '<new_data>', '<created_at>');
# old_data and new_data are JSON blobs that may contain unescaped single quotes.
# Strategy: find each INSERT line, extract the 4 simple quoted fields (id, record_id, action, created_at)
# and reconstruct with NULL for old_data/new_data.

# Extract: id (1st), record_id (4th), created_at (8th) - these don't contain quotes
# The action is always 'UPDATE'

for f in sorted(glob.glob(os.path.join(BATCH_DIR, 'audit_logs_batch_*.sql'))):
    basename = os.path.basename(f)
    with open(f) as fh:
        content = fh.read()
    
    lines = content.strip().split('\n')
    new_lines = []
    skipped = 0
    
    for line in lines:
        line = line.strip()
        if not line.startswith('INSERT'):
            continue
        
        # Strategy: find the VALUES ( prefix, then extract fields by finding quote boundaries
        # For the simple fields (1, 2, 3, 4, 5, 8) we can parse with quotes
        # For old_data (6) and new_data (7) which are JSON blobs, just skip them
        
        # Use a different approach: the INSERT statement format is fixed:
        # INSERT INTO audit_logs (id, user_id, table_name, record_id, action, old_data, new_data, created_at) VALUES (V1, V2, V3, V4, V5, V6, V7, V8);
        
        # Extract the id - it's the first value after VALUES (
        m = re.match(
            r"INSERT INTO audit_logs \(id, user_id, table_name, record_id, action, old_data, new_data, created_at\) VALUES "
            r"\('([^']+)', "       # id
            r"NULL, "             # user_id
            r"'([^']+)', "        # table_name
            r"'([^']+)', "        # record_id
            r"'([^']+)', "        # action
            r"'[^']*', "          # old_data (first part until closing quote - but may have internal quotes!)
            r"'[^']*', "          # new_data
            r"'([^']+)'\);",      # created_at
            line
        )
        
        if m:
            log_id, table_name, record_id, action, created_at = m.groups()
            new_line = f"INSERT INTO audit_logs (id, user_id, table_name, record_id, action, old_data, new_data, created_at) VALUES ('{log_id}', NULL, '{table_name}', '{record_id}', '{action}', NULL, NULL, '{created_at}') ON CONFLICT (id) DO NOTHING;"
            new_lines.append(new_line)
        else:
            # The regex failed because old_data/new_data contain unescaped quotes
            # Fall back: extract fields by finding known anchors
            # id is always first after VALUES ('
            vals_start = line.index("VALUES (") + len("VALUES (")
            
            # Extract id: between VALUES ( and the next ',
            id_start = vals_start + 1  # skip opening quote
            id_end = line.index("', ", vals_start)
            log_id = line[id_start:id_end]
            
            # Find record_id: after "NULL, 'products', '" 
            products_marker = "NULL, 'products', '"
            products_pos = line.index(products_marker)
            rec_start = products_pos + len(products_marker)
            rec_end = line.index("', ", rec_start)
            record_id = line[rec_start:rec_end]
            
            # Find action: after record_id's closing quote + ", '"
            action_start = rec_end + 3  # "', "
            action_end = line.index("', ", action_start)
            action = line[action_start:action_end]
            
            # Find created_at: it's the last value before ');'
            # Work backwards from ');
            created_at_end = line.rindex("');")
            # Find the quote before created_at - go back from created_at_end
            created_at_start = line.rindex("'", 0, created_at_end)
            # But there might be the old_data/new_data quotes before...
            # Better: created_at is after the 7th comma following VALUES
            # Use: the last '...' before ');
            # Actually, find the second-to-last quote pair
            # The pattern ends with: ...json_blob', 'timestamp');
            # Find ');' and work backwards
            ts_end = created_at_end  # position of ');
            ts_last_quote = line.rindex("'", 0, ts_end)
            # Find the comma + space before the timestamp's opening quote
            comma_before_ts = line.rindex(", '", 0, ts_last_quote)
            created_at = line[comma_before_ts + 3:ts_last_quote]
            
            new_line = f"INSERT INTO audit_logs (id, user_id, table_name, record_id, action, old_data, new_data, created_at) VALUES ('{log_id}', NULL, 'products', '{record_id}', '{action}', NULL, NULL, '{created_at}') ON CONFLICT (id) DO NOTHING;"
            new_lines.append(new_line)
    
    output_path = os.path.join(OUTPUT_DIR, basename)
    with open(output_path, 'w') as fh:
        fh.write('\n'.join(new_lines) + '\n')
    
    orig_size = os.path.getsize(f)
    new_size = sum(len(l) + 1 for l in new_lines)
    print(f"{basename}: {orig_size:,}B -> {new_size:,}B ({len(new_lines)} rows, {new_size*100//max(orig_size,1)}%)")
