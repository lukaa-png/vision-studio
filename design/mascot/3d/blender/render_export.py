import bpy,json
from pathlib import Path
BASE=Path(__file__).resolve().parents[1];OUT=BASE/'build'
bpy.ops.wm.open_mainfile(filepath=str(OUT/'Vision-Mascote-articulado-teste.blend'))
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE_NEXT';s.render.resolution_x=960;s.render.resolution_y=540
if hasattr(s.eevee,'taa_render_samples'):s.eevee.taa_render_samples=12
s.render.image_settings.file_format='FFMPEG';s.render.ffmpeg.format='MPEG4';s.render.ffmpeg.codec='H264';s.render.ffmpeg.constant_rate_factor='HIGH'
s.render.filepath=str(OUT/'Vision-3D-teste-5s.mp4');bpy.ops.render.render(animation=True)
# A transparent rendered sample proves the character can be composited over any background.
s.frame_set(110);bpy.data.objects['ENV_floor'].hide_render=True
for o in bpy.data.objects:
    if o.name.startswith('PRP_'):o.hide_render=True
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.filepath=str(OUT/'Vision-3D-transparente.png');bpy.ops.render.render(write_still=True)
bpy.data.objects['ENV_floor'].hide_render=False
for o in bpy.data.objects:
    if o.name.startswith('PRP_'):o.hide_render=False
s.render.film_transparent=False;s.frame_set(1);s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Vision-Mascote-articulado-teste.blend'))
# Export only the character, leaving the editable source untouched on disk.
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.data.objects:
    if o.name.startswith('HERO_') or (o.name.startswith('CTRL_') and o.name!='CTRL_card'):o.select_set(True)
curves=[o for o in bpy.context.selected_objects if o.type=='CURVE']
if curves:
    selected=list(bpy.context.selected_objects);bpy.ops.object.select_all(action='DESELECT')
    for o in curves:o.select_set(True)
    bpy.context.view_layer.objects.active=curves[0];bpy.ops.object.convert(target='MESH')
    for o in bpy.data.objects:
        if o.name.startswith('HERO_') or (o.name.startswith('CTRL_') and o.name!='CTRL_card'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'Vision-Mascote-animado.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_nla_strips_merged_animation_name='Vision_Float_Turn_Point',export_force_sampling=True,export_apply=True)
print('VIDEO_BLEND_GLB_READY',flush=True)
