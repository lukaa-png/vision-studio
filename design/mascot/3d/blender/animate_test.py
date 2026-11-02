import bpy,math,json
from pathlib import Path
from mathutils import Vector
BASE=Path(__file__).resolve().parents[1];OUT=BASE/'build'
bpy.ops.wm.open_mainfile(filepath=str(OUT/'Vision-Mascote-prototipo.blend'))
s=bpy.context.scene;s.render.resolution_x=960;s.render.resolution_y=540;s.render.resolution_percentage=100
s.render.engine='BLENDER_EEVEE_NEXT'
if hasattr(s.eevee,'taa_render_samples'):s.eevee.taa_render_samples=16
s.camera.data.ortho_scale=4.8;s.view_settings.exposure=.5
s.world.node_tree.nodes['Background'].inputs[1].default_value=.65
root=bpy.data.objects['CTRL_flight'];head=bpy.data.objects['CTRL_head'];arm=bpy.data.objects['CTRL_shoulder_L'];elbow=bpy.data.objects['CTRL_elbow_L'];card=bpy.data.objects['CTRL_card'];right=bpy.data.objects['CTRL_shoulder_R']
def curve(frame,points):
    for (a,v),(b,w) in zip(points,points[1:]):
        if frame<=b:
            t=max(0,min(1,(frame-a)/(b-a)));t=t*t*(3-2*t);return v+(w-v)*t
    return points[-1][1]
for f in range(1,151,5):
    root.location.z=.09+.055*math.sin((f-1)/150*math.tau*2)
    root.rotation_euler=(0,math.radians(2*math.sin(f/150*math.tau)),math.radians(curve(f,[(1,0),(35,0),(85,-32),(115,-27),(150,-27)])))
    root.keyframe_insert(data_path='location',frame=f);root.keyframe_insert(data_path='rotation_euler',frame=f)
for f in [1,35,65,90,115,150]:
    arm.rotation_euler[1]=math.radians(curve(f,[(1,0),(35,0),(65,55),(90,98),(115,94),(150,94)]));arm.keyframe_insert(data_path='rotation_euler',frame=f)
    elbow.rotation_euler[1]=math.radians(curve(f,[(1,0),(35,0),(90,-15),(150,-15)]));elbow.keyframe_insert(data_path='rotation_euler',frame=f)
    head.rotation_euler[2]=math.radians(curve(f,[(1,0),(35,0),(90,-12),(150,-7)]));head.keyframe_insert(data_path='rotation_euler',frame=f)
    right.rotation_euler[1]=math.radians(curve(f,[(1,0),(65,-10),(150,-8)]));right.keyframe_insert(data_path='rotation_euler',frame=f)
    p=curve(f,[(1,1),(90,1),(115,1.08),(150,1.03)]);card.scale=(p,p,p);card.keyframe_insert(data_path='scale',frame=f)
# Hold the final authored pose through frame 150; blinking is actual 3D eye scaling.
root.location.z=.09;root.keyframe_insert(data_path='location',frame=150);root.keyframe_insert(data_path='rotation_euler',frame=150)
for eye in [bpy.data.objects['HERO_eye_0'],bpy.data.objects['HERO_eye_1']]:
    for f,a in [(1,1),(37,1),(40,.08),(43,1),(117,1),(120,.08),(123,1),(150,1)]:eye.scale.z=a;eye.keyframe_insert(data_path='scale',frame=f)
s.frame_start=1;s.frame_end=150;s.render.fps=30
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Vision-Mascote-articulado-teste.blend'))
# Structural and pose audit, with exact frame samples for review.
report={'frames':150,'fps':30,'duration':5,'controls':{},'samples':[]}
for o in [root,head,arm,elbow,card]:report['controls'][o.name]={'animated':o.animation_data is not None,'parent':o.parent.name if o.parent else None}
for f in [1,40,75,110,150]:
    s.frame_set(f);bpy.context.view_layer.update()
    pts=[o.matrix_world@Vector(p) for o in bpy.data.objects if o.name.startswith('HERO_') and o.type=='MESH' for p in o.bound_box]
    report['samples'].append({'frame':f,'bounds_min':[min(p[i] for p in pts) for i in range(3)],'bounds_max':[max(p[i] for p in pts) for i in range(3)],'yaw_deg':math.degrees(root.rotation_euler.z),'shoulder_deg':math.degrees(arm.rotation_euler.y)})
(OUT/'VERIFICACAO-3D.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
for f in [1,75,110,150]:
    s.frame_set(f);s.render.filepath=str(OUT/f'pose-{f:03}.png');s.render.image_settings.file_format='PNG';bpy.ops.render.render(write_still=True)
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Vision-Mascote-articulado-teste.blend'))
print('ANIMATION_AND_STILLS_READY',flush=True)
