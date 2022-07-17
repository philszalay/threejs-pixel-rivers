import './style.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

import image1 from '../assets/images/test1.jpg'
import image2 from '../assets/images/test2.jpg'
import image3 from '../assets/images/test3.jpg'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { CustomPass } from './customPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

/**
 * Base
 */

// TODO: LoadingManager

// TODO: Automatic resizing

// Variables
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const colors = {
  rendererClearColor: 0x000000
}

// Canvas
// const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Stats
const stats = Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.top = '0px'
document.body.appendChild(stats.domElement)

// Renderer
const renderer = new THREE.WebGLRenderer({
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(colors.rendererClearColor, 1)
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.001,
  1000
)

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)

camera.position.z = 5

// Postprocessing
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const effect1 = new ShaderPass(CustomPass)
composer.addPass(effect1)

// const effect2 = new ShaderPass(RGBShiftShader)
// effect2.uniforms.amount.value = 0.0015
// composer.addPass(effect2)

// Textures
const textureLoader = new THREE.TextureLoader()

const textures = [image1, image2, image3].map(url => {
  return textureLoader.load(url)
})

// Geometries
const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

// Objects
const meshes = []

textures.forEach((texture, index) => {
  const material = new THREE.RawShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector4() }
    },
    fragmentShader: fragment,
    vertexShader: vertex
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = index * 1.5 - 1.5
  mesh.position.y = -3
  mesh.rotation.z = Math.PI / 2
  scene.add(mesh)
  meshes.push(mesh)
})

// Animation Loop
let time = 0

const tick = () => {
  time += 0.01

  effect1.uniforms.uTime.value = time

  stats.update()
  controls.update()
  requestAnimationFrame(tick)
  composer.render()
}

tick()
