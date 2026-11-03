# LaTeX Resume Pipeline

Read this before generating any resume or cover letter. Every tailored resume ships as **both**
an editable `.tex` and a compiled `.pdf`. The PDF is what gets uploaded to portals; the `.tex`
is what the user keeps and edits.

## 1. Pick the base template

In priority order:

1. **The user's own `.tex`** (best). Preserve their document class, custom macros, fonts,
   spacing and section order. Change only the content that needs tailoring. The output should
   be recognisably *their* resume — a user who opens the `.tex` should see their own file with
   edited bullets, not a new document.
2. **`assets/resume_ats.tex`** if they have no LaTeX source. Fill it from their parsed
   PDF/DOCX. Mention once that if they send their `.tex`, future resumes will keep their exact
   formatting.

Keep the untouched original as `base_resume.tex` in the working directory and derive every
tailored copy from it. Never edit the base in place.

## 2. Tailor the content, not the layout

Per job:

- Rewrite the summary line to address this role directly.
- Reorder experience bullets so the most JD-relevant ones come first (reorder, don't delete
  history).
- Swap in the JD's exact vocabulary where it's truthful — if the JD says "distributed
  systems" and the resume says "scalable backends", use the JD's phrase.
- Update the Skills section ordering so required skills lead.
- Trim to the target page count for the market (1 page US/Canada, 2-3 India).
- Do not change fonts, margins, colours or section styling. Layout stays as the user wrote it.

Add a comment block at the top of each tailored `.tex` so the user can tell versions apart:

```latex
% Tailored for: Razorpay — Backend Engineer (JD-12345678)
% Generated: 2026-11-03
% Changes: summary rewritten for payments/distributed systems; Go + Kafka moved to front of
%          skills; payment-module bullet promoted to first position under Acme Corp.
```

### Placeholder convention in the bundled templates

`assets/resume_ats.tex` and `assets/cover_letter.tex` mark every fill-in slot as
`{{LIKE THIS}}`. Double braces are harmless LaTeX groups, so the templates compile as-is —
which means you can build them to check the toolchain before filling anything in. Replace the
whole `{{...}}`, braces included.

Do **not** use `[square brackets]` for placeholders. A `[` at the start of a line, or right
after `\\`, is parsed as an optional argument and either errors out or silently prints the
spacing value into the document. Likewise, never let a placeholder swallow a real optional
argument such as `\\[0.3em]` or `\usepackage[T1]{fontenc}`.

### Package dependencies

The bundled templates need `enumitem`, `titlesec`, `charter`, `geometry`, `hyperref` and
`parskip`. On a minimal TeX Live, `enumitem` and `titlesec` live in **texlive-latex-extra** —
`texlive-latex-base` and `-recommended` alone are not enough:

```
sudo apt-get install -y --no-install-recommends \
  texlive-latex-base texlive-latex-recommended texlive-fonts-recommended \
  texlive-latex-extra poppler-utils
```

`poppler-utils` supplies `pdfinfo` and `pdftotext`, which `build_pdf.sh` uses to check page
count and the ATS text layer. If a package is genuinely unavailable, drop the dependency
rather than the section — e.g. replace `titlesec` section styling with plain
`\section*{...}` + `\hrule`, and `enumitem` tuning with bare `itemize`.

## 3. ATS-safe LaTeX rules

Portal parsers (Naukri, Workday, Taleo, Greenhouse, Lever) extract the PDF's text layer. These
break extraction — avoid them in resume output:

| Avoid | Why | Use instead |
|---|---|---|
| `multicol`, side-by-side `minipage` columns | Text extracted in wrong reading order | Single column, full width |
| `tabular` for layout of experience/skills | Cells extracted out of order or merged | `itemize` lists, `\hfill` for right-aligned dates |
| Text inside `tikzpicture`, charts, skill bars | Not text at all — invisible to ATS | Plain text proficiency words |
| Images, logos, headshots (India/US) | Ignored, sometimes breaks parsing | Omit (except Germany/UAE where a photo is expected) |
| Header/footer contact info via `fancyhdr` | Often dropped by parsers | Contact block in the body, top of page 1 |
| Ligature-heavy or non-embedded fonts | Garbled extraction ("ti" → "fi") | Standard `lmodern`, `charter`, `FiraSans`, or `fontspec` with a common TTF |
| Unicode icons/glyphs for phone/email | Extract as junk | Plain text, or keep the glyph *and* the plain text |
| `\\` inside bullets to fake columns | Breaks sentence extraction | One fact per bullet |

