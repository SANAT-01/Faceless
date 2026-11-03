#!/usr/bin/env bash
# Compile a .tex to PDF using whichever LaTeX engine is available, then sanity-check the
# result. Usage: build_pdf.sh <file.tex> [outdir]
set -uo pipefail

TEX="${1:?usage: build_pdf.sh <file.tex> [outdir]}"
[ -f "$TEX" ] || { echo "build_pdf: no such file: $TEX" >&2; exit 2; }

SRCDIR=$(cd "$(dirname "$TEX")" && pwd)
BASE=$(basename "$TEX" .tex)
OUT="${2:-$SRCDIR}"
mkdir -p "$OUT"
OUT=$(cd "$OUT" && pwd)          # absolute: engines run from $SRCDIR
TEXNAME="$BASE.tex"              # relative to $SRCDIR, so \input of siblings resolves

# fontspec/unicode-math need xelatex or lualatex; pdflatex will fail hard on them.
NEEDS_UNICODE=0
grep -qE '\\usepackage(\[[^]]*\])?\{(fontspec|unicode-math)\}' "$TEX" && NEEDS_UNICODE=1

if [ "$NEEDS_UNICODE" -eq 1 ]; then
  ENGINES="tectonic xelatex lualatex latexmk-xe"
else
  ENGINES="tectonic latexmk pdflatex xelatex lualatex"
fi

run() {
  case "$1" in
    tectonic)    tectonic --outdir "$OUT" --keep-logs --chatter minimal "$TEXNAME" ;;
    latexmk)     latexmk -pdf -interaction=nonstopmode -halt-on-error \
                   -outdir="$OUT" "$TEXNAME" ;;
    latexmk-xe)  latexmk -pdfxe -interaction=nonstopmode -halt-on-error \
                   -outdir="$OUT" "$TEXNAME" ;;
    pdflatex|xelatex|lualatex)
                 # twice, so \hfill dates and any refs settle
                 "$1" -interaction=nonstopmode -halt-on-error -output-directory "$OUT" "$TEXNAME" \
                   && "$1" -interaction=nonstopmode -halt-on-error -output-directory "$OUT" "$TEXNAME" ;;
  esac
}

USED=""
for e in $ENGINES; do
  cmd="${e%-xe}"
  command -v "$cmd" >/dev/null 2>&1 || continue
  LOG="$OUT/$BASE.build.log"
  if (cd "$SRCDIR" && run "$e") >"$LOG" 2>&1; then
    USED="$e"
    break
  fi
  echo "build_pdf: $e failed; last errors:" >&2
  grep -E '^(!|l\.[0-9]+)' "$LOG" | head -20 >&2
done

if [ -z "$USED" ]; then
  if ! command -v tectonic >/dev/null 2>&1 && ! command -v pdflatex >/dev/null 2>&1; then
    cat >&2 <<'MSG'
build_pdf: no LaTeX engine found.
  Debian/Ubuntu: sudo apt-get install -y texlive-latex-recommended \
                   texlive-fonts-recommended texlive-latex-extra
  macOS:         brew install tectonic   (or: brew install --cask mactex-no-gui)
  Any platform:  cargo install tectonic
MSG
    exit 3
  fi
  echo "build_pdf: all available engines failed to compile $TEX" >&2
  exit 4
fi

PDF="$OUT/$BASE.pdf"
[ -f "$PDF" ] || { echo "build_pdf: $USED reported success but no PDF at $PDF" >&2; exit 4; }

SIZE=$(wc -c <"$PDF" | tr -d ' ')
PAGES="?"
command -v pdfinfo >/dev/null 2>&1 && PAGES=$(pdfinfo "$PDF" 2>/dev/null | awk '/^Pages:/{print $2}')
echo "build_pdf: OK  engine=$USED  pdf=$PDF  bytes=$SIZE  pages=${PAGES:-?}"

# Overfull boxes mean text is running off the page — reword the bullet, don't shrink margins.
if [ -f "$OUT/$BASE.log" ]; then
  OF=$(grep -c 'Overfull \\hbox' "$OUT/$BASE.log" 2>/dev/null); OF=${OF:-0}
  [ "$OF" -gt 0 ] && echo "build_pdf: WARNING $OF overfull hbox(es) — check for text past the margin" >&2
fi

# The real ATS test: does the text layer come out readable and in order?
if command -v pdftotext >/dev/null 2>&1; then
  pdftotext -layout "$PDF" "$OUT/$BASE.extracted.txt" 2>/dev/null \
    && echo "build_pdf: text layer -> $OUT/$BASE.extracted.txt (review it: name, email, phone, skills must all appear in sensible order)"
else
  echo "build_pdf: pdftotext not installed — could not verify the ATS text layer" >&2
fi

rm -f "$OUT/$BASE".{aux,out,fls,fdb_latexmk,synctex.gz,toc,nav,snm} 2>/dev/null
exit 0
