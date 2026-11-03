"""Narration with espeak-ng instead of Kokoro, for machines that cannot reach the Kokoro model.

  python3 tools/espeak_voice.py [project=.] [--voice en-gb] [--wpm 150] [--pitch 35]

Writes the same three files voice.py + words.py would: data/narration.wav, data/lines.json and
data/words.json, so mix.py and the shot list need no changes. Each script line is synthesised whole
(so the prosody is per sentence, not per word); word times are then laid out inside the line's REAL
measured duration, weighted by letters, the way estimate.py does it.

espeak-ng is a formant synthesiser: it is clear and perfectly timed, but obviously robotic. Use it to
hear the pacing, then replace it with a real recording (words.py --audio) or Kokoro when reachable.
"""
import argparse, json, re, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy import signal

SR = 24000

ap = argparse.ArgumentParser()
ap.add_argument('project', nargs='?', default='.')
ap.add_argument('--voice', default='en-gb', help='espeak-ng voice (espeak-ng --voices)')
ap.add_argument('--wpm', type=int, default=150, help='words per minute')
ap.add_argument('--pitch', type=int, default=35, help='0-99')
a = ap.parse_args()

P = Path(a.project)
S = json.loads((P / 'script.json').read_text())
(P / 'data').mkdir(exist_ok=True)

def say(text):
    """synthesise one line, return mono float32 at SR"""
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        tmp = f.name
    subprocess.run(['espeak-ng', '-v', a.voice, '-s', str(a.wpm), '-p', str(a.pitch),
                    '-w', tmp, text], check=True, capture_output=True)
    sr, x = wavfile.read(tmp)
    Path(tmp).unlink(missing_ok=True)
    x = x.astype(np.float32) / 32768.0
    if x.ndim > 1:
        x = x.mean(1)
    if sr != SR:                                              # resample to the engine's rate
        x = signal.resample_poly(x, SR, sr)
    # trim the silence espeak pads each utterance with, so gaps are ours to control
    amp = np.abs(x)
    thr = max(1e-4, amp.max() * 0.02)
    nz = np.flatnonzero(amp > thr)
    if len(nz):
        x = x[max(0, nz[0] - int(0.02 * SR)):min(len(x), nz[-1] + int(0.04 * SR))]
    return x

lead = float(S.get('lead', 0.4))
gap_default = float(S.get('gap', 0.3))
outro = float(S.get('outro', 0.9))

out = [np.zeros(int(lead * SR))]
t = lead
lines, words = [], []

for i, ln in enumerate(S['lines']):
    x = say(ln['text'])
    dur = len(x) / SR
    start, end = t, t + dur
    lines.append({'i': i, 'text': ln['text'], 'start': round(start, 3), 'end': round(end, 3)})

    # lay the words out inside the measured line, weighted by letters (commas and stops add a pause)
    toks = ln['text'].split()
    letters = [len(re.sub(r'[^A-Za-z0-9]', '', w)) or 1 for w in toks]
    pause = [0.18 if w.endswith((',', ':', ';')) else 0.3 if w.endswith(('.', '?', '!')) else 0.0 for w in toks]
    weight = [l + 2.5 for l in letters]
    span = max(0.05, dur - sum(pause))
    unit = span / sum(weight)
    wt = start
    for w, wgt, pz in zip(toks, weight, pause):
        ws = wt
        we = ws + wgt * unit
        words.append({'w': w, 'line': i, 's': round(ws, 3), 'e': round(we, 3)})
        wt = we + pz

    g = float(ln.get('gap', gap_default))
    out += [x, np.zeros(int(g * SR))]
    t = end + g
    print(f'{i:2d} {start:6.2f}-{end:6.2f}  {ln["text"][:58]}', flush=True)

out.append(np.zeros(int(outro * SR)))
y = np.concatenate(out)
y = y / (np.abs(y).max() + 1e-9) * 0.9
wavfile.write(P / 'data/narration.wav', SR, (y * 32767).astype(np.int16))
dur = len(y) / SR
(P / 'data/lines.json').write_text(json.dumps(
    {'duration': round(dur, 3), 'voice': f'espeak-ng:{a.voice}', 'speed': a.wpm, 'lines': lines}, indent=1))
(P / 'data/words.json').write_text(json.dumps(words, indent=1))
print(f'data/narration.wav ({dur:.2f} s, espeak-ng {a.voice} @ {a.wpm} wpm) + lines.json + words.json')