Also:
- Use real section headings (`\section{Experience}`), not bolded paragraph text.
- Keep hyperlinks as `\href{mailto:...}{plain@text.visible}` — the visible text must be the
  address, not "Email me".
- Use standard section names: Summary, Skills, Experience, Projects, Education,
  Certifications. Creative headings ("Where I've Made Dents") confuse section-aware parsers.
- Set PDF metadata so the file is self-describing:
  `\usepackage[pdftitle={Name — Resume},pdfauthor={Name}]{hyperref}`

## 4. Escaping (silent failure source)

Job descriptions and company names routinely contain characters LaTeX treats as markup. Escape
before inserting any extracted text:

| Char | Escape |
|---|---|
| `&` | `\&` |
| `%` | `\%` |
| `$` | `\$` |
| `#` | `\#` |
| `_` | `\_` |
| `{` `}` | `\{` `\}` |
| `~` | `\textasciitilde{}` |
| `^` | `\textasciicircum{}` |
| `\` | `\textbackslash{}` |
| `<` `>` | `\textless{}` `\textgreater{}` |

Common real cases: "P&G", "C#", "100% uptime", "$2M ARR", "node_modules", "C++" (fine),
"R&D", "AT&T". Em dashes and smart quotes copied from a JD should become `---` and
`` `` ''`` or be replaced with ASCII.

## 5. Compile

Use the helper:

```bash
bash scripts/build_pdf.sh path/to/resume.tex [outdir]
```

It tries, in order: `tectonic`, `latexmk -pdf`, `pdflatex` (twice, for refs), `xelatex`,
`lualatex`. It auto-switches to `xelatex`/`lualatex` when the source uses `fontspec`.

**Verify every build before delivering:**

1. The `.pdf` exists and is non-trivial (> 10 KB for a real resume).
2. Page count matches the target: `pdfinfo file.pdf | grep Pages` (or `pdftk`/Python).
3. The text layer extracts cleanly — this is the actual ATS check:
   `pdftotext -layout file.pdf - | head -60`. Confirm name, email, phone, company names and
   key skills all appear as readable text in sensible order. If a section is missing or
   scrambled, the layout is not ATS-safe — fix it.
4. No content spilling off the page: grep the log for `Overfull \hbox` warnings over ~15pt and
   fix by rewording the bullet (don't shrink margins).

**If no LaTeX engine is installed on the machine**, don't silently skip the PDF:

- Try `tectonic` (single binary, downloads what it needs): `cargo install tectonic`, or the
  release binary. On Debian/Ubuntu a full install is
  `sudo apt-get install -y texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra`;
  on macOS `brew install --cask mactex-no-gui` or `brew install tectonic`.
- If installation isn't possible, deliver the `.tex` plus a PDF rendered from an HTML fallback
  of the same content (headless Chromium `--print-to-pdf`), and tell the user plainly that the
  PDF is a fallback render and the `.tex` is authoritative. Never claim a LaTeX PDF was
  produced when it wasn't.

## 6. Naming and bundling

```
[Name]_Resume_[Company]_[RoleShort].tex
[Name]_Resume_[Company]_[RoleShort].pdf
[Name]_CoverLetter_[Company].tex
[Name]_CoverLetter_[Company].pdf
```

Put any `.cls` / `.sty` the sources depend on in `_shared/` at the zip root, and if the `.tex`
expects them alongside, add a one-line `_shared/README.txt` saying to copy them next to the
`.tex` before compiling. Clean up `.aux`, `.log`, `.out`, `.fls`, `.fdb_latexmk` — never ship
build artifacts.
