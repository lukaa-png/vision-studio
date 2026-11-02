# Scene passport: 2.2m stylized mechanical mascot, procedural editable parts.
# Root flight/head/shoulder/elbow controls; pale studio and one presentation card.
# Delivery camera orthographic three-quarter; ceramic/key left, soft cyan fill.
# This file is source for the hosted Blender scene, not a flat-image animation.
import bpy, math
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
OUT=BASE/"build"
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
from mathutils import Vector
scene=bpy.context.scene
def material(name,col,metal=0,rough=.3,emission=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    if emission:p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=emission
    return m
white=material('MAT_ceramic_white',(.80,.87,.90),.15,.24)
dark=material('MAT_graphite',(.006,.012,.025),.35,.26)
visor=material('MAT_optical_visor',(.008,.027,.037),.55,.17)
green=material('MAT_pulso',(.46,.90,.09),.15,.25,1.8)
cyan=material('MAT_information',(.27,.69,.66),.15,.3,.3)
floor=material('MAT_nevoa',(.80,.88,.91),0,.65)
def parent(o,p):
    if p:
        bpy.context.view_layer.update()
        matrix=o.matrix_world.copy();o.parent=p;o.matrix_world=matrix
    return o
def box(name,loc,dim,mat,bevel=.04,p=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dim
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        b=o.modifiers.new('Ceramic_edge_radius','BEVEL');b.width=bevel;b.segments=5
        n=o.modifiers.new('Weighted_normals','WEIGHTED_NORMAL')
    o.data.materials.append(mat);return parent(o,p)
def sphere(name,loc,scale,mat,p=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=1,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(mat)
    for poly in o.data.polygons:poly.use_smooth=True
    return parent(o,p)
def cyl(name,loc,r,depth,mat,p=None,axis='Z'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=name
    if axis=='X':o.rotation_euler[1]=math.pi/2
    if axis=='Y':o.rotation_euler[0]=math.pi/2
    o.data.materials.append(mat);be=o.modifiers.new('Machined_edges','BEVEL');be.width=.012;be.segments=3
    for poly in o.data.polygons:poly.use_smooth=True
    return parent(o,p)
def tube(name,pts,r,mat,p=None):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=r;cu.bevel_resolution=4
    s=cu.splines.new('POLY');s.points.add(len(pts)-1)
    for co,pt in zip(s.points,pts):co.co=(*pt,1)
    ob=bpy.data.objects.new(name,cu);scene.collection.objects.link(ob);ob.data.materials.append(mat);return parent(ob,p)
def ctrl(name,loc,p=None):
    o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);o.location=loc;o.empty_display_type='SPHERE';o.empty_display_size=.08;bpy.context.view_layer.update();return parent(o,p)
root=ctrl('CTRL_flight',(0,0,0))
head=ctrl('CTRL_head',(0,0,1.53),root)
box('HERO_head_ceramic',(0,0,1.90),(.96,.55,.80),white,.19,head)
box('HERO_visor_recess',(0,-.285,1.90),(.855,.09,.685),dark,.16,head)
box('HERO_visor_glass',(0,-.344,1.90),(.78,.075,.60),visor,.145,head)
for i,x in enumerate([-.16,.16]):box('HERO_eye_'+str(i),(x,-.391,1.91),(.075,.032,.225),green,.035,head)
for sx in [-1,1]:
    for sz in [-1,1]:
        x=sx*.377;z=1.9+sz*.29
        tube('HERO_frame_corner_'+str(sx)+'_'+str(sz),[(x-sx*.12,-.395,z),(x,-.395,z),(x,-.395,z-sz*.12)],.035,white,head)
    cyl('HERO_ear_shell_'+str(sx),(sx*.49,0,1.87),.155,.05,dark,head,'X')
    cyl('HERO_ear_pulso_'+str(sx),(sx*.525,0,1.87),.125,.018,green,head,'X')
    cyl('HERO_ear_cap_'+str(sx),(sx*.54,0,1.87),.104,.018,dark,head,'X')
cyl('HERO_neck',(0,0,1.49),.11,.14,dark,root)
box('HERO_torso',(0,0,1.13),(.51,.36,.54),white,.14,root)
box('HERO_chest_badge',(0,-.194,1.15),(.23,.035,.18),dark,.055,root)
tube('HERO_chest_V',[(-.075,-.22,1.19),(0,-.225,1.095),(.075,-.22,1.19)],.022,green,root)
box('HERO_pelvis',(0,0,.82),(.33,.26,.16),dark,.06,root)
for side,sx in [('L',-1),('R',1)]:
    shoulder=(sx*.33,0,1.26);arm=ctrl('CTRL_shoulder_'+side,shoulder,root)
    sphere('HERO_shoulder_'+side,shoulder,(.115,.12,.12),dark,arm)
    cyl('HERO_shoulder_LED_'+side,(sx*.40,-.01,1.26),.075,.025,green,arm,'X')
    box('HERO_upper_arm_'+side,(sx*.355,0,1.08),(.16,.18,.25),white,.065,arm)
    elbow=ctrl('CTRL_elbow_'+side,(sx*.355,0,.94),arm)
    sphere('HERO_elbow_'+side,(sx*.355,0,.94),(.085,.09,.085),dark,elbow)
    box('HERO_forearm_'+side,(sx*.355,-.012,.795),(.17,.19,.22),white,.065,elbow)
    cyl('HERO_wrist_LED_'+side,(sx*.355,-.012,.665),.079,.025,green,elbow)
    sphere('HERO_palm_'+side,(sx*.355,-.015,.60),(.105,.07,.09),white,elbow)
    for j in range(4):
        xx=sx*.355+(j-1.5)*.043
        box('HERO_finger_'+side+'_'+str(j),(xx,-.03,.49),(.037,.052,.105),dark,.017,elbow)
    sphere('HERO_thumb_'+side,(sx*.355-sx*.11,-.02,.59),(.043,.045,.065),dark,elbow)
    hip=ctrl('CTRL_hip_'+side,(sx*.15,0,.79),root)
    sphere('HERO_hip_'+side,(sx*.15,0,.79),(.085,.09,.09),dark,hip)
    box('HERO_thigh_'+side,(sx*.16,0,.655),(.185,.205,.21),white,.07,hip)
    sphere('HERO_knee_'+side,(sx*.16,-.005,.525),(.085,.09,.07),dark,hip)
    box('HERO_shin_'+side,(sx*.17,0,.41),(.17,.19,.17),white,.055,hip)
    box('HERO_foot_'+side,(sx*.19,-.075,.29),(.25,.38,.16),white,.07,hip)
    box('HERO_sole_'+side,(sx*.19,-.075,.218),(.25,.37,.04),dark,.018,hip)
    box('HERO_foot_LED_'+side,(sx*.19,-.25,.29),(.13,.02,.022),green,.008,hip)
box('ENV_floor',(0,0,-.025),(200,200,.05),floor,.0)
card=ctrl('CTRL_card',(-1.35,.05,1.25))
box('PRP_card',(-1.35,.05,1.25),(.75,.08,.52),white,.05,card)
box('PRP_card_green',(-1.35,-.005,1.36),(.59,.025,.16),green,.025,card)
for i in range(2):box('PRP_card_line_'+str(i),(-1.40,-.006,1.2-i*.08),(.47-i*.12,.018,.025),cyan,.008,card)
bpy.ops.object.camera_add(location=(3.5,-8,3.2));cam=bpy.context.object;cam.name='CAM_main';cam.rotation_euler=(Vector((-.35,0,1.22))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.9;scene.camera=cam
def light(name,loc,energy,color,radius):
    bpy.ops.object.light_add(type='POINT',location=loc);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.color=color;o.data.shadow_soft_size=radius
light('LGT_key',(-3,-4,5),1100,(1,.95,.89),2)
light('LGT_fill',(3,-2,3),500,(.68,.87,1),1.5)
light('LGT_rim',(1,3,4),900,(.8,1,.91),1.2)
scene.world=bpy.data.worlds.new('WORLD_studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.80,.88,.91,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.render.engine='CYCLES';scene.render.resolution_x=768;scene.render.resolution_y=576;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.cycles.samples=24;scene.cycles.use_denoising=True;scene.render.fps=30;scene.frame_start=1;scene.frame_end=150
root['purpose']='Whole character flight and yaw';head['purpose']='Head gaze';card['purpose']='Interface response'
scene.render.filepath=str(OUT/'vision3d-blockout.png')
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Vision-Mascote-prototipo.blend'))
