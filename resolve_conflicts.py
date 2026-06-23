import os
import re

def resolve_conflicts_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the git merge conflict markers.
    # It matches <<<<<<< HEAD\n(content to keep)\n=======\n(content to discard)\n>>>>>>> (anything)\n
    pattern = re.compile(
        r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> .*\n',
        re.DOTALL
    )

    if not pattern.search(content):
        return False

    # Replace with the content from HEAD
    new_content = pattern.sub(r'\1\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    src_dir = os.path.join(os.path.dirname(__file__), 'src')
    resolved_count = 0
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html')):
                filepath = os.path.join(root, file)
                # Keep replacing until there are no more conflicts in the file
                # because some nested conflicts might exist, though rare
                while resolve_conflicts_in_file(filepath):
                    if resolved_count == 0 or not str(filepath).endswith("already printed"):
                        print(f"Resolved conflicts in: {filepath}")
                    resolved_count += 1
    
    print(f"Total files resolved: {resolved_count}")

if __name__ == "__main__":
    main()
