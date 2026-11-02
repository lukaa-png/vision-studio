import bpy,json
from pathlib import Path
BASE=Path(__file__).resolve().parents[1];OUT=BASE/'build'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.context.scene.render.fps=30
bpy.ops.import_scene.gltf(filepath=str(OUT/'Vision-Mascote-animado.glb'))
r={'meshes':len([o for o in bpy.data.objects if o.type=='MESH']),'actions':len(bpy.data.actions),'samples':[]}
for f in [1,75,150]:
    bpy.context.scene.frame_set(f);bpy.context.view_layer.update()
    r['samples'].append({'frame':f,'root_rotation':list(bpy.data.objects['CTRL_flight'].matrix_world.to_euler()),'arm_rotation':list(bpy.data.objects['CTRL_shoulder_L'].matrix_world.to_euler())})
(OUT/'GLB-IMPORT-CHECK.json').write_text(json.dumps(r,indent=2),encoding='utf-8');print(json.dumps(r))
