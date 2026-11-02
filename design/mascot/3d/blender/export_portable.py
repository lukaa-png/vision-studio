import bpy
from pathlib import Path
BASE=Path(__file__).resolve().parents[1];OUT=BASE/'build'
bpy.ops.wm.open_mainfile(filepath=str(OUT/'Vision-Mascote-articulado-teste.blend'))
code=(BASE/'blender/render_export.py').read_text(encoding='utf-8').split('# Export only the character, leaving the editable source untouched on disk.')[1]
exec(compile(code,'export_portable','exec'))
