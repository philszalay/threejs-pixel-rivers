import './style.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'

import fragmentShader from './shader/fragment.glsl'
import vertexShader from './shader/vertex.glsl'

import image1 from '../assets/images/test1.jpg'
import image2 from '../assets/images/test2.jpg'
import image3 from '../assets/images/test3.jpg'

import TouchTexture from './TouchTexture'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { CustomPass } from './customPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'

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
// document.body.appendChild(stats.domElement)

// TouchTexture
const touchTexture = new TouchTexture(128)

// Renderer
const renderer = new THREE.WebGLRenderer({
})

// AR Button
const arButton = ARButton.createButton(renderer)
document.body.appendChild(arButton)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(colors.rendererClearColor, 1)
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.xr.enabled = true
document.body.appendChild(renderer.domElement)

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.001,
  1000
)

camera.position.z = 5

// Postprocessing
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const effect1 = new ShaderPass(CustomPass)
effect1.uniforms.uTouchTexture.value = touchTexture.texture
effect1.uniforms.uDimensions.value = new THREE.Vector2(sizes.width, sizes.height)
composer.addPass(effect1)

// Textures
const textureLoader = new THREE.TextureLoader()

const textures = [image1, image2, image3].map(url => {
  return textureLoader.load(url)
})

// Geometries
const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

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
    fragmentShader,
    vertexShader
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = index * 1.5 - 1.5
  mesh.position.y = -3
  mesh.rotation.z = Math.PI / 2
  scene.add(mesh)
  meshes.push(mesh)
})

// Listeners
window.addEventListener('mousemove', onMouseMove, false)

const mousePosition = {
  width: 0,
  height: 0
}

function onMouseMove (e) {
  mousePosition.width = e.clientX
  mousePosition.height = e.clientY
}

// Animation Loop
let time = 0

const tick = () => {
  time += 0.01

  effect1.uniforms.uTime.value = time
  touchTexture.addTouch(touchTexture.getTouchTexturePosition(sizes.width, sizes.height, mousePosition.width, mousePosition.height), 1)

  touchTexture.update()
  stats.update()
  requestAnimationFrame(tick)
  composer.render()
}

tick()
