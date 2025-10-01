import csv

def analyze_foreign_keys():
    fk_fields = []
    
    with open('data_dictionary_2.csv', 'r') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        for row in reader:
            if len(row) >= 4 and row[3] == 'FK':  # Key type column is index 3
                table_name = row[0]
                field_name = row[1]
                description = row[2]
                data_type = row[5] if len(row) > 5 else ''
                
                fk_fields.append({
                    'table': table_name,
                    'field': field_name,
                    'description': description,
                    'data_type': data_type
                })
    
    return fk_fields

def main():
    fk_fields = analyze_foreign_keys()
    
    print(f"Found {len(fk_fields)} foreign key fields:")
    print("=" * 80)
    
    for i, fk in enumerate(fk_fields, 1):
        print(f"{i:2d}. Table: {fk['table']}")
        print(f"    Field: {fk['field']}")
        print(f"    Description: {fk['description']}")
        print(f"    Data Type: {fk['data_type']}")
        print("-" * 80)

if __name__ == "__main__":
    main()