# posts-to-pdf

This tool was created to automatically turn Posts from a WordPress site into PDF's.

## Usage:

```zsh
npx posts-to-pdf https://example.com
```

**Options:**

|option          | shortcode | description                  | default | required |
|----------------|-----------|------------------------------|---------|----------|
| `--format`     | `-f`      | Format of the PDF            | `A4`    |          |
| `--output`     | `-o`      | Path of the output folder    | `./`    |          |
| `--scale`      | `-s`      | Scale of the page            | `1`     |          |
| `--landscape`  | `-l`      | PDF in landscape orientation | `false`     |          |
| `--post-type`  | `-t`      | Post type                    | `posts`     |          |
| `--debug`      | `-d`      | Output additional debug info |         |          |
