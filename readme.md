# posts-to-pdf

This tool was created to automatically turn Posts from a WordPress site into PDF's.

## Usage:

```zsh
npx posts-to-pdf --url=https://example.com
```

**Options:**

|option      | shortcode | description                  | default | required |
|------------|-----------|------------------------------|---------|----------|
| `--url`    | `-u`      | Url of the WordPress site    |         | true     |
| `--format` | `-f`      | Format of the PDF            | `A4`    |          |
| `--output` | `-o`      | Path of the output folder    | `./`    |          |
| `--debug`  | `-d`      | Output additional debug info |         |          |
