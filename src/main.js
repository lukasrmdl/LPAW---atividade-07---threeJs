import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { createSkyBox } from './skybox';



const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

let aspecto = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(
  75, //campo de visao vertical
  aspecto, //aspecto da imagem (Largura/Altura)
  0.1, //Plano proximo
  100//Plano distante
);
camera.position.z = 15

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(4, 4, 4)
const texture = new THREE.TextureLoader()
    .load('img/crate.jpg',()=>{
      console.log('Carregou imagem!')
      
      animate()
    });

//caixa
const material = new THREE.MeshBasicMaterial(
{ map: texture });
const cube = new THREE.Mesh(geometry, material)
cube.position.x = 7
cube.position.y = -5
scene.add(cube)

//Luz
var light = new THREE.AmbientLight(0xffff00, 5);
scene.add(light);

//Ponto de Luz
var plight = new THREE.PointLight(0xffff00, 5);
plight.position.set(-30, 30, 4);
scene.add(plight);

//arvore morta

let model1
const modelPath1 = 'models/DeadTree/'
const mtlFile1 = 'DeadTree.mtl'
const objFile1 = 'DeadTree.obj'

const manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

mtlLoader.setPath(modelPath1)
  .load(mtlFile1, (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.setPath(modelPath1).load(objFile1, (object) => {
      model1 = object
      model1.scale.setScalar(.6)//redimensiona o objeto
      model1.position.y=-2.8
      model1.rotation.x=0.4
      scene.add(model1)
      createSkyBox('desert', 70)
      .then(sky=> {
        console.log('sky created')
        console.log(sky)
        scene.add(sky)
      animate()
      })
      .catch(error => console.log(error));
  })
})

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('mousemove',event=>{
    let wh = window.innerHeight
    let my = event.clientY
    if(model1)  model1.rotation.x += (my-wh/2)/wh/100
  })

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)